"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
const jwt_key = process.env.JWT_KEY;
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        // If user not found or password doesn't match, return error
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access",
            });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, type: user.type }, `${jwt_key}`, {
            expiresIn: "1h", // Token expires in 1 hour
        });
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "User logged in successfully",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                token,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        let errorMessage = "Something went wrong";
        let statusCode = 500;
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            errorMessage = "Invalid JWT token";
            statusCode = 401;
        }
        else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            errorMessage = "JWT token expired";
            statusCode = 401;
        }
        res.status(statusCode).json({
            success: false,
            message: errorMessage,
            errorDetails: error.message,
        });
    }
}));
exports.userLogin = router;
