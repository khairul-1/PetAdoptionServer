// Import necessary modules
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyTokenAndAdmin } from "../../shared/verifyTokenAndAdmin";

// Create a new Prisma client instance
const prisma = new PrismaClient();

// Create an Express router
const router = express.Router();

// Define the route handler for GET /api/adoption-requests
router.get("/", verifyTokenAndAdmin, async (req: Request, res: Response) => {
  //console.log(req.body.user.userId);
  try {
    // Extract the user ID from the JWT token in the request headers
    const userId = req.body.user.userId;

    // Fetch adoption requests for the user from the database
    const adoptionRequests = await prisma.adoptionRequest.findMany({
      where: {
        userId: userId,
      },
    });

    // Send the adoption requests as a response
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Adoption requests retrieved successfully",
      data: adoptionRequests,
    });
  } catch (error: any) {
    console.error("Error retrieving adoption requests:", error);
    // Send error response if an error occurs
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      errorDetails: error.message,
    });
  }
});

// Export the router
export const getAdoptionRequests = router;
