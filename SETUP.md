# Skyriting Platform Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Setup MongoDB
- Install MongoDB locally or use MongoDB Atlas
- Update `backend/.env` with your MongoDB connection string

### 3. Configure Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skyriting
JWT_SECRET=your-super-secret-jwt-key-change-in-production
SENDGRID_API_KEY=your-sendgrid-api-key (optional)
ADMIN_EMAIL=admin@skyriting.com
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`project/.env` or `project/.env.local`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Initialize Admin User
```bash
cd backend
npm run init-admin
```

This creates the default admin user:
- Email: `admin@skyriting.com`
- Password: `Admin@123`

### 5. Start Development Servers
```bash
# From root directory
npm run dev
```

This starts:
- Frontend: http://localhost:5173 (Vite default port)
- Backend: http://localhost:5000

### 6. Access Admin Panel
Navigate to: http://localhost:5173/3636847rgyuvfu3f/98184t763gvf/login

Login with:
- Email: `admin@skyriting.com`
- Password: `Admin@123`

## Initial Data Setup

### Add Airports
1. Go to Admin Panel → Airports
2. Click "Add Airport"
3. Fill in airport details including coordinates (latitude/longitude)

### Add Aircraft
1. Go to Admin Panel → Aircraft
2. Click "Add Aircraft"
3. Fill in all aircraft specifications
4. Upload images (stored as Base64 in MongoDB)

### Configure Pricing
1. Go to Admin Panel → Pricing Rules
2. Set GST rate (default: 18%)
3. Configure fees and surcharges

## Testing the Platform

1. **Search Flow**:
   - Go to homepage
   - Select trip type (One-way, Round-trip, or Multi-trip)
   - Add legs (for multi-trip, click "Add Leg")
   - Enter departure dates and times
   - Select number of passengers
   - Click "Search Flights"

2. **Filter Results**:
   - Use sidebar filters to narrow down results
   - Filter by category, price, capacity, amenities

3. **View Aircraft Details**:
   - Click on any aircraft from results
   - View full specifications and gallery
   - Click "Enquire Now" to submit enquiry

4. **Admin Management**:
   - View all enquiries in Admin Panel
   - Update enquiry status
   - Manage airports and aircraft
   - Configure pricing rules

## Production Deployment

### Backend
1. Set up MongoDB Atlas or production MongoDB
2. Update environment variables
3. Deploy to Heroku, Railway, or similar
4. Set up SendGrid for email notifications

### Frontend
1. Build the Vite app: `cd project && npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update `VITE_API_URL` to production API URL

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access if using MongoDB Atlas

### Admin Login Not Working
- Run `npm run init-admin` in backend directory
- Check JWT_SECRET is set in `.env`
- Clear browser localStorage and try again

### Images Not Displaying
- Images are stored as Base64 in MongoDB
- Ensure images are properly encoded when uploading
- Check image data format in database

## Support

For issues or questions, check the README.md or contact the development team.
