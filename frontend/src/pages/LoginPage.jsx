import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const { login, isLoading, error } = useAuthStore();

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			await login(email, password);

			// Get the latest state after login attempt
			const { user, isAuthenticated } = useAuthStore.getState();

			// Check if user exists but email is not verified
			if (user && !user.isVerified) {
				navigate("/verify-email");
				toast.error("Please verify your email before logging in.");
				return;
			}

			// If authenticated successfully, redirect to dashboard
			if (isAuthenticated) {
				navigate("/dashboard");
				toast.success("Login Successful");
			}
		} catch (error) {

			// Extract error message
			const errorMessage =
				error?.response?.data?.message ||
				error?.message ||
				"Login failed";

			// Check if error is related to email verification
			if (
				errorMessage.toLowerCase().includes("verify") ||
				errorMessage.toLowerCase().includes("verification") ||
				errorMessage.toLowerCase().includes("not verified")
			) {
				navigate("/verify-email");
				toast.error("Please verify your email to continue.");
			} else {
				toast.error(errorMessage);
			}
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
		>
			<div className="p-8">
				<h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
					Welcome Back
				</h2>

				<form onSubmit={handleLogin}>
					<Input
						icon={Mail}
						type="email"
						placeholder="Email Address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>

					<Input
						icon={Lock}
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					<div className="flex items-center mb-6">
						<Link
							to="/forgot-password"
							className="text-sm text-green-400 hover:underline"
						>
							Forgot password?
						</Link>
					</div>

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
						type="submit"
						disabled={isLoading}
					>
						{isLoading ? (
							<Loader className="w-6 h-6 animate-spin mx-auto" />
						) : (
							"Login"
						)}
					</motion.button>
				</form>
			</div>
			<div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
				<p className="text-sm text-gray-400">
					Don't have an account?{" "}
					<Link
						to="/signup"
						className="text-green-400 hover:underline"
					>
						Sign up
					</Link>
				</p>
			</div>
		</motion.div>
	);
};
export default LoginPage;