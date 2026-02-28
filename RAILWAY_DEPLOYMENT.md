# Railway Deployment Guide for Skyriting

## Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub account with the Skyriting repository
- MongoDB Atlas cluster (already configured)
- Gmail OAuth2 credentials

## Step 1: Prepare Your Repository

1. Ensure all code is committed and pushed to GitHub
2. Make sure `.gitignore` excludes `.env` files
3. Verify `package.json` has correct build scripts

## Step 2: Deploy to Railway

### Option A: Deploy via Railway Dashboard

1. **Login to Railway**
   - Go to https://railway.app
   - Sign in with your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose the `skyriting/skyriting` repository
   - Select the `main` branch

3. **Configure Build Settings**
   - Railway will auto-detect Node.js
   - Root Directory: Leave empty (project is at root)
   - Build Command: `cd project && npm run build`
   - Start Command: `cd project/backend && npm start`

4. **Add Environment Variables**
   Click on your service → Variables tab → Add the following:

   ```
   MONGODB_URI=mongodb+srv://info_db_user:qZIB1wRGhxp9UMdg@cluster0.n2h0xpe.mongodb.net/skyritingdb?appName=Cluster0
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-railway-domain.railway.app
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ADMIN_EMAIL=admin@skyriting.com
   ADMIN_PASSWORD=Admin@123
   GMAIL_USER=your-email@gmail.com
   GMAIL_CLIENT_ID=your-gmail-client-id
   GMAIL_CLIENT_SECRET=your-gmail-client-secret
   GMAIL_REFRESH_TOKEN=your-gmail-refresh-token
   ```

5. **Deploy**
   - Railway will automatically build and deploy
   - Wait for deployment to complete
   - Note your Railway domain (e.g., `skyriting-production.up.railway.app`)

### Option B: Deploy via Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to existing project (if needed)
railway link

# Set environment variables
railway variables set MONGODB_URI="mongodb+srv://info_db_user:qZIB1wRGhxp9UMdg@cluster0.n2h0xpe.mongodb.net/skyritingdb?appName=Cluster0"
railway variables set PORT=5000
railway variables set NODE_ENV=production
railway variables set JWT_SECRET="your-super-secret-jwt-key"
railway variables set GMAIL_USER="your-email@gmail.com"
railway variables set GMAIL_CLIENT_ID="your-gmail-client-id"
railway variables set GMAIL_CLIENT_SECRET="your-gmail-client-secret"
railway variables set GMAIL_REFRESH_TOKEN="your-gmail-refresh-token"

# Deploy
railway up
```

## Step 3: Configure Custom Domain (Optional)

1. **In Railway Dashboard**
   - Go to your service → Settings → Domains
   - Click "Generate Domain" or "Add Custom Domain"
   - For custom domain, add your GoDaddy domain

2. **Update DNS in GoDaddy**
   - Login to GoDaddy
   - Go to DNS Management
   - Add a CNAME record:
     - Type: CNAME
     - Name: @ (or www)
     - Value: `your-railway-domain.railway.app`
     - TTL: 600

3. **Update Environment Variables**
   - Update `FRONTEND_URL` in Railway to your custom domain
   - Redeploy if needed

## Step 4: Initialize Admin User

After deployment, initialize the admin user:

```bash
# SSH into Railway container (if available) or run locally with production DB
cd project/backend
npm run init-admin
```

Or use Railway's one-click shell:
- Go to your service → Deployments → Click on a deployment → Shell
- Run: `cd project/backend && npm run init-admin`

## Step 5: Verify Deployment

1. **Check Application**
   - Visit your Railway domain
   - Test login/signup
   - Test admin panel at `/3636847rgyuvfu3f/98184t763gvf/login`

2. **Check Logs**
   - Railway Dashboard → Your Service → Deployments → View Logs
   - Look for "✅ MongoDB connected successfully"
   - Check for any errors

3. **Test Email Functionality**
   - Try forgot password
   - Try user registration
   - Check email delivery

## Step 6: Monitor and Maintain

1. **Monitor Logs**
   - Railway Dashboard provides real-time logs
   - Set up alerts for errors

2. **Update Environment Variables**
   - Go to Variables tab
   - Update as needed
   - Changes require redeployment

3. **Scale Resources** (if needed)
   - Railway Dashboard → Settings → Resources
   - Adjust CPU/Memory as needed

## Troubleshooting

### Build Fails
- Check build logs in Railway
- Verify all dependencies in `package.json`
- Ensure Node.js version is compatible (18+)

### MongoDB Connection Fails
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist (add Railway IPs or 0.0.0.0/0)
- Verify database name is `skyritingdb`

### Email Not Sending
- Verify Gmail OAuth2 credentials
- Check Gmail API is enabled
- Verify refresh token is valid

### Frontend Not Loading
- Check `FRONTEND_URL` environment variable
- Verify build completed successfully
- Check static file serving in `server.js`

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` |
| `FRONTEND_URL` | Frontend URL | `https://skyriting.com` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `ADMIN_EMAIL` | Admin login email | `admin@skyriting.com` |
| `ADMIN_PASSWORD` | Admin password | `Admin@123` |
| `GMAIL_USER` | Gmail account email | `your-email@gmail.com` |
| `GMAIL_CLIENT_ID` | Gmail OAuth2 Client ID | `xxx.apps.googleusercontent.com` |
| `GMAIL_CLIENT_SECRET` | Gmail OAuth2 Client Secret | `xxx` |
| `GMAIL_REFRESH_TOKEN` | Gmail OAuth2 Refresh Token | `xxx` |

## Support

For Railway-specific issues:
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

For application issues:
- Check application logs in Railway Dashboard
- Review MongoDB Atlas logs
- Check Gmail API quota
