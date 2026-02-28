# Troubleshooting: Changes Not Showing

## Quick Fixes

### 1. Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd project
npm run dev
```

### 2. Hard Refresh Browser
- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`
- This clears browser cache and forces reload

### 3. Clear Browser Cache
1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### 4. Clear Vite Cache
```bash
cd project
rm -rf .vite
# Or on Windows:
Remove-Item -Recurse -Force .vite
npm run dev
```

### 5. Rebuild Tailwind
```bash
cd project
# Delete node_modules/.vite if exists
npm run dev
```

### 6. Check Browser Console
1. Press F12 to open Developer Tools
2. Check Console tab for errors
3. Check Network tab - ensure CSS files are loading

### 7. Verify Files Are Saved
- Make sure all files are saved (Ctrl+S)
- Check that file timestamps are recent

## Common Issues

### Issue: Old colors still showing
**Solution**: Hard refresh (Ctrl+Shift+R) or clear cache

### Issue: Font not loading
**Solution**: Font files need to be in `src/assets/fonts/helvetica/`
- If fonts are missing, system fonts will be used as fallback

### Issue: Video not showing
**Solution**: 
- Add video to `public/videos/hero-video.mp4`
- Or the fallback image will be used

### Issue: Logo not showing
**Solution**: 
- Check `public/logo.svg` exists
- Check browser console for 404 errors

## Verification Steps

1. **Check if server is running**:
   - Should see "Local: http://localhost:5173" in terminal

2. **Check browser URL**:
   - Should be http://localhost:5173

3. **Check for errors**:
   - Open browser console (F12)
   - Look for red error messages

4. **Verify changes in code**:
   - Check `src/components/Navigation.tsx` - should have logo import
   - Check `src/pages/Home.tsx` - should have video background
   - Check `tailwind.config.js` - should have luxury colors

## Force Rebuild

If nothing works, try:
```bash
cd project
# Remove all caches
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# Reinstall and restart
npm install
npm run dev
```

## Still Not Working?

1. Check terminal for compilation errors
2. Check browser console (F12) for runtime errors
3. Verify you're looking at the correct URL (localhost:5173)
4. Try a different browser or incognito mode
