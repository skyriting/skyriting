# How to Run Skyriting Platform

## Prerequisites

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - Either:
   - Install MongoDB locally: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
   - OR use MongoDB Atlas (cloud): [Sign up for free](https://www.mongodb.com/cloud/atlas)

## Step-by-Step Setup

### 1. Install Dependencies

From the root directory:
```bash
npm install
cd project
npm install
cd ../project/backend
npm install
```

Or use the root script:
```bash
npm run install:all
```

### 2. Setup MongoDB

**⚠️ IMPORTANT**: MongoDB must be installed and running before proceeding!

**See `MONGODB_SETUP.md` for detailed instructions.**

#### Quick Option: MongoDB Atlas (Recommended) ⭐
1. Sign up for free at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free cluster (M0 tier)
3. Create database user (Database Access → Add New Database User)
4. Whitelist your IP (Network Access → Add IP Address → Allow from anywhere for dev)
5. Get connection string (Database → Connect → Connect your application)
6. Copy the connection string and replace `<password>` and `<dbname>`

#### Alternative: Install MongoDB Locally
1. Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Install MongoDB Community Server (Windows: choose "Install as Service")
3. Verify service is running: `Get-Service MongoDB` (should show "Running")
4. Test connection: `mongosh` (should connect)

### 3. Configure Backend Environment

Create `project/backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skyriting
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skyriting
JWT_SECRET=your-super-secret-jwt-key-change-in-production
SENDGRID_API_KEY=your-sendgrid-api-key (optional, for email notifications)
ADMIN_EMAIL=admin@skyriting.com
FRONTEND_URL=http://localhost:5173
```

### 4. Configure Frontend Environment

Create `project/.env` or `project/.env.local` file:
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Initialize Admin User

```bash
cd project/backend
npm run init-admin
```

This creates the default admin user:
- **Email**: `admin@skyriting.com`
- **Password**: `Admin@123`

**Note**: Make sure MongoDB is running before executing this command!

### 6. Start the Application

#### Option A: Run Both Servers (Recommended)

From the root directory:
```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:5000

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd project/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd project
npm run dev
```

### 7. Access the Application

- **Public Website**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/3636847rgyuvfu3f/98184t763gvf/login
  - Email: `admin@skyriting.com`
  - Password: `Admin@123`

## Troubleshooting

### MongoDB Connection Error

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions**:
1. **Local MongoDB**: 
   - Check if MongoDB service is running
   - Windows: Open Services app, find "MongoDB" and start it
   - Verify connection: `mongosh` should connect
   - Check if port 27017 is not blocked by firewall

2. **MongoDB Atlas**:
   - Verify your connection string is correct
   - Check Network Access in Atlas dashboard - add your IP address (or 0.0.0.0/0 for development)
   - Verify database user credentials

### Backend Not Starting

1. Check if port 5000 is available
2. Verify `.env` file exists in `project/backend/`
3. Check MongoDB connection string is correct
4. Look at backend console for error messages

### Frontend Not Connecting to Backend

1. Verify `VITE_API_URL` in `project/.env` matches backend URL
2. Check backend is running on port 5000
3. Check browser console for CORS errors (backend should handle CORS)

### Admin User Not Created

1. Make sure MongoDB is running and accessible
2. Run `npm run init-admin` from `project/backend` directory
3. Check backend console for errors
4. Verify `.env` file has correct `MONGODB_URI`

## Next Steps After Setup

1. **Add Airports**: Go to Admin Panel → Airports → Add Airport
2. **Add Aircraft**: Go to Admin Panel → Aircraft → Add Aircraft
3. **Configure Pricing**: Go to Admin Panel → Pricing Rules

## Production Deployment

See `SETUP.md` for production deployment instructions.

## Need Help?

- Check `SETUP.md` for detailed setup instructions
- Check `README.md` for project overview
- Review backend console logs for errors
- Review browser console (F12) for frontend errors
