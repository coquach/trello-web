import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios';
import { isEmpty } from 'lodash';
import { API_ROOT } from '~/utils/constants';
import { generatePlaceholderCard } from '~/utils/formatter';
import { mapOrder } from '~/utils/sort';

//* Khởi tạo giá trị State của một cái Slice trong Redux
const initialState = {
  currentActiveCard: null,
}


//* Khởi tạo một cái Slice trong lữu trữ - Redux Store
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  //reducers:  nơi xử lí dữ liệu đồng bộ
  reducers: {
    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null
    },
    updateCurrentActiveCard: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      //action.payload là chuẩn đặt tên nhận dữ liệu vào của reducer
      const card = action.payload

      //Xử lí dữ liệu

      //Update dữ liệu của currentActiveCard
      state.currentActiveCard = card
    }
  },

  //* Nơi xử lí dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    
  }
})

// Action creators are generated for each case reducer function
export const { clearCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions

//selectors
export const selectCurrentActiveCard = (state) => state.activeCard.currentActiveCard

export const activeCardReducer = activeCardSlice.reducer