import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            if (Array.isArray(action.payload)) { return action.payload }
            else { state.push(action.payload) }

        }
        ,
        removeNotification: (state, action) => {
            return state.filter((item) => item.room !== action.payload)
        }

    }
})

export const { setNotifications, removeNotification } = notificationsSlice.actions;

export default notificationsSlice.reducer;