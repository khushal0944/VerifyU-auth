import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.authToken
    try {
        if (!token) {
            return res.status(401).json({success: false, message: "Unauthorized - no token"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) return res.status(401).json({success: false, message: "Unauthorized - invalid token"})
        req.userId = decoded.userId
        next();
    } catch (error) {
        console.log("Error in verifying token: ", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
}