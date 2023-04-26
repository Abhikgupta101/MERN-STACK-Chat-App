import { createSlice } from '@reduxjs/toolkit'

const initialState = 1000

const windowSlice = createSlice({
    name: 'window',
    initialState,
    reducers: {
        showSize(state, action) {
            return state = action.payload
        }
    }
})

export const { showSize } = windowSlice.actions
export default windowSlice.reducer