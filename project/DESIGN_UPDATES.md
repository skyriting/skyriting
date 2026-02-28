# Skyriting Luxury Design Updates

## ✅ Completed Changes

### 1. Logo & Branding
- ✅ Logo (10Asset 3.svg) set as favicon and used throughout
- ✅ Logo integrated in Navigation and Footer
- ✅ Brand name: "Skyriting" with tagline "ELEVATE YOUR JOURNEY"
- ✅ All "JetSetYatra", "JetSetWed", etc. replaced with:
  - Skyriting Sacred (Pilgrimage)
  - Skyriting Elegance (Weddings)
  - Skyriting Care (Air Ambulance)
  - Skyriting Heli (Helicopter)

### 2. Color Scheme
- ✅ Red (#ce3631) - Primary brand color
- ✅ White (#ffffff) - Background and text
- ✅ Black (#000000) - Headers and accents
- ✅ Applied throughout all components

### 3. Typography
- ✅ Helvetica font family configured
- ✅ Font files location: `project/src/assets/fonts/helvetica/`
- ✅ Luxury typography classes added
- ✅ Letter spacing and tracking optimized

### 4. Navigation
- ✅ Transparent/floating navbar on homepage
- ✅ Becomes solid white when scrolled
- ✅ Logo with tagline
- ✅ Red/white/black color scheme
- ✅ Luxury styling with Helvetica font

### 5. Landing Page (Home)
- ✅ Video background hero section
- ✅ SearchWidget positioned on top of video
- ✅ Compact, smaller height SearchWidget
- ✅ Luxury design with red/white/black theme
- ✅ All sections updated with new color scheme

### 6. SearchWidget
- ✅ Compact design with reduced height
- ✅ Positioned on video background
- ✅ Red/white/black color scheme
- ✅ Luxury typography

### 7. Footer
- ✅ Updated with logo
- ✅ Red/white/black color scheme
- ✅ All links updated to Skyriting variants
- ✅ Luxury typography

## 📋 Next Steps Required

### 1. Add Helvetica Font Files
Place your Helvetica font files in:
```
project/src/assets/fonts/helvetica/
```
Required files:
- `Helvetica.ttf` (or `.otf`, `.woff`, `.woff2`)
- `Helvetica-Bold.ttf`
- `Helvetica-Light.ttf`

The CSS is already configured to use these fonts. If files are not found, the system will fall back to system fonts.

### 2. Add Hero Video
Place your hero background video at:
```
project/public/videos/hero-video.mp4
```

**Video Requirements:**
- Format: MP4 (H.264)
- Resolution: 1920x1080 or higher
- Duration: 30-60 seconds (looping)
- File Size: Under 10MB recommended
- Content: Luxury private jet/aviation footage

**Fallback:** If no video is provided, the page will use a static background image.

### 3. Test the Design
1. Start the development server: `npm run dev`
2. Check homepage video background
3. Verify navbar transparency on scroll
4. Test SearchWidget positioning
5. Verify all colors and fonts

## 🎨 Design System

### Colors
- **Primary Red**: `#ce3631` (luxury-red)
- **Dark Red**: `#711d1b` (luxury-red-dark)
- **Black**: `#000000` (luxury-black)
- **White**: `#ffffff` (luxury-white)

### Typography
- **Font Family**: Helvetica (with system fallbacks)
- **Letter Spacing**: 0.08em (luxury tracking)
- **Font Weights**: Light (300), Normal (400), Bold (700)

### Components
- All buttons use red background with white text
- Hover states use darker red
- Borders use subtle black/red accents
- Shadows are minimal and elegant

## 📁 File Structure
```
project/
├── public/
│   ├── logo.svg (favicon)
│   ├── favicon.svg
│   └── videos/
│       └── hero-video.mp4 (add your video here)
├── src/
│   ├── assets/
│   │   └── fonts/
│   │       └── helvetica/ (add font files here)
│   ├── images/
│   │   └── 10Asset 3.svg (logo source)
│   └── components/
│       ├── Navigation.tsx (updated)
│       ├── SearchWidget.tsx (updated)
│       └── Footer.tsx (updated)
```

## ✨ Key Features
- Luxury, high-class design aesthetic
- Red, white, and black color scheme
- Helvetica typography throughout
- Transparent floating navbar
- Video background hero section
- Compact SearchWidget on video
- Consistent branding with Skyriting name
