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
exports.manageUser = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const verifyTokenAndAdmin_1 = require("../../shared/verifyTokenAndAdmin");
// Create a new Prisma client instance
const prisma = new client_1.PrismaClient();
// Create an Express router
const router = express_1.default.Router();
// Utility function to validate email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
// Define the route handler for PUT /api/profile
router.put('/', verifyTokenAndAdmin_1.verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the user ID from the JWT token in the request headers
        const userId = req.body.user.userId;
        // Extract the updated user information from the request body
        const { email, type, isActive } = req.body;
        //console.log(req.body)
        // Validate the request body
        if (type === '' && isActive === '') {
            return res.status(400).json({
                success: false,
                message: 'Input field required',
            });
        }
        // Validate email if provided
        if (email && !isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email must be a valid email address',
            });
        }
        // Prepare the update data
        const updateData = {};
        // update data if provided
        if (type)
            updateData.type = type;
        if (updateData.isActive !== isActive)
            updateData.isActive = isActive;
        //console.log(updateData.isActive)
        //console.log(isActive)
        // Fetch the current user data
        const user = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        //console.log(user)
        // Verify the admin
        if (user && !('admin' === user.type)) {
            return res.status(400).json({
                success: false,
                message: 'user is not admin',
            });
        }
        //console.log(updateData)
        // Use Prisma to update the user information in the database
        const updatedUser = yield prisma.user.update({
            where: {
                email: email,
            },
            data: updateData,
            select: {
                email: true,
                type: true,
                isActive: true,
            },
        });
        // Send the updated user information as a response
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: updateData.type
                ? 'Type changed successfully'
                : 'User profile updated successfully',
            data: updatedUser,
        });
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        // Send error response if an error occurs
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            errorDetails: error.message,
        });
    }
}));
//========================Get data===================
// Define the route handler for GET /api/profile
// Define the route handler for GET /api/profile
router.get('/', verifyTokenAndAdmin_1.verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all users from the database
        const users = yield prisma.user.findMany({
            select: {
                id: true,
                email: true,
                type: true,
                isActive: true,
            },
        });
        //console.log(users)
        // Send the users as a response
        res.status(200).json({
            success: true,
            statusCode: 200,
            data: users,
        });
    }
    catch (error) {
        console.error('Error fetching users:', error);
        // Send error response if an error occurs
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            errorDetails: error.message,
        });
    }
}));
exports.manageUser = router;
