import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transport = nodemailer.createTransport({
	// host: "live.smtp.mailtrap.io",
	// port: 587,
	// auth: {
	// 	user: process.env.MAILTRAP_USER,
	// 	pass: process.env.MAILTRAP_PASS,
	// },
	host: "sandbox.smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: process.env.TESTING_MAILTRAP_USER,
		pass: process.env.TESTING_MAILTRAP_PASS,
	},
});