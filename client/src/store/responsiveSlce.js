import { createSlice } from '@reduxjs/toolkit'

const initialState = 'none'

const responsiveSlice = createSlice({
    name: 'responsive',
    initialState,
    reducers: {
        showUsers(state, action) {
            if (action.payload == 'none') {
                return state = 'flex'
            }
            else {
                return state = 'none'
            }
        }
    }
})

export const { showUsers } = responsiveSlice.actions
export default responsiveSlice.reducer