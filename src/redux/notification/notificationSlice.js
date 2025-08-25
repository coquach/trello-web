import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authorizedAxiosInstance from '~/utils/authorizeAxios';
import { API_ROOT } from '~/utils/constants';

//* Khởi tạo giá trị State của một cái Slice trong Redux
const initialState = {
  currentNotifications: null,
}
export const fetchInvitationsAPI = createAsyncThunk(
  'notifications/fetchInvitationsAPI',
  async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/invitations`)

    return response.data
  }
)

export const updateBoardInvitationAPI = createAsyncThunk(
  'notifications/updateBoardInvitationAPI',
  async ({ status, invitationId }) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/invitations/board/${invitationId}`, { status })

    return response.data
  }
)


//* Khởi tạo một cái Slice trong lữu trữ - Redux Store
export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  //reducers:  nơi xử lí dữ liệu đồng bộ
  reducers: {

    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      //action.payload là chuẩn đặt tên nhận dữ liệu vào của reducer
      const notifications = action.payload

      //Xử lí dữ liệu

      //Update dữ liệu của currentNotifications
      state.currentNotifications = notifications
    },
    addNotification: (state, action) => {
      const incomingInvitation = action.payload
      state.currentNotifications.unshift(incomingInvitation)
    }
  },

  // //* Nơi xử lí dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
      const incomingInvitation = action.payload

      state.currentNotifications = Array.isArray(incomingInvitation) ? incomingInvitation.reverse() : []
    })
    builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action)=> {
      const incomingInvitation = action.payload

      const getInvitation = state.currentNotifications.find(i => i._id === incomingInvitation._id)

      getInvitation.boardInvitation = incomingInvitation.boardInvitation
    })
  }
})

// Action creators are generated for each case reducer function
export const { clearCurrentNotifications, updateCurrentNotifications, addNotification } = notificationsSlice.actions

//selectors
export const selectCurrentNotifications = (state) => state.notifications.currentNotifications


export const notificationsReducer = notificationsSlice.reducer