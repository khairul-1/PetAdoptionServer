import express from 'express'
import { PrismaClient } from '@prisma/client'
import { verifyTokenAndAdmin } from '../../shared/verifyTokenAndAdmin'

const prisma = new PrismaClient()
const router = express.Router()

// Endpoint to add a pet
router.post('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    // Extract pet data from request body
    const {
      name,
      photoUrl,
      species,
      breed,
      age,
      size,
      location,
      description,
      temperament,
      medicalHistory,
      adoptionRequirements,
    } = req.body

    // Create pet in the database using Prisma
    const pet = await prisma.pet.create({
      data: {
        name,
        photoUrl,
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
    })

    // Send success response
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Pet added successfully',
      data: pet,
    })
  } catch (error: any) {
    // Handle errors
    console.error('Error adding pet:', error)
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      errorDetails: error.message,
    })
  }
})

export const addPets = router
