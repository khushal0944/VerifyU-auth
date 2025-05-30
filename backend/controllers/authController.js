import asyncHandler from 'express-async-handler'
import { userModel } from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import {generateTokenAndSetCookie} from '../utils/generateTokenAndSetCookie.js'
import { sendForgotPassEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeMail } from '../emails/emails.js'
import { randomBytes } from "crypto";


export const signUp = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("All Fields are Mandatory");
    }
    if (password.length < 6) {
        res.status(400)
        throw new Error("Password must be at least 6 characters long.");
    }
    const userExists = await userModel.findOne({email});
    if (userExists) {
        return res.status(400).json({message:  "Email already in use.", success: false})
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new userModel({
		name,
		email,
		password: hashedPassword,
		verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
	});
    await user.save();

    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken)

    res.status(201).json({
		success: true,
		message: "User Signed up Successfully",
        user: {
            name: user._doc.name,
            email: user._doc.email,
            isVerified: user._doc.isVerified,
        }
	});
})

export const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    
    const user = await userModel.findOne({email});
    if (!user) {
        res.status(400);
        throw new Error("Invalid Credentials.")
    }
    if (!user.isVerified) {
        res.status(400);
        throw new Error("User is not verified.")
    }
    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
        res.status(400);
        throw new Error("Invalid Credentials.")
    }

    generateTokenAndSetCookie(res, user._id)

    user.lastLogin = new Date()
    await user.save();

    res.status(200).json({
		success: true,
		message: "Logged in successful",
		user: {
			id: user._doc._id,
			name: user._doc.name,
			email: user._doc.email,
			role: user._doc.role,
			isVerified: user._doc.isVerified,
			lastLogin: user._doc.lastLogin,
		},
	});
})

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("authToken")
    res.status(200).json({success: true, message: "Logged out successfully!"})
})

export const verifyEmail = asyncHandler(async (req, res) => {
    const {code, email} = req.body
    
    if (!code || !email) {
        res.status(400)
        throw new Error("Email and Verification Code must be provided.");
    }

    const user = await userModel.findOne({
        email,
		verificationToken: code,
		verificationTokenExpiresAt: { $gt: Date.now() },
	});

    if (!user) {
        res.status(400)
        throw new Error("Invalid or Expired Verification code")
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save()

    await sendWelcomeMail(user.email, user.name);

    res.status(200).json({success: true, message: "Email Verified Successfully", user: {
        email: user._doc.email,
    }})
})

export const resendVerifyEmail = asyncHandler(async (req, res) => {
    const {email} = req.body;

    if (!email) {
        throw new Error("Email not provided.")
    }

    const user = await userModel.findOne({email});

	if (!user) {
		res.status(400);
		throw new Error("User not found.");
	}

    user.verificationToken = Math.floor(
		100000 + Math.random() * 900000
	).toString();
    user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000
    
    await user.save()

    await sendVerificationEmail(user.email, user.verificationToken);

    res.status(200).json({success: true, message: "Verification token sent successfully."})
})

export const forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body
    if (!email) {
        res.status(400)
        throw new Error("Please provide an email");
    }

    const user = await userModel.findOne({email})
    if (!user) {
        res.status(404);
        throw new Error("Email Not Found.")
    }
    const resetToken = randomBytes(20).toString('hex');
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    await sendForgotPassEmail(user.email, `${process.env.FRONTEND_URL}/reset-password/${resetToken}`)

    res.status(200).json({success: true, message: "Password Reset Link sent successfully.", user: {
        ...user._doc,
        password: undefined
    }})
})

export const resetPassword = asyncHandler(async (req, res) => {
    const token = req.params.token;
    const {password} = req.body;
    
    if (!token) {
        res.status(400);
        throw new Error("Token Not Found")
    }
    if (!password) {
        res.status(400);
        throw new Error("Password is Mandatory")
    }

    const user = await userModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpiresAt: {$gt: Date.now()}
    })

    if (!user) {
        res.status(404);
        throw new Error("Invalid or Expired Password reset token")
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({success: true, message: "Password reset Successfully"})
})

export const checkAuth = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.userId).select("-password")
    if (!user) {
        res.status(404);
        throw new Error("user not found")
    }

    res.status(200).json({
		success: true,
		user: {
			id: user._doc._id,
			name: user._doc.name,
			email: user._doc.email,
			role: user._doc.role,
			isVerified: user._doc.isVerified,
			lastLogin: user._doc.lastLogin,
		},
	});
})