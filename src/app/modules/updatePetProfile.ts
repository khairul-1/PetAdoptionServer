/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { verifyTokenAndAdmin } from '../../shared/verifyTokenAndAdmin' // Adjust the path as needed

const prisma = new PrismaClient()
const router = express.Router()

//=============== Endpoint to update a pet's profile===========================
router.put('/:petId', verifyTokenAndAdmin, async (req, res) => {
  const { petId } = req.params
  //console.log(petId)

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
  } catch (error: any) {
    console.error('Error updating pet profile:', error)
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      errorDetails: error.message,
    })
  }
})
//==============================Delete Pet=====================

router.delete('/:petId', verifyTokenAndAdmin, async (req, res) => {
  const { petId } = req.params
  //console.log(petId)
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
    const updatedPet = await prisma.pet.delete({
      where: { id: petId },
    })

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Pet profile deleted successfully',
      data: updatedPet,
    })
  } catch (error: any) {
    console.error('Error updating pet profile:', error)
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      errorDetails: error.message,
    })
  }
})

//==============================Get Pet=====================

router.get('/:petId', verifyTokenAndAdmin, async (req, res) => {
  const { petId } = req.params
  //console.log(petId)
  const updates = req.body // Object containing fields to update

  // Remove the 'user' field if it exists
  if (updates.user) {
    delete updates.user
  }

  try {
    // Check if the pet exists
    const existingPet = await prisma.pet.findUnique({
      where: { id: petId },
      select: {
        id: true,
        name: true,
        species: true,
        breed: true,
        age: true,
        location: true,
        size: true,
        description: true,
        temperament: true,
        medicalHistory: true,
        adoptionRequirements: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!existingPet) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Pet not found',
      })
    }

    // Send the user information as a response
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Pet data retrieved successfully',
      data: existingPet,
    })
  } catch (error: any) {
    console.error('Error fetching user profile:', error)
    // Send error response if an error occurs
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      errorDetails: error.message,
    })
  }
})

// Export the router
export const updatePetProfile = router
