import { constants } from "../constants.js";

export const errorHandler = (err, req, res, next) => {
	const statusCode = res.statusCode ? res.statusCode : 500;

	switch (statusCode) {
		case constants.VALIDATION_ERROR:
			res.status(statusCode).json({
                title: "Validation Failed",
				success: false,
				message: err.message,
				stackTrace: err.stack,
			});
			break;

		case constants.NOT_FOUND:
			res.status(statusCode).json({
				title: "Not Found",
                success: false,
				message: err.message,
				stackTrace: err.stack,
			});
			break;

		case constants.UNAUTHORIZED:
			res.status(statusCode).json({
				title: "Unauthorized",
				success: false,
				message: err.message,
				stackTrace: err.stack,
			});
			break;

		case constants.FORBIDDEN:
			res.status(statusCode).json({
				title: "Forbidden",
				success: false,
				message: err.message,
				stackTrace: err.stack,
			});
			break;

		case constants.SERVER_ERROR:
			res.status(statusCode).json({
				title: "Server Error",
				success: false,
				message: err.message,
				stackTrace: err.stack,
			});
			break;

		default:
			res.status(500).json({
				title: "Unexpected Error",
				success: false,
				message: err.message,
				stackTrace: err.stack,
			});
			break;
	}
};