This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# API Setup & Testing Guide

This document explains how to set up and test the Conway’s Game of Life API after cloning the repository.

---

# Requirements

Make sure you have installed:

- **Node.js >= 18**
- **pnpm** 
- **SQLite**
- **Git**

---

# Install Dependencies

```bash
pnpm install
```

This will install the following dependencies:

- Next.js  
- TypeScript  
- Prisma  
- Zod  
- Vitest  
- All project utilities 
---

# Environment Setup

Create a `.env` file in the root:

```bash
DATABASE_URL="file:./dev.db"
```

This tells Prisma to use a SQLite database stored in the project folder.

---

# Initialize Prisma

## Create schema to database

```bash
npx prisma migrate dev --name init
```
This will creates:

- Creates `dev.db`
- Generates the Prisma client
- Applies the schema (`Board` + `BoardState` tables)

## Open Prisma Studio check everything is fine

```bash
npx prisma studio
```

# Run the Next.js dev server:

```bash
pnpm dev
```

# Testing the API

Below are the key endpoints and sample requests.

## Create a board

```bash
curl -X POST http://localhost:3000/api/boards   -H "Content-Type: application/json"   -d '{
    "rows": 3,
    "cols": 3,
    "cells": [
      [0,1,0],
      [0,1,0],
      [0,1,0]
    ]
  }'
```

## Next state

```bash
curl -X POST http://localhost:3000/api/boards/<BoardId>/next
```

Returns the next generation and persists it.

---

## Advance N states

```bash
curl -X POST http://localhost:3000/api/boards/<BoardId>/advance   -H "Content-Type: application/json"   -d '{ "steps": 10 }'
```

Advances from the latest known step to `step + 10`.

---

## Final state

```bash
curl -X POST http://localhost:3000/api/boards/<BoardId>/final   -H "Content-Type: application/json"   -d '{ "maxSteps": 200 }'
```

Possible outcomes:

- Stable state → `status: "STABLE"`
- Oscillating board --> 422 error
- Timeout after maxSteps --> 422 error
