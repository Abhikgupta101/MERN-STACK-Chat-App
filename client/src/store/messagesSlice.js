import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setMessages: (state, action) => {
            if (Array.isArray(action.payload)) { return action.payload }
            else { state.push(action.payload) }

        },
        updateMessages(state, action) {
            return state.map((item) => {
                if (item._id === action.payload) {
                    let newMessages = {
                        text: "message was deleted",
                        user_id: item.user_id,
                        user_name: item.user_name,
                        _id: item._id
                    }
                    return newMessages
                }
                return item
            })
        },
    }
})

export const { setMessages, updateMessages } = messagesSlice.actions;

export default messagesSlice.reducer;

export function fetchSingleChat(id, baseUrl) {
    return async function fetchSingleChatThunk(dispatch) {
        try {
            const response = await fetch(`${baseUrl}/api/chats/singleChat/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors'
            })
            const json = await response.json()
            if (response.ok) {
                dispatch(setMessages(json))
            }
            // console.log(json)
        } catch (err) {
            console.log(err);
        }
    }
}