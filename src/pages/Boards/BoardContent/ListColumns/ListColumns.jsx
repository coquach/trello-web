import { Box, Button } from "@mui/material";
import Column from "./Column/Column";
import { NoteAdd } from "@mui/icons-material";

function ListColumns() {
  return (
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
      <Column />
      <Column />
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
  );
}

export default ListColumns;
