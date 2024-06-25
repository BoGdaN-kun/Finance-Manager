import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {HomeUser, User} from "../../Interfaces/IUser";

interface UserState {
    users: HomeUser[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<HomeUser[]>) => {
            state.users = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        deleteUserLocally: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(user => user.id !== action.payload);
        },
    },
});

export const { setUsers, setLoading, setError, deleteUserLocally } = userSlice.actions;
export default userSlice.reducer;