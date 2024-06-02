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
exports.updatePetProfile = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const verifyTokenAndAdmin_1 = require("../../shared/verifyTokenAndAdmin"); // Adjust the path as needed
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
//=============== Endpoint to update a pet's profile===========================
router.put('/:petId', verifyTokenAndAdmin_1.verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { petId } = req.params;
    //console.log(petId)
    const updates = req.body; // Object containing fields to update
    // Remove the 'user' field if it exists
    if (updates.user) {
        delete updates.user;
    }
    try {
        // Check if the pet exists
        const existingPet = yield prisma.pet.findUnique({
            where: { id: petId },
        });
        if (!existingPet) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'Pet not found',
            });
        }
        // Update the pet's profile
        const updatedPet = yield prisma.pet.update({
            where: { id: petId },
            data: updates,
        });
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Pet profile updated successfully',
            data: updatedPet,
        });
    }
    catch (error) {
        console.error('Error updating pet profile:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            errorDetails: error.message,
        });
    }
}));
//==============================Delete Pet=====================
router.delete('/:petId', verifyTokenAndAdmin_1.verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { petId } = req.params;
    //console.log(petId)
    const updates = req.body; // Object containing fields to update
    // Remove the 'user' field if it exists
    if (updates.user) {
        delete updates.user;
    }
    try {
        // Check if the pet exists
        const existingPet = yield prisma.pet.findUnique({
            where: { id: petId },
        });
        if (!existingPet) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'Pet not found',
            });
        }
        // Update the pet's profile
        const updatedPet = yield prisma.pet.delete({
            where: { id: petId },
        });
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Pet profile deleted successfully',
            data: updatedPet,
        });
    }
    catch (error) {
        console.error('Error updating pet profile:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            errorDetails: error.message,
        });
    }
}));
//==============================Get Pet=====================
router.get('/:petId', verifyTokenAndAdmin_1.verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { petId } = req.params;
    //console.log(petId)
    const updates = req.body; // Object containing fields to update
    // Remove the 'user' field if it exists
    if (updates.user) {
        delete updates.user;
    }
    try {
        // Check if the pet exists
        const existingPet = yield prisma.pet.findUnique({
            where: { id: petId },
            select: {
                id: true,
                name: true,
                species: true,
                breed: true,
                age: true,
                location: true,
                size: true,
                description: true,
                temperament: true,
                medicalHistory: true,
                adoptionRequirements: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!existingPet) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'Pet not found',
            });
        }
        // Send the user information as a response
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Pet data retrieved successfully',
            data: existingPet,
        });
    }
    catch (error) {
        console.error('Error fetching user profile:', error);
        // Send error response if an error occurs
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            errorDetails: error.message,
        });
    }
}));
// Export the router
exports.updatePetProfile = router;
