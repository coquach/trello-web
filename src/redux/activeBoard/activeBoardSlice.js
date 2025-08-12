import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { isEmpty } from 'lodash';
import { API_ROOT } from '~/utils/constants';
import { generatePlaceholderCard } from '~/utils/formatter';
import { mapOrder } from '~/utils/sort';

//* Khởi tạo giá trị State của một cái Slice trong Redux
const initialState = {
  currentActiveBoard: null,
}

export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
    console.log("Board details fetched:", response.board);
    return response.board;
  }
)

//* Khởi tạo một cái Slice trong lữu trữ - Redux Store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  //reducers:  nơi xử lí dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      //action.payload là chuẩn đặt tên nhận dữ liệu vào của reducer
      const board = action.payload

      //Xử lí dữ liệu

      //Update dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    }
  },

  //* Nơi xử lí dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled), (state, action) => {
      const board = action.payload

      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id');

      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          const placeHolderCard = generatePlaceholderCard(column);
          column.cards = [placeHolderCard];
          column.cardOrderIds = [placeHolderCard._id];
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id');
        }
      });

      state.currentActiveBoard = board
    }

  }
})

// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

//selectors
export const selectCurrentActiveBoard = (state) => state.activeBoard.currentActiveBoard

export const activeBoardReducer = activeBoardSlice.reducer