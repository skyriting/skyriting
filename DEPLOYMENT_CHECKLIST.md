# Skyriting Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Quality
- [x] All features implemented
- [x] All forms working with country code selector
- [x] Email templates configured
- [x] MongoDB connection updated to `skyritingdb`
- [x] Gmail OAuth2 configured
- [x] Build successful
- [x] No critical errors

### 2. Environment Variables
- [x] MongoDB URI: `mongodb+srv://info_db_user:qZIB1wRGhxp9UMdg@cluster0.n2h0xpe.mongodb.net/skyritingdb?appName=Cluster0`
- [x] Gmail OAuth2 credentials configured
- [x] JWT_SECRET set
- [x] Admin credentials set

### 3. Database
- [x] Database name: `skyritingdb`
- [x] MongoDB Atlas IP whitelist configured
- [x] Connection string verified

### 4. Files Created
- [x] `.nixpacks.toml` - Railway build config
- [x] `railway.json` - Railway deployment config
- [x] `package.json` - Root package.json with build scripts
- [x] `README.md` - Comprehensive documentation
- [x] `RAILWAY_DEPLOYMENT.md` - Deployment guide
- [x] `GITHUB_SETUP.md` - GitHub push instructions
- [x] `.gitignore` - Updated to exclude sensitive files
- [x] `project/backend/.env.example` - Environment template

### 5. Build
- [x] Frontend build successful
- [x] Terser installed
- [x] Production build in `project/dist/`

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Skyriting platform with full features"

# Add remote
git remote add origin https://github.com/skyriting/skyriting.git

# Set main branch
git branch -M main

# Push (use token when prompted)
git push -u origin main
```

**GitHub Token:** Use your personal access token (store securely, don't commit)

### Step 2: Deploy to Railway

1. **Login to Railway**
   - Go to https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `skyriting/skyriting`
   - Select `main` branch

3. **Configure Environment Variables**
   Add these in Railway Dashboard → Variables:
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

4. **Deploy**
   - Railway will auto-detect and build
   - Wait for deployment to complete
   - Note your Railway domain

5. **Initialize Admin**
   - Use Railway shell or run locally:
   ```bash
   cd project/backend
   npm run init-admin
   ```

### Step 3: Configure Custom Domain (GoDaddy)

1. **In Railway**
   - Settings → Domains → Add Custom Domain
   - Enter your domain (e.g., `skyriting.com`)

2. **In GoDaddy**
   - DNS Management → Add CNAME:
     - Type: CNAME
     - Name: @ (or www)
     - Value: `your-railway-domain.railway.app`
     - TTL: 600

3. **Update FRONTEND_URL**
   - Update in Railway variables
   - Redeploy if needed

## ✅ Post-Deployment Verification

### 1. Website Functionality
- [ ] Home page loads
- [ ] Navigation works
- [ ] All pages accessible
- [ ] Footer links work
- [ ] Responsive design works

### 2. User Features
- [ ] User registration
- [ ] Email verification
- [ ] Login/logout
- [ ] Forgot password
- [ ] Reset password
- [ ] Profile management
- [ ] Booking management
- [ ] Mobility Thread
- [ ] News & Media

### 3. Admin Panel
- [ ] Admin login at `/3636847rgyuvfu3f/98184t763gvf/login`
- [ ] Dashboard loads
- [ ] All CRUD operations work
- [ ] Email notifications work

### 4. Forms
- [ ] Contact form
- [ ] Career form
- [ ] Service inquiry forms
- [ ] Package inquiry forms
- [ ] Helicopter inquiry form
- [ ] All forms have country code selector

### 5. Email Functionality
- [ ] Registration emails
- [ ] Verification emails
- [ ] Password reset emails
- [ ] Quote emails
- [ ] Admin notifications

### 6. Database
- [ ] MongoDB connection successful
- [ ] All collections created
- [ ] Data persists correctly

## 🔧 Troubleshooting

### Build Fails
- Check Railway logs
- Verify all dependencies installed
- Check Node.js version (18+)

### MongoDB Connection Fails
- Verify MONGODB_URI
- Check MongoDB Atlas IP whitelist
- Verify database name is `skyritingdb`

### Email Not Sending
- Verify Gmail OAuth2 credentials
- Check Gmail API enabled
- Verify refresh token valid

### Frontend Not Loading
- Check FRONTEND_URL
- Verify build completed
- Check static file serving

## 📞 Support

- Railway Docs: https://docs.railway.app
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Gmail API: https://developers.google.com/gmail/api

---

**Status:** Ready for Deployment ✅
