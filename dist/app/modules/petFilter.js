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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.petFilter = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.query)
    try {
        // Parse query parameters
        const { species, breed, age, size, location, searchTerm, page = 1, limit = 10, sortBy, sortOrder, } = req.query;
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
        };
        // Count total number of pets matching the filters
        const total = yield prisma.pet.count({ where: filters });
        //console.log(total)
        // Retrieve paginated and filtered pets
        const pets = yield prisma.pet.findMany({
            where: filters,
            skip: (parseInt(page.toString()) - 1) * parseInt(limit.toString()),
            take: parseInt(limit.toString()),
            orderBy: sortBy
                ? { [sortBy.toString()]: (sortOrder === null || sortOrder === void 0 ? void 0 : sortOrder.toString()) || 'asc' }
                : undefined,
        });
        if (pets.length === 0) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'No pets found matching the provided criteria',
            });
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
        });
    }
    catch (error) {
        console.error('Error retrieving pets:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            errorDetails: error.message,
        });
    }
}));
exports.petFilter = router;
