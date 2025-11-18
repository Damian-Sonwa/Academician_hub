# Deployment Guide

This guide explains how to deploy the Evolve Interactive Hub application to Netlify (frontend) and Render (backend).

## Prerequisites

- GitHub account with the repository pushed
- Netlify account
- Render account
- MongoDB Atlas account (or MongoDB database)

## Frontend Deployment (Netlify)

### Step 1: Connect Repository to Netlify

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account and select the repository
4. Netlify will auto-detect the build settings from `netlify.toml`

### Step 2: Configure Build Settings

Netlify should auto-detect:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

### Step 3: Set Environment Variables

In Netlify dashboard, go to Site settings → Environment variables and add:

```
VITE_API_URL=https://your-render-app.onrender.com
```

Replace `your-render-app` with your actual Render service name.

### Step 4: Deploy

Click "Deploy site" and wait for the build to complete.

## Backend Deployment (Render)

### Step 1: Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub account and select the repository

### Step 2: Configure Service Settings

- **Name**: `evolve-interactive-hub-api` (or your preferred name)
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm run dev:server`
- **Plan**: Free (or choose a paid plan)

### Step 3: Set Environment Variables

In Render dashboard, go to Environment and add:

```
NODE_ENV=production
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=https://your-netlify-site.netlify.app
```

**Important**: 
- Replace `your_mongodb_connection_string` with your actual MongoDB Atlas connection string
- Replace `your_jwt_secret_key` with a secure random string
- Replace `your-netlify-site` with your actual Netlify site URL

### Step 4: Deploy

Click "Create Web Service" and wait for the deployment to complete.

### Step 5: Update Frontend API URL

After Render deployment, update the Netlify environment variable `VITE_API_URL` with your Render service URL (e.g., `https://evolve-interactive-hub-api.onrender.com`).

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Create a database user
4. Whitelist IP addresses:
   - For Render: Add `0.0.0.0/0` (allows all IPs) or Render's specific IPs
   - For local development: Add your local IP
5. Get your connection string and use it in Render environment variables

## Post-Deployment

### Seed the Database

After deployment, you can seed the database by:

1. SSH into your Render service (if available) or
2. Run the seed script locally with the production MongoDB URI:
   ```bash
   MONGODB_URI=your_production_mongodb_uri npm run seed
   ```

### Verify Deployment

1. **Frontend**: Visit your Netlify URL
2. **Backend**: Test API endpoint: `https://your-render-app.onrender.com/api/health` (if you have a health check route)
3. **Database**: Verify data is accessible through the application

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `CORS_ORIGIN` in Render matches your Netlify URL exactly
2. **MongoDB Connection**: Verify MongoDB Atlas IP whitelist includes Render's IPs
3. **Build Failures**: Check build logs in Netlify/Render dashboards
4. **Environment Variables**: Ensure all required variables are set in both platforms

### Health Check Endpoint

Consider adding a health check endpoint to your backend:

```typescript
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

## Support

For issues, check:
- Netlify build logs
- Render service logs
- Browser console for frontend errors
- Network tab for API errors

