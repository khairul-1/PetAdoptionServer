/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { string } from 'zod'
dotenv.config()

const prisma = new PrismaClient()
const router = express.Router()
// eslint-disable-next-line no-undef
const jwt_key: any = process.env.JWT_KEY

router.post('/', async (req, res) => {
  const { email, password } = req.body

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // If user not found or password doesn't match, return error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized Access',
      })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, type: user.type }, `${jwt_key}`, {
      expiresIn: '1h', // Token expires in 1 hour
    })

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User logged in successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    let errorMessage = 'Something went wrong'
    let statusCode = 500

    if (error instanceof jwt.JsonWebTokenError) {
      errorMessage = 'Invalid JWT token'
      statusCode = 401
    } else if (error instanceof jwt.TokenExpiredError) {
      errorMessage = 'JWT token expired'
      statusCode = 401
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      errorDetails: error.message,
    })
  }
})

export const userLogin = router
