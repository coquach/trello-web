import { Box } from "@mui/material";
import ListColumns from "./ListColumns/ListColumns";
import { mapOrder } from "~/utils/sort";
import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";


function BoardContent({ board }) {
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
    }
  };
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
      </Box>
    </DndContext>
  );
}

export default BoardContent;
