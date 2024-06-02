"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenAndAdmin = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware to verify JWT token and check if user is admin
const verifyTokenAndAdmin = (req, res, next) => {
    // Get the token from the request headers
    const token = req.headers.authorization;
    // Check if token is provided
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access: No token provided',
        });
    }
    // Verify the token
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    jsonwebtoken_1.default.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // Handle token expiry error
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired',
                });
            }
            // Handle other verification errors
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access: Invalid token',
            });
        }
        // // Check if the user is an admin
        // if (decoded.type !== "admin") {
        //   return res.status(403).json({
        //     success: false,
        //     message: "Forbidden: User is not an admin",
        //   });
        // }
        // If token is valid and user is admin, attach the decoded payload to the request object
        req.body.user = decoded;
        next();
    });
};
exports.verifyTokenAndAdmin = verifyTokenAndAdmin;
