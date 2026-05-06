# Project Walkthrough

I have successfully refactored the "Lớp học số" project into a structured `client` (Frontend) and `server` (Backend) setup.

## Changes Made

### 1. Project Organization
- Moved all existing Next.js frontend code into the `client/` directory.
- Created an empty `server/` directory for the Node.js backend.

### 2. Backend Initialization (Node.js + Express)
Created the following files in the `server/` directory:
- `package.json`: Configured with `express`, `cors`, `dotenv`, and `nodemon`.
- `src/index.js`: A basic Express server listening on port 4000.
- `.env`: Environment variables (PORT, JWT_SECRET).
- `.gitignore`: Standard Node.js ignore rules.

## How to run the project

### Frontend (Client)
```bash
cd client
pnpm install
pnpm dev
```

### Backend (Server)
```bash
cd server
pnpm install
pnpm dev
```

## Next Steps
- You can now start building your API routes in `server/src/index.js`.
- Update the frontend API calls in `client` to point to `http://localhost:4000`.
