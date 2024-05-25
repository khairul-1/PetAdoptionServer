/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

// Middleware to verify JWT token and check if user is admin
export const verifyTokenAndAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Get the token from the request headers
  const token = req.headers.authorization

  // Check if token is provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access: No token provided',
    })
  }

  // Verify the token
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  jwt.verify(token, process.env.JWT_KEY as string, (err: any, decoded: any) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // Handle token expiry error
        return res.status(401).json({
          success: false,
          message: 'Token has expired',
        })
      }
      // Handle other verification errors
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access: Invalid token',
      })
    }

    // // Check if the user is an admin
    // if (decoded.type !== "admin") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Forbidden: User is not an admin",
    //   });
    // }

    // If token is valid and user is admin, attach the decoded payload to the request object
    req.body.user = decoded
    next()
  })
}
