import { createSlice } from "@reduxjs/toolkit";

const initialState = null

const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
        setGroup: (state, action) => {
            return action.payload;
        },
    }
})

export const { setGroup } = groupSlice.actions;

export default groupSlice.reducer;