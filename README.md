# Skyriting - Premium Private Aviation Platform

A comprehensive platform for private jet and helicopter charter services, featuring dynamic pricing, multi-leg trip planning, and a complete admin panel.

## 🚀 Features

- **User Features:**
  - Flight search with multi-leg trip support
  - Dynamic pricing calculator
  - User authentication (login, signup, password reset)
  - Booking management
  - Profile management with photo upload
  - Mobility Thread (social feed)
  - News & Media articles
  - Package bookings
  - Service inquiries
  - Fleet browsing with filters

- **Admin Features:**
  - Complete dashboard with statistics
  - Aircraft management (CRUD)
  - Route management
  - Pricing rules configuration
  - Service management
  - Package management
  - Article management
  - Inquiry management
  - User management
  - Booking management

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS
- **Backend:** Node.js, Express, MongoDB
- **Database:** MongoDB Atlas (skyritingdb)
- **Email:** Gmail OAuth2 (Nodemailer)
- **Authentication:** JWT
- **Deployment:** Railway

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- MongoDB Atlas account
- Gmail OAuth2 credentials
- Railway account (for deployment)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/skyriting/skyriting.git
cd skyriting
```

### 2. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

Or install separately:

```bash
# Frontend
cd project
npm install

# Backend
cd project/backend
npm install
```

### 3. Environment Variables

Create `.env` file in `project/backend/`:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://info_db_user:qZIB1wRGhxp9UMdg@cluster0.n2h0xpe.mongodb.net/skyritingdb?appName=Cluster0

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Admin Configuration
ADMIN_EMAIL=admin@skyriting.com
ADMIN_PASSWORD=Admin@123

# Gmail OAuth2 Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_CLIENT_ID=your-gmail-client-id
GMAIL_CLIENT_SECRET=your-gmail-client-secret
GMAIL_REFRESH_TOKEN=your-gmail-refresh-token
```

### 4. Initialize Admin User

```bash
cd project/backend
npm run init-admin
```

Default admin credentials:
- Email: `admin@skyriting.com`
- Password: `Admin@123`

**⚠️ Change the password after first login!**

## 🚀 Running the Application

### Development Mode

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

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Admin Panel: http://localhost:5173/3636847rgyuvfu3f/98184t763gvf/login

### Production Build

```bash
# Build frontend
cd project
npm run build

# Start backend (serves frontend)
cd project/backend
npm start
```

## 📁 Project Structure

```
skyriting/
├── project/
│   ├── src/                 # Frontend React app
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and API
│   │   └── images/         # Static images
│   ├── backend/            # Backend Express app
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utilities (email, etc.)
│   │   └── server.js       # Main server file
│   └── package.json        # Frontend dependencies
├── .nixpacks.toml          # Railway build config
├── railway.json            # Railway deployment config
├── package.json            # Root package.json
└── README.md              # This file
```

## 🌐 Deployment

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed Railway deployment instructions.

### Quick Railway Deployment

1. Push code to GitHub
2. Create new project in Railway
3. Connect GitHub repository
4. Add environment variables
5. Deploy!

## 🔐 Admin Panel Access

- URL: `/3636847rgyuvfu3f/98184t763gvf/login`
- Default Email: `admin@skyriting.com`
- Default Password: `Admin@123`

## 📧 Email Configuration

The application uses Gmail OAuth2 for sending emails. To set up:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Generate refresh token
6. Add credentials to `.env` file

## 🗄️ Database

- **Database Name:** `skyritingdb`
- **Connection:** MongoDB Atlas
- **Collections:**
  - `users` - User accounts
  - `adminusers` - Admin accounts
  - `aircrafts` - Aircraft fleet
  - `routes` - Flight routes
  - `inquiries` - User inquiries
  - `bookings` - Flight bookings
  - `quotes` - Price quotes
  - `services` - Services offered
  - `packages` - Package tours
  - `articles` - News & media
  - `mobilitythreadposts` - Social feed posts
  - And more...

## 🔗 Important Links

- **Home:** `/`
- **Services:** `/services`
- **Packages:** `/packages`
- **Fleet:** `/fleet`
- **About:** `/about-us`
- **Contact:** `/contact-us`
- **Career:** `/career`
- **Mobility Thread:** `/mobility-thread`
- **News & Media:** `/articles`
- **Login:** `/login`
- **Register:** `/register`
- **Account:** `/account`
- **Admin Panel:** `/3636847rgyuvfu3f/98184t763gvf/login`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /F /PID <PID>

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Issues
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist
- Ensure database name is `skyritingdb`

### Email Not Sending
- Verify Gmail OAuth2 credentials
- Check Gmail API is enabled
- Verify refresh token is valid

## 📝 License

ISC

## 👥 Support

For issues and questions:
- Check [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for deployment help
- Review application logs
- Check MongoDB Atlas logs
- Verify Gmail API quota

---

**Skyriting** - Elevate Your Journey ✈️
