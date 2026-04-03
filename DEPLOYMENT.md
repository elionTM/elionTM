# Elion Tech & Management - Deployment Guide

This guide provides instructions for deploying and managing the Elion Tech & Management platform.

## 1. MongoDB Setup

The application uses MongoDB for data storage and Mongoose for object modeling.

### Required Environment Variables
Ensure the following variables are set in your deployment environment (e.g., AI Studio Settings):

- `GEMINI_API_KEY`: Your Google Gemini API key.
- `MONGODB_URI`: Your MongoDB connection string (e.g., `mongodb+srv://<user>:<password>@cluster.mongodb.net/elion_tech`).

## 2. Admin Access

To access the Admin Dashboard:
1. Log in using the Google account associated with the administrator email (`ekeneigweokwu@gmail.com`).
2. Navigate to `/dashboard`.
3. You will see an **Admin Panel** tab in the sidebar.

### Admin Capabilities
- **Upload Branding Clients**: Add business names, descriptions, logos, and design galleries.
- **Manage Marketing Assets**: Upload mockups, flyers, and other creative assets.
- **Tech Solutions**: Add webapp previews and software solutions.
- **Legal Services**: Define registration and consultation offerings.
- **View All Requests**: Monitor all incoming project requests from users.

## 3. Deployment Steps

### Local Development
1. `npm install`
2. `npm run dev`

### Vercel Deployment (Frontend)
1. Connect your GitHub repository to Vercel.
2. Vercel will automatically detect the Vite project.
3. Configure the following **Environment Variables** in the Vercel Dashboard:
   - `VITE_API_URL`: The URL of your Render backend (e.g., `https://your-app.onrender.com`).
   - `NODE_ENV`: Set to `production`.
4. The project is pre-configured with `vercel.json` to handle SPA routing.
5. Deploy!

### Render.com Deployment (Backend)
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Use the following settings:
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Configure **Environment Variables**:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure secret for JWT tokens.
   - `FRONTEND_URL`: The URL of your Vercel frontend (e.g., `https://your-app.vercel.app`).
   - `NODE_ENV`: `production`
5. Render will automatically detect the `PORT` and start the Express server.

## 4. Content Management

All dynamic content on the service pages is pulled from the following MongoDB collections:
- `branding_clients`
- `marketing_assets`
- `tech_solutions`
- `legal_services`

Use the Admin Dashboard within the app to keep these updated.
