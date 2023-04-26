import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice"
import messagesReducer from "./messagesSlice"
import notificationsReducer from "./notificationsSlice"
import currentChatReducer from "./currentChatSlice"
import userReducer from "./userSlice"
import groupReducer from "./groupSlice"
import responsiveReducer from './responsiveSlce'
import windowReducer from './windowSlice'

export const store = configureStore({
    reducer: {
        users: usersReducer,
        messages: messagesReducer,
        notifications: notificationsReducer,
        currentChat: currentChatReducer, 
        group: groupReducer,
        user: userReducer,
        responsive: responsiveReducer,
        window: windowReducer,
    },
})

export default store;