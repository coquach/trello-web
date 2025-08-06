import { Box, Button } from "@mui/material";
import Column from "./Column/Column";
import { NoteAdd } from "@mui/icons-material";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

function ListColumns({ columns }) {
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box
        sx={{
          backgroundColor: "inherit",
          width: "100%",
          height: "100%",
          display: "flex",
          overflowY: "hidden",
          overflowX: "auto",
          "&::-webkit-scrollbar-track": {
            margin: 2,
          },
        }}
      >
        {columns?.map((column) => (
          <Column key={column._id} column={column} />
        ))}
        <Box
          sx={{
            minWidth: "200px",
            maxWidth: "200px",
            borderRadius: "6px",
            marginX: 2,
            height: "fit-content",
            backgroundColor: "#ffffff3d",
          }}
        >
          <Button
            startIcon={<NoteAdd />}
            sx={{
              color: "white",
              width: "100%",
              justifyContent: "flex-start",
              paddingLeft: 2.5,
              paddingY: 1,
            }}
          >
            Add new column
          </Button>
        </Box>
      </Box>
    </SortableContext>
  );
}

export default ListColumns;
