export interface User {
	id: string;
	name: string;
	email: string;
	isVerified: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	isCheckingAuth: boolean;
}
