import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "User Name is Mandatory"],
		},
		email: {
			type: String,
			required: [true, "Email is Mandatory"],
			unique: true,
			trim: true,
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				"Please enter a valid email",
			],
		},
		password: {
			type: String,
			required: [true, "Password is Mandatory"],
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		role: {
			type: String,
			default: "user",
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
	},
	{
		timestamps: true,
	}
);

export const userModel = mongoose.model("User", userSchema);