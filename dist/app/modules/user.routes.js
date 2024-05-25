"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
// Validation schema using Zod
const createUserSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty("Name field is required."),
    email: zod_1.z.string().email("Email must be a valid email address."),
    //password: z.string(),
    password: zod_1.z.string().min(1, "Password field is required."),
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
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Validate request body
        const { name, email, password } = createUserSchema.parse(req.body);
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create user using Prisma
        const result = yield prisma.user.create({
            data: { name, email, password: hashedPassword },
        });
        // Omit password field from response
        const { password: _, type } = result, responseData = __rest(result, ["password", "type"]);
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "User registered successfully",
            data: responseData,
        });
    }
    catch (error) {
        // Handle validation errors
        if (error instanceof zod_1.z.ZodError) {
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
        if (error instanceof client_1.Prisma.PrismaClientValidationError) {
            return res.status(400).json({
                success: false,
                message: "Prisma Validation Error",
                errorDetails: error.message,
            });
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002" &&
                Array.isArray((_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) &&
                error.meta.target.includes("email")) {
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
}));
exports.userRoutes = router;
