// Import necessary modules
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyTokenAndAdmin } from "../../shared/verifyTokenAndAdmin";

// Create a new Prisma client instance
const prisma = new PrismaClient();

// Create an Express router
const router = express.Router();

// Define the route handler for GET /api/profile
router.get("/", verifyTokenAndAdmin, async (req: Request, res: Response) => {
  try {
    // Extract the user ID from the JWT token in the request headers
    const userId = req.body.user.userId;

    // Use Prisma to fetch the user information from the database
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Send the user information as a response
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    // Send error response if an error occurs
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      errorDetails: error.message,
    });
  }
});

// Export the router
export const getProfile = router;
