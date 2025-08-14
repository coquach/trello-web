import { Box, CircularProgress, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { cloneDeep } from 'lodash';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  moveCardToDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
} from '~/apis/index';
import AppBar from '~/components/AppBar/index';
import {
  fetchBoardDetailsAPI,
  selectCurrentActiveBoard,
  updateCurrentActiveBoard,
} from '~/redux/activeBoard/activeBoardSlice';
import BoardBar from './BoardBar/index';
import BoardContent from './BoardContent/index';
import { useParams } from 'react-router-dom';
function Board() {
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);
  const { boardId } = useParams();

  useEffect(() => {
    // const boardId = '689609f918e181bf194a4744';

    dispatch(fetchBoardDetailsAPI(boardId));
  }, [dispatch, boardId]);

  const moveColumns = (dndOrderColumns) => {
    const dndOrderColumnsIds = dndOrderColumns.map((c) => c._id);
    const newBoard = cloneDeep(board);
    newBoard.columns = dndOrderColumns;
    newBoard.columnOrderIds = dndOrderColumnsIds;

    dispatch(updateCurrentActiveBoard(newBoard));

    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderColumnsIds,
    });
  };

  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    const newBoard = cloneDeep(board);
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }

    dispatch(updateCurrentActiveBoard(newBoard));

    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds });
  };

  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    console.log(currentCardId);

    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnsOrderIds = dndOrderedColumnsIds;
    dispatch(updateCurrentActiveBoard(newBoard));

    let prevCardOrderIds = dndOrderedColumns.find(
      (c) => c._id === prevColumnId
    )?.cardOrderIds;

    if (prevCardOrderIds[0].includes('placeholder-card')) {
      prevCardOrderIds = [];
    }

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)
        ?.cardOrderIds,
    });
  };

  if (!board) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100vw',
          height: '100vh',
        }}
      >
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    );
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  );
}

export default Board;
