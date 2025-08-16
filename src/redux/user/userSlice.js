import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authorizedAxiosInstance from '~/utils/authorizeAxios';
import { API_ROOT } from '~/utils/constants';

//* Khởi tạo giá trị State của một cái Slice trong Redux
const initialState = {
  currentUser: null,
}

export const loginUserAPI = createAsyncThunk(
  'loginUser/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data);
    return response.data;
  }
)

//* Khởi tạo một cái Slice trong lữu trữ - Redux Store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  //reducers:  nơi xử lí dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      //action.payload là chuẩn đặt tên nhận dữ liệu vào của reducer
      const user = action.payload

      //Xử lí dữ liệu

      //Update dữ liệu của currentActiveBoard
      state.currentUser = user
    }
  },

  //* Nơi xử lí dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      // eslint-disable-next-line prefer-const
      let user = action.payload

      state.currentUser = user
    })
  }
})

// Action creators are generated for each case reducer function
// export const { update } = userSlice.actions

//selectors
export const selectCurrentActiveUser = (state) => state.user.currentUser

export const userReducer = userSlice.reducer