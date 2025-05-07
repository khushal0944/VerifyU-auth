import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";
axios.defaults.withCredentials = true;

interface UserSignupType {
	name: string;
	email: string;
	password: string;
}

const API_BASE_URL = "http://localhost:5000/api/auth";

type SignupAPIResponseType = {
	success: boolean;
	message: string;
	user: any;
};

export const signup = createAsyncThunk(
	"user/signup",
	async ({ email, password, name }: UserSignupType, thunkAPI) => {
		try {
			if (!name || !email || !password) {
				throw new Error("All Fields are Mandatory.");
			}
			const response = await axios.post(`${API_BASE_URL}/signup`, {
				name,
				email,
				password,
			});
			console.log(response.data);
			return response.data as SignupAPIResponseType;
		} catch (error: any) {
			console.error("error signing up", error);
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				"An error occurred.";
			return thunkAPI.rejectWithValue(errorMessage);
		}
	}
);

export const verifyEmail = createAsyncThunk(
	"user/verifyemail",
	async ({ code }: any, thunkAPI) => {
		try {
			if (!code) {
				console.error("verification code is not defined.");
                return thunkAPI.rejectWithValue(
					"Verification code is required."
				);
			}
			const response = await axios.post(`${API_BASE_URL}/verify-email`, {
				code,
			});
			console.log("response from verify email", response.data);
			return response.data;
		} catch (error: any) {
			console.error("Error Verifying email: ", error);
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				"An error occurred.";
			return thunkAPI.rejectWithValue(errorMessage);
		}
	}
);

export const checkAuth = createAsyncThunk(
    "user/checkingAuth",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/check-auth`);
            return response.data;
        } catch (error: any) {
            console.error("Error Checking auth: ", error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "An error occurred.";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);
