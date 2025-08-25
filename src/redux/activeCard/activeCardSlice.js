import { createSlice } from '@reduxjs/toolkit';

//* Khởi tạo giá trị State của một cái Slice trong Redux
const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false,
}


//* Khởi tạo một cái Slice trong lữu trữ - Redux Store
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  //reducers:  nơi xử lí dữ liệu đồng bộ
  reducers: {
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },
    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
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

  // //* Nơi xử lí dữ liệu bất đồng bộ
  // extraReducers: (builder) => {
  // }
})

// Action creators are generated for each case reducer function
export const { showModalActiveCard, clearAndHideCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions

//selectors
export const selectCurrentActiveCard = (state) => state.activeCard.currentActiveCard

export const selectIsShowModalActiveCard = (state) => state.activeCard.isShowModalActiveCard

export const activeCardReducer = activeCardSlice.reducer