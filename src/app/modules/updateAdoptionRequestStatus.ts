import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyTokenAndAdmin } from "../../shared/verifyTokenAndAdmin";

// Create a new Prisma client instance
const prisma = new PrismaClient();

// Create an Express router
const router = express.Router();

// Define the route handler for PUT /api/adoption-requests/:requestId
router.put(
  "/:requestId",
  verifyTokenAndAdmin,
  async (req: Request, res: Response) => {
    try {
      // Extract the user ID from the JWT token in the request headers
      const userId = req.body.user.userId;

      // Extract the request ID from the request parameters
      const requestId = req.params.requestId;

      // Extract the new status from the request body
      const { status } = req.body;

      // Use Prisma to update the adoption request status in the database
      const updatedRequest = await prisma.adoptionRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status: status,
        },
      });

      // Send the updated adoption request as a response
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Adoption request updated successfully",
        data: updatedRequest,
      });
    } catch (error: any) {
      console.error("Error updating adoption request:", error);
      // Send error response if an error occurs
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        errorDetails: error.message,
      });
    }
  }
);

// Export the router
export const updateAdoptionRequestStatus = router;
