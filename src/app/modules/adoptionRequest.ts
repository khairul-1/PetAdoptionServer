// adoptionRequestRoutes.ts

import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyTokenAndAdmin } from "../../shared/verifyTokenAndAdmin";

const prisma = new PrismaClient();
const router = express.Router();

// POST endpoint for submitting adoption requests
router.post("/", verifyTokenAndAdmin, async (req: Request, res: Response) => {
  //console.log(req.body.user.userId);
  const { petId, petOwnershipExperience } = req.body;
  const userId = req.body.user.userId;

  try {
    // Create adoption request in the database
    const newAdoptionRequest = await prisma.adoptionRequest.create({
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
  } catch (error: any) {
    console.error("Error submitting adoption request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit adoption request",
      error: error.message,
    });
  }
});

export const adoptionRequest = router;
