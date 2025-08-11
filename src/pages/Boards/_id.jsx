import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import {
  createNewCardAPI,
  createNewColumnAPI,
  deleteColumnDetailsAPI,
  fetchBoardDetailsAPI,
  moveCardToDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
} from '~/apis/index';
import AppBar from '~/components/AppBar/index';
import BoardBar from './BoardBar/index';
import BoardContent from './BoardContent/index';
import { isEmpty } from 'lodash';
import { generatePlaceholderCard } from '~/utils/formatter';
import { mapOrder } from '~/utils/sort';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ClassSharp } from '@mui/icons-material';
import { ClassNames } from '@emotion/react';
import { toast } from 'react-toastify';
function Board() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const boardId = '689609f918e181bf194a4744';

    fetchBoardDetailsAPI(boardId).then((data) => {
      data.columns = mapOrder(data.columns, data.columnOrderIds, '_id');

      data.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          const placeHolderCard = generatePlaceholderCard(column);
          column.cards = [placeHolderCard];
          column.cardOrderIds = [placeHolderCard._id];
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id');
        }
      });
      setBoard(data);
    });
  }, []);

  const createNewColumn = async (columnData) => {
    const createdColumn = await createNewColumnAPI({
      ...columnData,
      boardId: board._id,
    });

    const placeHolderCard = generatePlaceholderCard(createdColumn);
    createdColumn.cards = [placeHolderCard];
    createdColumn.cardOrderIds = [placeHolderCard._id];

    const newBoard = { ...board };
    newBoard.columns.push(createdColumn);
    newBoard.columnOrderIds.push(createdColumn._id);

    setBoard(newBoard);
  };

  const createNewCard = async (cardData) => {
    const createdCard = await createNewCardAPI({
      ...cardData,
      boardId: board._id,
    });

    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdCard.columnId
    );
    if (columnToUpdate) {
      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard];
        columnToUpdate.cardOrderIds = [createdCard._id];
      } else {
        columnToUpdate.cards.push(createdCard);
        columnToUpdate.cardOrderIds.push(createdCard._id);
      }
    }

    setBoard(newBoard);
  };

  const moveColumns = (dndOrderColumns) => {
    const dndOrderColumnsIds = dndOrderColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderColumns;
    newBoard.columnOrderIds = dndOrderColumnsIds;

    setBoard(newBoard);

    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderColumnsIds,
    });
  };

  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }

    setBoard(newBoard);

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
    setBoard(newBoard);

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

  const deleteColumnDetails = (columnId) => {
    const newBoard = { ...board };
    newBoard.columns = newBoard.columns.filter((c) => c._id !== columnId);
    newBoard.columnsOrderIds = newBoard.columnOrderIds.filter(
      (_id) => _id !== columnId
    );
    setBoard(newBoard);

    deleteColumnDetailsAPI(columnId).then((res) => {
      toast.success(res?.result);
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
        createNewCard={createNewCard}
        createNewColumn={createNewColumn}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  );
}

export default Board;
