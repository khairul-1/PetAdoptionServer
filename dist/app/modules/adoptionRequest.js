"use strict";
// adoptionRequestRoutes.ts
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
exports.adoptionRequest = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const verifyTokenAndAdmin_1 = require("../../shared/verifyTokenAndAdmin");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
// POST endpoint for submitting adoption requests
router.post("/", verifyTokenAndAdmin_1.verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.body.user.userId);
    const { petId, petOwnershipExperience } = req.body;
    const userId = req.body.user.userId;
    try {
        // Create adoption request in the database
        const newAdoptionRequest = yield prisma.adoptionRequest.create({
            data: {
                userId,
                petId,
                petOwnershipExperience,
            },
        });
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "Adoption request submitted successfully",
            data: newAdoptionRequest,
        });
    }
    catch (error) {
        console.error("Error submitting adoption request:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit adoption request",
            error: error.message,
        });
    }
}));
exports.adoptionRequest = router;
