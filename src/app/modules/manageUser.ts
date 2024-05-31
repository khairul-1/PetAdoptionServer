/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { verifyTokenAndAdmin } from '../../shared/verifyTokenAndAdmin'

// Create a new Prisma client instance
const prisma = new PrismaClient()

// Create an Express router
const router = express.Router()

// Utility function to validate email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Define the route handler for PUT /api/profile
router.put('/', verifyTokenAndAdmin, async (req: Request, res: Response) => {
  try {
    // Extract the user ID from the JWT token in the request headers
    const userId = req.body.user.userId

    // Extract the updated user information from the request body
    const { email, type, isActive } = req.body
    //console.log(req.body)
    // Validate the request body
    if (type === '' && isActive === '') {
      return res.status(400).json({
        success: false,
        message: 'Input field required',
      })
    }

    // Validate email if provided
    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email must be a valid email address',
      })
    }

    // Prepare the update data
    const updateData: { type?: string; isActive?: boolean } = {}

    // update data if provided

    if (type) updateData.type = type
    if (updateData.isActive !== isActive) updateData.isActive = isActive

    //console.log(updateData.isActive)
    //console.log(isActive)

    // Fetch the current user data
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    //console.log(user)
    // Verify the admin
    if (user && !('admin' === user.type)) {
      return res.status(400).json({
        success: false,
        message: 'user is not admin',
      })
    }

    //console.log(updateData)
    // Use Prisma to update the user information in the database
    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: updateData,
      select: {
        email: true,
        type: true,
        isActive: true,
      },
    })

    // Send the updated user information as a response
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: updateData.type
        ? 'Type changed successfully'
        : 'User profile updated successfully',
      data: updatedUser,
    })
  } catch (error: any) {
    console.error('Error updating user profile:', error)
    // Send error response if an error occurs
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      errorDetails: error.message,
    })
  }
})

//========================Get data===================
// Define the route handler for GET /api/profile
// Define the route handler for GET /api/profile
router.get('/', verifyTokenAndAdmin, async (req: Request, res: Response) => {
  try {
    // Fetch all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        type: true,
        isActive: true,
      },
    })
    //console.log(users)
    // Send the users as a response
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: users,
    })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    // Send error response if an error occurs
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      errorDetails: error.message,
    })
  }
})

export const manageUser = router
