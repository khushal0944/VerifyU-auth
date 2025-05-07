import { createSlice } from "@reduxjs/toolkit";
import { checkAuth, signup, verifyEmail } from "./asyncFunctions";

interface InitialStateType {
	user: any | null;
	isLoading: boolean;
	error: string | null;
	isAuthenticated: boolean;
	isCheckingAuth: boolean;
}

const initialState: InitialStateType = {
	user: null,
	isLoading: false,
	error: null,
	isAuthenticated: false,
	isCheckingAuth: true,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
        consoleAll: (state) => {
            console.log("User Saved in store", state.user)
            console.log("isLoading Saved in store", state.isLoading);
            console.log("isCheckingAuth Saved in store", state.isCheckingAuth);
            console.log(
				"isAuthenticated Saved in store",
				state.isAuthenticated
			);
            console.log("Error Saved in store", state.error)
        }
    },
	extraReducers: (builder) => {
		builder
			.addCase(signup.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(signup.fulfilled, (state, action) => {
				state.isLoading = false;
                console.log("action payload user ", action.payload.user);
				state.user = action.payload.user;
				state.isAuthenticated = true;
				state.error = null;
				state.isCheckingAuth = false;
			})
			.addCase(signup.rejected, (state, action) => {
				state.error = action.payload as string;
				state.isAuthenticated = false;
				state.isLoading = false;
				state.user = null;
			});

        builder
			.addCase(verifyEmail.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(verifyEmail.fulfilled, (state, action) => {
				state.isLoading = false;
				console.log("action payload user ", action.payload.user);
				state.user = action.payload.user;
				state.isAuthenticated = true;
				state.error = null;
				state.isCheckingAuth = false;
			})
			.addCase(verifyEmail.rejected, (state, action) => {
				state.error = action.payload as string;
				state.isAuthenticated = false;
				state.isLoading = false;
				state.user = null;
			});

            builder
                .addCase(checkAuth.pending, (state) => {
                    state.isCheckingAuth = true;
                    state.error = null
                })
                .addCase(checkAuth.fulfilled, (state, action) => {
                    state.user = action.payload.user;
                    state.isAuthenticated = true;
                    state.isCheckingAuth = false
                })
                .addCase(checkAuth.rejected, (state) => {
                    state.isAuthenticated = false;
                    state.error = null;
                    state.isCheckingAuth = false
                })
	},
});

export default authSlice.reducer;
export const { consoleAll } = authSlice.actions;