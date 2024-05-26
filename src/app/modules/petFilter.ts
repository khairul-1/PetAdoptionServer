import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

router.get('/', async (req, res) => {
  //console.log(req.query)
  try {
    // Parse query parameters
    const {
      species,
      breed,
      age,
      size,
      location,
      searchTerm,
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
    } = req.query

    // Prepare filters
    const filters = {
      species: species
        ? { contains: species.toString().toLowerCase() }
        : undefined,
      breed: breed ? { contains: breed.toString().toLowerCase() } : undefined,
      age: age ? parseInt(age.toString()) : undefined,
      size: size ? { contains: size.toString().toLowerCase() } : undefined,
      location: location
        ? { contains: location.toString().toLowerCase() }
        : undefined,
      OR: searchTerm
        ? [
            { species: { contains: searchTerm.toString().toLowerCase() } },
            { breed: { contains: searchTerm.toString().toLowerCase() } },
            { location: { contains: searchTerm.toString().toLowerCase() } },
          ]
        : undefined,
    }

    // Count total number of pets matching the filters
    const total = await prisma.pet.count({ where: filters })

    //console.log(total)
    // Retrieve paginated and filtered pets
    const pets = await prisma.pet.findMany({
      where: filters,
      skip: (parseInt(page.toString()) - 1) * parseInt(limit.toString()),
      take: parseInt(limit.toString()),
      orderBy: sortBy
        ? { [sortBy.toString()]: sortOrder?.toString() || 'asc' }
        : undefined,
    })

    if (pets.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'No pets found matching the provided criteria',
      })
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Pets retrieved successfully',
      meta: {
        page: parseInt(page.toString()),
        limit: parseInt(limit.toString()),
        total,
      },
      data: pets,
    })
  } catch (error: any) {
    console.error('Error retrieving pets:', error)
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      errorDetails: error.message,
    })
  }
})

export const petFilter = router
