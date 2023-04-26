import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatId: null,
    currentChat: {}
}

const currentChatSlice = createSlice({
    name: "currentChat",
    initialState,
    reducers: {
        setcurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        setChatId: (state, action) => {
            state.chatId = action.payload;
        },
    }
})

export const { setcurrentChat, setChatId } = currentChatSlice.actions;

export default currentChatSlice.reducer;