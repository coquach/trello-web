import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { mapOrder } from "~/utils/sort";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import ListColumns from "./ListColumns/ListColumns";
import { cloneDeep, set } from "lodash";

function BoardContent({ board }) {
  const ACTIVE_DRAG_ITEM_TYPE = {
    COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
    CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
  };

  const [activeDragItem, setActiveDragItem] = useState({
    id: null,
    type: null,
    data: null,
  });
  const [oldColumnWhenDragStartCard, setOldColumnWhenDragStartCard] =
    useState(null);

  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: {
  //     distance: 10,
  //   },
  // });

  const findColumnByCardId = (cardId) =>
    oderedColumns.find((col) => col.cards.some((card) => card._id === cardId));

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

  const [oderedColumns, setOrderedColumns] = useState([]);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
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
      data: { current: activeDraggingCarData },
    } = active;
    const { id: overCardId } = over;

    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);
    if (!activeColumn || !overColumn) {
      return;
    }
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prevColumns) => {
        const overCardIndex = overColumn.cards.findIndex(
          (card) => card._id === overCardId
        );

        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        const newCardIndex =
          overCardIndex >= 0
            ? overCardIndex + modifier
            : overColumn.cards.length + 1;

        const nextColumns = cloneDeep(prevColumns);
        const nextActiveColumn = nextColumns.find(
          (column) => column._id === activeColumn._id
        );
        const nextOverColumn = nextColumns.find(
          (column) => column._id === overColumn._id
        );

        if (nextActiveColumn) {
          nextActiveColumn.cards = nextActiveColumn.cards.filter(
            (card) => card._id !== activeDraggingCarData._id
          );
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
            (card) => card._id
          );
        }
        if (nextOverColumn) {
          nextOverColumn.cards = nextOverColumn.cards.filter(
            (card) => card._id !== activeDraggingCarData._id
          );
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(
            newCardIndex,
            0,
            activeDraggingCarData
          );
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
            (card) => card._id
          );
        }
        return nextColumns;
      });
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
        data: { current: activeDraggingCarData },
      } = active;
      const { id: overCardId } = over;

      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);
      if (!activeColumn || !overColumn) {
        return;
      }
      if (oldColumnWhenDragStartCard._id !== overColumn._id) {
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

        setOrderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns);
          const nextActiveColumn = nextColumns.find(
            (column) => column._id === overColumn._id
          );
          if (nextActiveColumn) {
            nextActiveColumn.cards = orderedColumn;
            nextActiveColumn.cardOrderIds = orderedColumn.map((card) => card._id);
          }
          return nextColumns;
        })
      }
    }

    if (
      activeDragItem.type === ACTIVE_DRAG_ITEM_TYPE.COLUMN &&
      active.id !== over.id
    ) {
      const oldColumnIndex = oderedColumns?.findIndex(
        (col) => col._id === active.id
      );
      const newColumnIndex = oderedColumns?.findIndex(
        (col) => col._id === over.id
      );

      // Swap the columns
      const newColumnOrder = arrayMove(
        oderedColumns,
        oldColumnIndex,
        newColumnIndex
      );
      // const newColumnOrderIds = newColumnOrder.map((col) => col._id);

      setOrderedColumns(newColumnOrder);
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

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          width: "100%",
          height: (theme) => theme.trello.boardContainerHeight,
          padding: "10px 0",
        }}
      >
        <ListColumns columns={oderedColumns} />
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
