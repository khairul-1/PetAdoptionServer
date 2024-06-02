"use strict";
// /* eslint-disable @typescript-eslint/no-explicit-any */
// // Import necessary modules
// import express, { Request, Response } from 'express'
// import { PrismaClient } from '@prisma/client'
// import { verifyTokenAndAdmin } from '../../shared/verifyTokenAndAdmin'
// import bcrypt from 'bcrypt'
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
// // Create a new Prisma client instance
// const prisma = new PrismaClient()
// // Create an Express router
// const router = express.Router()
// // Define the route handler for PUT /api/profile
// router.put('/', verifyTokenAndAdmin, async (req: Request, res: Response) => {
//   try {
//     // Extract the user ID from the JWT token in the request headers
//     const userId = req.body.user.userId
//     // Extract the updated user information from the request body
//     const { name, email, password } = req.body
//     // Validate the request body
//     if (!name || !email) {
//       return res.status(400).json({
//         success: false,
//         message: 'Name and email are required fields',
//       })
//     }
//     // Prepare the update data
//     const updateData: { name: string; email: string; password?: string } = {
//       name,
//       email,
//     }
//     // Hash the password
//     if (password) {
//       updateData.password = await bcrypt.hash(password, 10)
//     }
//     // Use Prisma to update the user information in the database
//     const updatedUser = await prisma.user.update({
//       where: {
//         id: userId,
//       },
//       data: updateData,
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     })
//     // Send the updated user information as a response
//     res.status(200).json({
//       success: true,
//       statusCode: 200,
//       message: 'User profile updated successfully',
//       data: updatedUser,
//     })
//   } catch (error: any) {
//     console.error('Error updating user profile:', error)
//     // Send error response if an error occurs
//     res.status(500).json({
//       success: false,
//       message: 'Something went wrong',
//       errorDetails: error.message,
//     })
//   }
// })
// export const updateUserInformation = router
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const verifyTokenAndAdmin_1 = require("../../shared/verifyTokenAndAdmin");
const bcrypt_1 = __importDefault(require("bcrypt"));
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
        const { name, email, oldPassword, newPassword } = req.body;
        // Validate the request body
        if (!name && !email && !oldPassword && !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'At least one field required',
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
        // Add name and email to the update data if provided
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email;
        // Handle password change if requested
        if (oldPassword && newPassword) {
            // Fetch the current user data
            const user = yield prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });
            // Verify the old password
            if (user && !(yield bcrypt_1.default.compare(oldPassword, user.password))) {
                return res.status(400).json({
                    success: false,
                    message: 'Old password is incorrect',
                });
            }
            // Hash the new password and add to update data
            updateData.password = yield bcrypt_1.default.hash(newPassword, 10);
        }
        else if (oldPassword || newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Both oldPassword and newPassword are required to change the password',
            });
        }
        // Use Prisma to update the user information in the database
        const updatedUser = yield prisma.user.update({
            where: {
                id: userId,
            },
            data: updateData,
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
            message: updateData.password
                ? 'Password changed successfully'
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
exports.updateUserInformation = router;
