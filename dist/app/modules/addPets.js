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
exports.addPets = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const verifyTokenAndAdmin_1 = require("../../shared/verifyTokenAndAdmin");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
// Endpoint to add a pet
router.post("/", verifyTokenAndAdmin_1.verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract pet data from request body
        const { name, species, breed, age, size, location, description, temperament, medicalHistory, adoptionRequirements, } = req.body;
        // Create pet in the database using Prisma
        const pet = yield prisma.pet.create({
            data: {
                name,
                species,
                breed,
                age,
                size,
                location,
                description,
                temperament,
                medicalHistory,
                adoptionRequirements,
            },
        });
        // Send success response
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "Pet added successfully",
            data: pet,
        });
    }
    catch (error) {
        // Handle errors
        console.error("Error adding pet:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            errorDetails: error.message,
        });
    }
}));
exports.addPets = router;
