import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/reduxStore"; // Adjust import path as needed

const RedirectAuthenticatedUsers = ({ children }: { children: ReactNode }) => {
	const { isAuthenticated, user, isCheckingAuth } = useSelector(
		(state: RootState) => state.auth
	);

	// Wait for auth check to complete
	if (isCheckingAuth) {
		// You could return a loading spinner here 
		return <div>Loading...</div>;
	}

	// Make sure user exists and has verification status before checking
	if (isAuthenticated && user && user.isVerified) {
		console.log("User is authenticated and verified, redirecting to home");
		return <Navigate to={"/"} replace />;
	}

	// If authenticated but not verified, redirect to verification page
	if (isAuthenticated && user && !user.isVerified) {
		console.log(
			"User is authenticated but not verified, redirecting to verify-email"
		);
		return <Navigate to={"/verify-email"} replace />;
	}

	return <>{children}</>;
};

export default RedirectAuthenticatedUsers;
