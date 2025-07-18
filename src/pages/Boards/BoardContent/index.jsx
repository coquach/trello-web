import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { mapOrder } from "~/utils/sort";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import ListColumns from "./ListColumns/ListColumns";


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

  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: {
  //     distance: 10,
  //   },
  // });

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
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    if (active.id !== over.id) {
      const activeIndex = oderedColumns.findIndex(
        (col) => col._id === active.id
      );
      const overIndex = oderedColumns.findIndex((col) => col._id === over.id);

      // Swap the columns
      const newColumnOrder = arrayMove(oderedColumns, activeIndex, overIndex);
      // const newColumnOrderIds = newColumnOrder.map((col) => col._id);

      setOrderedColumns(newColumnOrder);
      setActiveDragItem({
        id: null,
        type: null,
        data: null,
      });
    }
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
      onDragStart={handleDragStart}
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
