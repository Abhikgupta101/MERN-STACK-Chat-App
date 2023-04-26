import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {},
    chat: []
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        allChats(state, action) {
            state.chat = action.payload
        },
        addChat(state, action) {
            state.chat.unshift(action.payload)
        },
        updateChats(state, action) {
            state.chat = state.chat.map((item) => {
                if (item._id === action.payload.chatId) {
                    let newChat = {
                        ...item, lastMessage:
                        {
                            text: action.payload.text,
                            user_id: action.payload.user_id,
                            user_name: action.payload.user_name
                        }
                    }
                    return newChat
                }
                return item
            })
        },
        removeChats(state, action) {
            state.chat = state.chat.filter((item) => item._id !== action.payload)
        }
    }
})

export const { setUser, allChats, updateChats, removeChats, addChat } = userSlice.actions;

export default userSlice.reducer;


//THUNK

export function fetchUser(id, baseUrl) {
    return async function fetchUserThunk(dispatch) {
        try {
            const response = await fetch(`${baseUrl}/api/user/info/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors'
            })
            const json = await response.json()
            if (response.ok) {
                dispatch(setUser({
                    name: json.name,
                    avatar: json.avatar,
                    _id: json._id
                }))

                dispatch(allChats(json.chats))
            }
            // console.log(json)
        } catch (err) {
            console.log(err);
        }
    }
}