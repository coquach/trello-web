import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { fetchBoardDetailsAPI } from "~/apis/index";
import AppBar from "~/components/AppBar/index";
import BoardBar from "./BoardBar/index";
import BoardContent from "./BoardContent/index";
function Board() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const boardId = "689609f918e181bf194a4744";

    fetchBoardDetailsAPI(boardId).then((data) => {
      setBoard(data);
    });
  }, []);

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  );
}

export default Board;
