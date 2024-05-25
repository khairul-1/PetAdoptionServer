## Live Server Link

https://l2assgn8.vercel.app/

## Git Link

## Local server

http://localhost:5000/

## user email and password

{
"email": "john@example.com",
"password": "password"
}

## Below options are available

-User Registration
-User Login
-Add a Pet
-Get Paginated and Filtered Pets
-Update Pet profile
-Submit Adoption Request
-Get Adoption Requests
-Update Adoption Request Status
-Get User Information
-Update User Information

## Technology Stack:

Programming Language: TypeScript
Web Framework: Express.js
Object Relational Mapping (ORM): Prisma with PostgreSQL
Authentication: JWT (JSON Web Tokens)
Validation Error (Zod)
Hashed password used
Supabase Database used
Live server in vercel

## Details how to run locally

## 1 User Registration

Endpoint: POST http://localhost:5000/api/register
Request Body:
{
"name": "John Doe",
"email": "john@example.com",
"password": "password"
}

## 2 User Login

Endpoint: POST http://localhost:5000/api/login
Request Body:
{
"email": "john@example.com",
"password": "password"
}

## 3 Add a Pet

Endpoint: POST http://localhost:5000/api/pets
Request Headers:
Authorization: <JWT_TOKEN>
Request Body:
{
"name": "Buddy",
"species": "dog",
"breed": "Labrador Retriever",
"age": 3,
"size": "Large",
"location": "Shelter XYZ",
"description": "Buddy is a friendly and energetic Labrador Retriever. He loves playing fetch and going for long walks.",
"temperament": "Friendly, playful",
"medicalHistory": "Up to date on vaccinations, neutered.",
"adoptionRequirements": "Buddy needs a home with a fenced yard and an active family."
}

## 4 Get Paginated and Filtered Pets

Endpoint: GET http://localhost:5000/api/pets
Query Parameters for API Requests:
species: (Optional) Filter pets by species (e.g., dog, cat).
breed: (Optional) Filter pets by breed.
age: (Optional) Filter pets by age.
size: (Optional) Filter pets by size.
location: (Optional) Filter pets by location.
searchTerm: (Optional) Searches for pets based on a keyword or phrase. Only applicable to the following fields: species, breed, location, etc.
page: (Optional) Specifies the page number for paginated results. Default is 1. Example: ?page=2
limit: (Optional) Sets the number of data per page. Default is 10. Example: ?limit=5
sortBy: (Optional) Specifies the field by which the results should be sorted. Only applicable to the following fields: species, breed, size. Example: ?sortBy=species
sortOrder: (Optional) Determines the sorting order, either 'asc' (ascending) or 'desc' (descending). Example: ?sortOrder=desc

## 5 Update Pet profile

Endpoint: PUT http://localhost:5000/api/pets/:petId
Request Headers:
Authorization: <JWT_TOKEN>
Request Body:
{
"location": "Shelter ABC"
}

## 6 Submit Adoption Request

Endpoint: POST http://localhost:5000/api/adoption-request
Request Headers:
Authorization: <JWT_TOKEN>
Request Body:
{
"petId": "b9964127-2924-42bb-9970-60f93c016ghs",
"petOwnershipExperience": "Previous owner of a Labrador Retriever"
}

## 7 Get Adoption Requests

Endpoint: GET http://localhost:5000/api/adoption-requests
Request Headers:
Authorization: <JWT_TOKEN>

## 8 Update Adoption Request Status

Endpoint: PUT http://localhost:5000/api/adoption-requests/:requestId
Request Headers:
Authorization: <JWT_TOKEN>
Request Body:
{
"status": "APPROVED"
}

## 9 Get User Information

Endpoint: GET http://localhost:5000/api/profile
Request Headers:
Authorization: <JWT_TOKEN>

## 10 Update User Information

Endpoint: PUT http://localhost:5000/api/profile
Request Headers:
Authorization: <JWT_TOKEN>
Request Body:
{
"name": "John Doe",
"email": "john.doe@example.com"
}
