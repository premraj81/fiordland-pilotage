# Render Deployment Guide (Full Stack)

This app is now a Full-Stack Node.js application (Express + React + SQLite).

## 1. Local Development
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   This starts both the Backend API (Port 3000) and Frontend (Port 5173).

## 2. Deploy to Render
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. **Settings**:
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. **Persistent Disk** (CRITICAL):
   - You MUST add a **Disk** to save the Database and PDFs.
   - **Mount Path**: `/opt/render/project/src/storage`
   - **Size**: 1GB (or more)
   
   *Note: Without a disk, your database and PDFs will vanish every time the server restarts.*

## 3. Environment Variables
- `NODE_ENV`: `production` (Render sets this automatically usually)
- `PORT`: `3000` (Render sets this automatically)
