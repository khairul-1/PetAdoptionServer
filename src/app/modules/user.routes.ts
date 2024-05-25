import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const router = express.Router();

// Validation schema using Zod
const createUserSchema = z.object({
  name: z.string().nonempty("Name field is required."),
  email: z.string().email("Email must be a valid email address."),
  //password: z.string(),
  password: z.string().min(1, "Password field is required."),

  //   password: z
  //     .string()
  //     .refine((password) => {
  //       // Password must have at least one uppercase letter
  //       const uppercaseRegex = /[A-Z]/;
  //       if (!uppercaseRegex.test(password)) {
  //         return false;
  //       }

  //       // Password must have at least one lowercase letter
  //       const lowercaseRegex = /[a-z]/;
  //       if (!lowercaseRegex.test(password)) {
  //         return false;
  //       }

  //       // Password must have at least one numeric character
  //       const numericRegex = /[0-9]/;
  //       if (!numericRegex.test(password)) {
  //         return false;
  //       }

  //       // Password must have at least one special character
  //       const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  //       if (!specialCharRegex.test(password)) {
  //         return false;
  //       }

  //       // Password must be at least six characters long
  //       if (password.length < 6) {
  //         return false;
  //       }

  //       return true;
  //     }, "Password must contain at least one uppercase letter, one lowercase letter, one numeric character, one special character, and be at least six characters long."),
});

router.post("/", async (req, res) => {
  try {
    // Validate request body
    const { name, email, password } = createUserSchema.parse(req.body);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user using Prisma
    const result = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Omit password field from response
    const { password: _, type, ...responseData } = result;

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "User registered successfully",
      data: responseData,
    });
  } catch (error: any) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const errorDetails = {
        issues: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      };
      return res.status(400).json({
        success: false,
        message: error.errors.map((err) => err.message).join(" "),
        errorDetails,
      });
    }

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({
        success: false,
        message: "Prisma Validation Error",
        errorDetails: error.message,
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (
        error.code === "P2002" &&
        Array.isArray(error.meta?.target) &&
        error.meta.target.includes("email")
      ) {
        // Specific error handling for unique constraint violation on email field
        return res.status(400).json({
          success: false,
          message: "Email address is already in use",
        });
      }
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      errorDetails: error.message,
    });
  }
});

export const userRoutes = router;
