import {Box} from "@mui/material";
function BoardContent() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#34495e" : "#1976d2"),
        borderBottom: "1px solid white",
        width: "100%",
        height: (theme) =>
          `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
        display: "flex",
        alignItems: "center",
      }}
    >
      Content
    </Box>
  );
}

export default BoardContent;
