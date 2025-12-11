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


# UI Improvements & Fixes

This section documents the latest improvements applied to the Conway’s Game of Life UI, focusing on user experience, component behavior, and automated tests. These refinements are intended to enhance clarity, reduce unexpected behavior, and align the UI with common front-end best practices.

---

## 1. Preventing Confusing Warning Messages

### Problem
Previously, the UI displayed the message:

```
Board has local changes. Click "Create board" to sync before simulating.
```

even when the user had **not yet created a board**.  
This was confusing because the warning implied that a backend board already existed.

### Fix
The warning is now displayed **only if both conditions are true**:

- A board has already been created (`boardId !== null`)
- The user has made additional edits not yet synced (`hasUnsavedChanges === true`)

### Result
- Before the first board creation → *No warning shown.*
- After board creation + edits → *Warning shown correctly.*
- Simulation buttons already respected this, so functional behavior remains correct.

---

## 2. Component Test Updates

Because the UI no longer renders warnings or certain buttons under the same conditions as before, several unit tests were updated:

### Changes Made
- Tests were adjusted to query elements only when `boardId` is present.
- `getByText` calls that previously matched multiple elements were replaced with:
  - `getAllByText` when appropriate
  - scoped queries using `within()` for isolated component testing
- Tests now reflect the updated behavior of:
  - `BoardActions`
  - `BoardConfiguration`

### Result
All tests now pass consistently and accurately reflect intended UI behavior.

---

## 3. Behavior Alignment with Hook Logic

The UI changes were coordinated with the logic in `useBoardSimulation`:

- `hasUnsavedChanges` prevents simulation requests
- `ensureCanSimulate()` enforces backend safety
- UI now visualizes states only when appropriate  
  → prevents confusing user feedback

### Updated Workflow

1. User toggles cells → **Local only**
2. User clicks “Create board” → Syncs to backend
3. User edits → `hasUnsavedChanges = true`
4. User must sync again before simulating  
   → prevents inconsistent runs

This keeps UX predictable and forces deliberate actions.

---

## 4. Summary of Improvements

### ✔ Correct warning visibility  
### ✔ Tests updated to reflect new UI behavior  
### ✔ Avoided ambiguous text matches  
### ✔ Improved clarity in board lifecycle  
### ✔ No backend or domain changes required  

These changes improve clarity, consistency, and reliability.

---
