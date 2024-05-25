import express from 'express'
import { PrismaClient } from '@prisma/client'
import { verifyTokenAndAdmin } from '../../shared/verifyTokenAndAdmin' // Adjust the path as needed

const prisma = new PrismaClient()
const router = express.Router()

// Endpoint to update a pet's profile
router.put('/:petId', verifyTokenAndAdmin, async (req, res) => {
  const { petId } = req.params

  const updates = req.body // Object containing fields to update

  // Remove the 'user' field if it exists
  if (updates.user) {
    delete updates.user
  }

  try {
    // Check if the pet exists
    const existingPet = await prisma.pet.findUnique({
      where: { id: petId },
    })

    if (!existingPet) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Pet not found',
      })
    }

    // Update the pet's profile
    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data: updates,
    })

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Pet profile updated successfully',
      data: updatedPet,
    })
  } catch (error) {
    console.error('Error updating pet profile:', error)
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      errorDetails: error.message,
    })
  }
})

export const updatePetProfile = router
