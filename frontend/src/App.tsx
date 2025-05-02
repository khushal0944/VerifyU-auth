import { Route, Routes } from "react-router-dom";
import FloatingCircle from "./components/FloatingCircle";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
			<FloatingCircle
				color="bg-green-500"
				top="-5%"
				left="-10%"
				size="w-64 h-64"
				delay={0}
			/>
			<FloatingCircle
				color="bg-emerald-500"
				top="70%"
				left="80%"
				size="w-48 h-48"
				delay={3}
			/>
			<FloatingCircle
				color="bg-lime-500"
				top="40%"
				left="10%"
				size="w-32 h-32"
				delay={2}
			/>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
		</div>
	);
}
