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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const verifyTokenAndAdmin_1 = require("../../shared/verifyTokenAndAdmin");
//import { verifyTokenAndAdmin } from "./middleware"; // Import your JWT verification middleware
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
// Endpoint to update a pet's profile
router.put("/:petId", verifyTokenAndAdmin_1.verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { petId } = req.params;
    const updates = req.body; // Object containing fields to update
    try {
        // Check if the pet exists
        const existingPet = yield prisma.pet.findUnique({
            where: { id: petId }, // Pass the petId obtained from req.params
        });
        if (!existingPet) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Pet not found",
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
            message: "Pet profile updated successfully",
            data: updatedPet,
        });
    }
    catch (error) {
        console.error("Error updating pet profile:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            errorDetails: error.message,
        });
    }
}));
exports.updatePetProfile = router;
