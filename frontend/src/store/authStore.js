import { create } from "zustand";
import axios from "axios";

const isDev = !!import.meta.env.VITE_DEV;
const API_HOST = import.meta.env.VITE_API_URL || (isDev ? "http://localhost:5000" : "");
const API_BASE = `${API_HOST}/api/auth`;

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    timeout: 10000,
});

const getErrorMessage = (err, fallback = "Something went wrong") =>
    err?.response?.data?.message || err?.message || fallback;

export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isCheckingAuth: false,
    error: null,
    message: null,

    clearError: () => set({ error: null }),
    clearMessage: () => set({ message: null }),

    signup: async (email, password, name) => {
        set({ isLoading: true, error: null, message: null });
        try {
            if (!email || !password || !name) throw new Error("Name, email and password are required.");
            const res = await api.post("/signup", { email, password, name });

            set({
                user: res.data.user ?? null,
                isAuthenticated: false,
                isLoading: false,
                message: res.data.message ?? "Verification email sent.",
            });
            return res.data;
        } catch (err) {
            const msg = getErrorMessage(err, "Error creating account.");
            set({ error: msg, isLoading: false });
            throw err;
        }
    },

    verifyEmail: async (code, email) => {
        set({ isLoading: true, error: null, message: null });
        try {
            if (!code) throw new Error("Verification code is required.");
            const res = await api.post("/verify-email", { code, email });

            const user = res.data.user ?? null;
            set({
                user,
                isAuthenticated: !!user && (user.isVerified ?? true),
                isLoading: false,
                message: res.data.message ?? null,
            });
            return res.data;
        } catch (err) {
            const msg = getErrorMessage(err, "Error verifying email.");
            set({ error: msg, isLoading: false });
            throw err;
        }
    },

    resendVerification: async (email) => {
        set({ isLoading: true, error: null, message: null });
        try {
            if (!email) throw new Error("Email is required.");

            const res = await api.post("/resend-verify-email", { email });

            set({
                isLoading: false,
                message: res.data.message ?? "Verification email sent.",
            });

            return res.data;
        } catch (err) {
            const msg = getErrorMessage(err, "Error sending verification email.");
            set({ error: msg, isLoading: false });
            throw err;
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null, message: null });
        try {
            if (!email || !password) throw new Error("Email and password are required.");
            const res = await api.post("/login", { email, password });

            const user = res.data.user ?? null;
            const verified = !!user && (user.isVerified ?? true);

            set({
                user,
                isAuthenticated: verified,
                isLoading: false,
                message: verified ? null : "Please verify your email to complete login.",
            });

            return res.data;
        } catch (err) {
            const msg = getErrorMessage(err, "Error logging in.");
            set({ error: msg, isLoading: false });
            throw err;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await api.post("/logout");
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
                message: null,
            });
        } catch (err) {
            const msg = getErrorMessage(err, "Error logging out.");
            set({ error: msg, isLoading: false });
            throw err;
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const res = await api.get("/check-auth");
            const user = res.data.user ?? null;
            const verified = !!user && (user.isVerified ?? true);
            set({
                user,
                isAuthenticated: verified,
                isCheckingAuth: false,
            });

            return res.data;
        } catch (err) {
            set({
                user: null,
                isAuthenticated: false,
                isCheckingAuth: false,
            });
            return null;
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null, message: null });
        try {
            if (!email) throw new Error("Email is required.");
            const res = await api.post("/forgot-password", { email });
            set({ message: res.data.message ?? "Password reset email sent.", isLoading: false });
            return res.data;
        } catch (err) {
            const msg = getErrorMessage(err, "Error sending password reset email.");
            set({ error: msg, isLoading: false });
            throw err;
        }
    },

    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null, message: null });
        try {
            if (!password) throw new Error("Password is required.");
            const res = await api.post(`/reset-password/${token}`, { password });
            set({ message: res.data.message ?? "Password reset successful.", isLoading: false });
            return res.data;
        } catch (err) {
            const msg = getErrorMessage(err, "Error resetting password.");
            set({ error: msg, isLoading: false });
            throw err;
        }
    },
}));
