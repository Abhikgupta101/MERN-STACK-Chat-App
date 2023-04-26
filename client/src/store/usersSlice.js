import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        allUsers(state, action) {
            return action.payload
        }
    }
})

export const { allUsers } = usersSlice.actions
export default usersSlice.reducer


//THUNK

export function fetchUsers(baseUrl) {
    return async function fetchUsersThunk(dispatch) {
        try {
            const response = await fetch(`${baseUrl}/api/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors'
            })
            const json = await response.json()
            if (response.ok) {
                dispatch(allUsers(json))
            }
            // console.log(json)
        } catch (err) {
            console.log(err);
        }
    }
}