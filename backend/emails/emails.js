import { transport } from "./config.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

async function sendMail(recEmail, htmlContent, subject, category = "VerifyU Email") {
    try {
        if (!recEmail) {
            throw new Error("Reciepient Email is Invalid.");
        }
        await transport
            .sendMail({
                to: recEmail,
                from: {
                    address: "hi@demomailtrap.co",
                    name: "VerifyU",
                },
                subject,
                html: htmlContent,
                category,
            })
            .then(console.log)
            .catch(console.error);
    } catch (error) {
        console.log("Error Sending Mail: ", error);
    }
}

export const sendVerificationEmail = async (recEmail, verificationToken) => {
    try {
        if (!verificationToken) {
            throw new Error("Verification Token Not Found.");
        }

        const html = VERIFICATION_EMAIL_TEMPLATE.replace(
            "{verificationCode}",
            verificationToken
        );
        await sendMail(
			recEmail,
			html,
			"Verify your email",
			"Email Verification"
		).then(() => console.log("Email Sent Successfully"))
        .catch(console.error)
    } catch (error) {
        console.log(error);
    }
};

export const sendWelcomeMail = async (recEmail, name) => {
    try {
        if (!name) {
            throw new Error("Name Not Found.");
        }
        const html = `<div class="header">
                            <h2>Welcome to Our Community!</h2>
                        </div>
                        <div class="content">
                            <p>Hi <strong>${name}</strong>,</p>
                            <p>We're excited to have you on board with us. Your email <strong>${recEmail}</strong> has been successfully verified!</p>
                            <p>Feel free to explore and let us know if you have any questions.</p>
                            <p>Best regards,<br />VerifyU Team</p>
                        </div>
                        <div class="footer">
                            &copy; 2025 VerifyU. All rights reserved.
                        </div>`;
        await sendMail(recEmail, html, "Welcome to VerifyU", "Welcome Email");
    } catch (error) {
        console.log("Error sending welcome email: ", error);
        throw new Error("Error sending welcome email: ", error);
    }
};

export const sendForgotPassEmail = async (recEmail, resetLink) => {
    try {
        if (!resetLink) {
            throw new Error("No Reset link")
        }
        const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetLink);
        await sendMail(recEmail, html, "Forgot Password of VerifyU", "Forgot Password")
    } catch (error) {
        console.log("Error Sending Forgot Password Mail: ", error)
        throw new Error("Error Sending Forgot Password Mail: ", error);
    }
}

export const sendResetSuccessEmail = async (recEmail) => {
    try {
        const html = PASSWORD_RESET_SUCCESS_TEMPLATE
        await sendMail(recEmail, html, "Password Reset Successful on VerifyU", "Password Reset")
    } catch (error) {
        console.error("Error Sending Forgot Password Mail: ", error);
        throw new Error("Error Sending Password Reset Successful Mail: ", error);
    }
}