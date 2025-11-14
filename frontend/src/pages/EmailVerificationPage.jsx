import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const EmailVerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const [timer, setTimer] = useState(30);
	const [canResend, setCanResend] = useState(false);
	const inputRefs = useRef([]);
	const navigate = useNavigate();

	const { isLoading, verifyEmail, user, resendVerification } =
		useAuthStore();

	// Timer countdown
	useEffect(() => {
		if (timer > 0) {
			const interval = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);
			return () => clearInterval(interval);
		} else {
			setCanResend(true);
		}
	}, [timer]);

	const handleChange = (index, value) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex(
				(digit) => digit !== ""
			);
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	const handleResendCode = async () => {
		try {
			// Call your resend verification code function
			await resendVerification(user.email);
			toast.success("Verification code sent successfully");
			setTimer(30);
			setCanResend(false);
			setCode(["", "", "", "", "", ""]);
		} catch (error) {
			toast.error("Failed to resend code. Please try again.");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const verificationCode = code.join("");
		try {
			await verifyEmail(verificationCode, user.email);
			navigate("/login");
			toast.success("Email verified successfully");
		} catch (error) {
			toast.error(error?.response.data.message);
		}
	};

	// Auto submit when all fields are filled
	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit"));
		}
	}, [code]);

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
			>
				<div className="flex items-center mb-6">
					<button
						onClick={() => navigate("/login")}
						className="text-gray-400 hover:text-green-400 transition-colors"
					>
						<ArrowLeft size={24} />
					</button>
					<h2 className="flex-1 text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
						Verify Your Email
					</h2>
					<div className="w-6"></div> {/* Spacer for alignment */}
				</div>
				<p className="text-center text-gray-300 mb-6">
					Enter the 6-digit code sent to your email address.
				</p>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="flex justify-between">
						{code.map((digit, index) => (
							<input
								key={index}
								ref={(el) => (inputRefs.current[index] = el)}
								type="text"
								maxLength="6"
								value={digit}
								onChange={(e) =>
									handleChange(index, e.target.value)
								}
								onKeyDown={(e) => handleKeyDown(index, e)}
								className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
							/>
						))}
					</div>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						type="submit"
						disabled={isLoading || code.some((digit) => !digit)}
						className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
					>
						{isLoading ? "Verifying..." : "Verify Email"}
					</motion.button>
				</form>

				<div className="mt-6 text-center">
					{canResend ? (
						<button
							onClick={handleResendCode}
							className="text-green-400 hover:text-green-300 font-medium transition-colors"
						>
							Resend Code
						</button>
					) : (
						<p className="text-gray-400">
							Resend code in{" "}
							<span className="text-green-400 font-semibold">
								{formatTime(timer)}
							</span>
						</p>
					)}
				</div>
			</motion.div>
		</div>
	);
};
export default EmailVerificationPage;