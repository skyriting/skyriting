# Quick Deploy Guide - 5 Minutes to Production

## Fastest Way to Deploy Your Skyriting Platform

---

## Option 1: Vercel (Recommended - Easiest)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
```bash
vercel --prod
```

That's it! Your site will be live at: `https://skyriting-xxx.vercel.app`

### Step 3: Add Environment Variables
1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to Settings → Environment Variables
4. Add:
   - `VITE_SUPABASE_URL` = Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

### Step 4: Redeploy
```bash
vercel --prod
```

**Done! Your site is live with:**
- ✅ Website accessible worldwide
- ✅ Installable as mobile app (iOS/Android)
- ✅ Installable as desktop app
- ✅ HTTPS enabled
- ✅ Global CDN

---

## Option 2: Netlify (Alternative)

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Build & Deploy
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Step 3: Add Environment Variables
```bash
netlify env:set VITE_SUPABASE_URL "your-url-here"
netlify env:set VITE_SUPABASE_ANON_KEY "your-key-here"
```

**Done!** Site live at: `https://skyriting.netlify.app`

---

## Option 3: GitHub Pages (Free)

### Step 1: Install gh-pages
```bash
npm install --save-dev gh-pages
```

### Step 2: Update package.json
Add to your `package.json`:
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 3: Build & Deploy
```bash
npm run build
npm run deploy
```

**Done!** Site live at: `https://yourusername.github.io/skyriting`

---

## Getting Your Supabase Credentials

If you don't have them yet:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "Settings" (gear icon)
4. Click "API"
5. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

---

## After Deployment

### Test Your Site:
1. Visit your deployment URL
2. Test the booking form
3. Try installing as mobile app:
   - **iOS:** Safari → Share → Add to Home Screen
   - **Android:** Chrome → Menu → Install app

### Add Custom Domain (Optional):
1. Buy domain from Namecheap/Google Domains (~$12/year)
2. In Vercel/Netlify dashboard → Add custom domain
3. Update DNS records as shown
4. Wait 24-48 hours for DNS propagation

---

## Common Issues & Fixes

### Issue: Site shows white screen
```bash
# Check environment variables are set
# Redeploy:
vercel --prod
```

### Issue: Forms not working
```bash
# Make sure Supabase keys are correct
# Check Supabase dashboard → allowed URLs
# Add your deployment domain
```

### Issue: Can't install as app
```bash
# Must be HTTPS (Vercel/Netlify provide this automatically)
# Check manifest.json is accessible at: yoursite.com/manifest.json
```

---

## Cost

### Free Tier (Enough to Start):
- **Vercel/Netlify:** $0/month
- **Supabase:** $0/month
- **Domain:** ~$12/year (optional)

**Total:** $0-1/month

### When You Scale:
- **Vercel Pro:** $20/month (more bandwidth)
- **Supabase Pro:** $25/month (more storage)

**Total at scale:** ~$45/month

---

## Quick Commands Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod

# Check build size
npm run build
ls -lh dist/
```

---

## Support

Need help? Check:
- `PRODUCTION_DEPLOYMENT.md` - Complete deployment guide
- `MOBILE_RESPONSIVE_FIXES.md` - Mobile optimization details
- `DROPDOWN_FEATURES.md` - Feature documentation

---

## Your Site Is Now:

✅ **Live website** - Accessible from any browser
✅ **Mobile app** - Installable on iOS/Android
✅ **Desktop app** - Installable on Windows/Mac/Linux
✅ **PWA enabled** - Works offline
✅ **Mobile optimized** - No scrollbar issues
✅ **Fully responsive** - Works on all screen sizes
✅ **Production ready** - Professional quality

**Total deployment time: ~5 minutes** ⚡

---

Ready to go live? Run:
```bash
vercel --prod
```

That's it! 🚀
