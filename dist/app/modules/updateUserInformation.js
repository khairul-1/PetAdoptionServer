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
exports.updateUserInformation = void 0;
// Import necessary modules
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const verifyTokenAndAdmin_1 = require("../../shared/verifyTokenAndAdmin");
// Create a new Prisma client instance
const prisma = new client_1.PrismaClient();
// Create an Express router
const router = express_1.default.Router();
// Define the route handler for PUT /api/profile
router.put("/", verifyTokenAndAdmin_1.verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the user ID from the JWT token in the request headers
        const userId = req.body.user.userId;
        // Extract the updated user information from the request body
        const { name, email } = req.body;
        // Validate the request body
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required fields",
            });
        }
        // Use Prisma to update the user information in the database
        const updatedUser = yield prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name,
                email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        // Send the updated user information as a response
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "User profile updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        console.error("Error updating user profile:", error);
        // Send error response if an error occurs
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            errorDetails: error.message,
        });
    }
}));
// Export the router
exports.updateUserInformation = router;
