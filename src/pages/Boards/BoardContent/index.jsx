import {
  closestCorners,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Box } from "@mui/material";
import { cloneDeep, isEmpty } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { MouseSensor, TouchSensor } from "~/customLibraries/DndKitSensor";
import { generatePlaceholderCard } from "~/utils/formatter";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import ListColumns from "./ListColumns/ListColumns";

function BoardContent({
  board,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn,

}) {
  const ACTIVE_DRAG_ITEM_TYPE = {
    COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
    CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
  };

  const [activeDragItem, setActiveDragItem] = useState({
    id: null,
    type: null,
    data: null,
  });
  const [oldColumnWhenDragStartCard, setOldColumnWhenDragStartCard] =
    useState(null);

  const findColumnByCardId = (cardId) =>
    orderedColumns.find((col) => col.cards.some((card) => card._id === cardId));

  const moveCardBetweenDifferentColumns = (
    active,
    over,
    overCardId,
    activeDraggingCardId,
    activeDraggingCardData,
    activeColumn,
    overColumn,
    triggerFrom
  ) => {
    setOrderedColumns((prevColumns) => {
      const overCardIndex = overColumn.cards.findIndex(
        (card) => card._id === overCardId
      );

      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 1 : 0;
      const newCardIndex =
        overCardIndex >= 0 ? overCardIndex + modifier : overColumn.cards.length;

      const nextColumns = cloneDeep(prevColumns);
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      );

      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        );
      }
      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        };

        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        );
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard
        );
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        );
      }

      if (triggerFrom === 'handleDragEnd') {
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnWhenDragStartCard._id,
          nextOverColumn._id,
          nextColumns
        );
      }
      return nextColumns;
    });
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 50,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = useState([]);

  const lastOverId = useRef(null);

  useEffect(() => {
    setOrderedColumns(board.columns);
  }, [board]);

  const handleDragStart = (event) => {
    const dragData = event?.active?.data?.current || {};
    const isCard = !!dragData?.columnId;

    setActiveDragItem({
      id: event?.active?.id,
      type: isCard ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN,
      data: dragData,
    });
    if (isCard) {
      setOldColumnWhenDragStartCard(findColumnByCardId(dragData._id));
    }
  };
  const handleDragOver = (event) => {
    if (activeDragItem.type === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Handle card drag over logic here
      return;
    }
    const { active, over } = event;

    if (!active || !over) {
      return;
    }
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    const { id: overCardId } = over;

    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);
    if (!activeColumn || !overColumn) {
      return;
    }

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        active,
        over,
        overCardId,
        activeDraggingCardId,
        activeDraggingCardData,
        activeColumn,
        overColumn,
        'handleDragOver'
      );
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!active || !over) {
      return;
    }
    if (activeDragItem.type === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active;
      const { id: overCardId } = over;

      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);
      if (!activeColumn || !overColumn) {
        return;
      }
      if (oldColumnWhenDragStartCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          active,
          over,
          overCardId,
          activeDraggingCardId,
          activeDraggingCardData,
          activeColumn,
          overColumn,
          'handleDragEnd'
        );
      } else {
        const oldCardIndex = oldColumnWhenDragStartCard?.cards?.findIndex(
          (card) => card._id === activeDragItem.id
        );
        const newCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId
        );
        const orderedColumn = arrayMove(
          oldColumnWhenDragStartCard?.cards,
          oldCardIndex,
          newCardIndex
        );

        if (newCardIndex === oldCardIndex) {
          return;
        }

        const orderedColumnIds = orderedColumn.map((card) => card._id);

        setOrderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns);
          const nextActiveColumn = nextColumns.find(
            (column) => column._id === overColumn._id
          );
          if (nextActiveColumn) {
            nextActiveColumn.cards = orderedColumn;
            nextActiveColumn.cardOrderIds = orderedColumnIds;
          }
          return nextColumns;
        });

        moveCardInTheSameColumn(
          orderedColumn,
          orderedColumnIds,
          oldColumnWhenDragStartCard._id
        );
      }
    }

    if (
      activeDragItem.type === ACTIVE_DRAG_ITEM_TYPE.COLUMN &&
      active.id !== over.id
    ) {
      const oldColumnIndex = orderedColumns?.findIndex(
        (col) => col._id === active.id
      );
      const newColumnIndex = orderedColumns?.findIndex(
        (col) => col._id === over.id
      );

      // Swap the columns
      const newColumnOrder = arrayMove(
        orderedColumns,
        oldColumnIndex,
        newColumnIndex
      );
      // const newColumnOrderIds = newColumnOrder.map((col) => col._id);
      setOrderedColumns(newColumnOrder);

      moveColumns(newColumnOrder);
    }
    setActiveDragItem({
      id: null,
      type: null,
      data: null,
    });
    setOldColumnWhenDragStartCard(null);
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: 0.5,
        },
      },
    }),
  };

  const collisionDetection = useCallback(
    (args) => {
      // Nếu kéo column thì giữ nguyên closestCorners
      if (activeDragItem.type === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners(args);
      }

      // Lấy vùng giao nhau ưu tiên con trỏ
      const pointerIntersection = pointerWithin(args);
      const intersections =
        pointerIntersection.length > 0
          ? pointerIntersection
          : rectIntersection(args);

      let overId = getFirstCollision(intersections, 'id');

      // Nếu over là column, tìm card gần nhất bên trong
      if (overId) {
        const checkColumn = orderedColumns.find(
          (column) => column._id === overId
        );
        if (checkColumn) {
          const closestCardId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) =>
                container.id !== overId &&
                checkColumn?.cardOrderIds?.includes(container.id)
            ),
          })[0]?.id;

          overId = closestCardId ?? overId;
        }

        lastOverId.current = overId;
        return [{ id: overId }];
      }

      // Fallback khi không có overId
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItem.type, orderedColumns]
  );

  return (
    <DndContext
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          width: '100%',
          height: (theme) => theme.trello.boardContainerHeight,
          padding: '10px 0',
        }}
      >
        <ListColumns
          columns={orderedColumns}
        />
        <DragOverlay dropAnimation={dropAnimation}>
          {activeDragItem.type === ACTIVE_DRAG_ITEM_TYPE.COLUMN ? (
            <Column column={activeDragItem.data} />
          ) : null}
          {activeDragItem.type === ACTIVE_DRAG_ITEM_TYPE.CARD ? (
            <Card card={activeDragItem.data} />
          ) : null}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;
