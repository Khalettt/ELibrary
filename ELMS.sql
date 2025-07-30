-- Create enum type for UserRole
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- Create the User table
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role "UserRole" DEFAULT 'USER' NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'PENDING_ADMIN_APPROVAL', 'REJECTED');



select*from "Book"
select*from "User"