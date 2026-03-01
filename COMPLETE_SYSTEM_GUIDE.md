# Complete Skyriting System Guide

## Overview

This document explains how the complete Skyriting system works, including admin panel, client-side booking flow, pricing calculation, and deployment.

## System Architecture

### Backend (Node.js/Express/MongoDB)
- **Location**: `project/backend/`
- **Port**: 5000 (development), Railway assigned port (production)
- **Database**: MongoDB Atlas (`skyritingdb`)

### Frontend (React/Vite)
- **Location**: `project/`
- **Build Output**: `project/dist/`
- **Port**: 5173 (development), served by backend (production)

## Admin Panel

### Access
- **URL**: `https://yourdomain.com/3636847rgyuvfu3f/98184t763gvf/login`
- **Default Credentials**:
  - Email: `admin@skyriting.com` (or from `ADMIN_EMAIL` env var)
  - Password: `Admin@123` (or from `ADMIN_PASSWORD` env var)

### Admin Pages

1. **Dashboard** (`/3636847rgyuvfu3f/98184t763gvf/dashboard`)
   - View statistics (Inquiries, Quotes, Bookings, Available Aircraft)
   - Quick access to all management pages

2. **Manage Fleet** (`/3636847rgyuvfu3f/98184t763gvf/fleet`)
   - Add/Edit/Delete aircraft
   - Configure:
     - Basic info (name, tail number, category, manufacturer, model)
     - Pricing (hourly rate, currency, **commission percentage**)
     - Operating costs (hourly operating cost, fuel cost per km, crew expense per hour)
     - Specifications (seats, speed, range, base, pilots, YOM, etc.)
     - Images (main image, interior photos, range map)
     - Availability status

3. **Manage Inquiries** (`/3636847rgyuvfu3f/98184t763gvf/inquiries`)
   - View all customer inquiries
   - Filter by status (new, sourcing, quoted, converted, cancelled)
   - Search by name, email, or phone
   - Update inquiry status
   - Add customer notes and admin notes

4. **Manage Bookings** (`/3636847rgyuvfu3f/98184t763gvf/bookings`)
   - View all bookings
   - Filter by status (pending, confirmed, completed, cancelled)
   - Search bookings
   - Update booking status
   - View booking details

5. **Pricing Rules** (`/3636847rgyuvfu3f/98184t763gvf/pricing`)
   - Create/Edit/Delete pricing rules
   - Configure:
     - Global margin percentage
     - Margin by aircraft type (Light, Mid, Super Mid, Large, Airliner, Helicopter)
     - Tax rate and name
     - Fees (fuel surcharge per km, airport fee per leg, ground handling, crew expense per hour)
     - Multi-leg rules (max legs, min layover hours, discount percentage)
     - Currency settings
     - Flight time buffer
     - Validity dates

6. **Manage Routes** (`/3636847rgyuvfu3f/98184t763gvf/routes`)
   - Add/Edit/Delete routes
   - Configure:
     - Origin/Destination airport codes and cities
     - Distance (km)
     - Estimated time (hours)
     - Route name
     - Popular route flag

7. **Manage Packages** (`/3636847rgyuvfu3f/98184t763gvf/packages`)
   - Add/Edit/Delete travel packages
   - Configure package details, pricing, duration, inclusions, itinerary

8. **Manage Services** (`/3636847rgyuvfu3f/98184t763gvf/services`)
   - Add/Edit/Delete services
   - Configure service details, deliverables, benefits

9. **Manage Articles** (`/3636847rgyuvfu3f/98184t763gvf/articles`)
   - Add/Edit/Delete news/media articles
   - Configure title, content, images, category, featured status

10. **Mobility Thread** (`/3636847rgyuvfu3f/98184t763gvf/mobility`)
    - View all mobility thread posts
    - Delete inappropriate posts

## Client-Side Booking Flow

### 1. Search Flights

**Home Page** (`/`)
- User fills out search widget:
  - Select trip type: One-way, Round-trip, or Multi-trip
  - Departure city (dropdown from admin-managed routes)
  - Arrival city (dropdown from admin-managed routes)
  - Departure date and time
  - Passenger count (1-20)
  - For round-trip: Return date and time
  - For multi-trip: Add/remove legs with individual dates/times

**Search Results** (`/search-results`)
- Shows available aircraft matching search criteria
- Displays:
  - Aircraft name, category, capacity
  - Pricing breakdown (flight cost, airport handling, GST, estimated cost)
  - Filters (aircraft class, capacity, amenities, price range)
- User clicks "View Details" on an aircraft

### 2. Aircraft Details

**Aircraft Detail Page** (`/aircraft/:id`)
- Shows comprehensive aircraft information:
  - Specifications (seats, YOM, base, pilots, baggage, speed, flight attendant, cabin dimensions, lavatory, flying range)
  - Interior photos
  - Range map
  - Flight details (all legs)
  - Cost breakdown:
    - Flight cost
    - Airport handling
    - GST (18%)
    - Estimated cost
- User fills out enquiry form:
  - Full Name
  - Email
  - Phone (with country code)
  - Message
- Form submits to admin

### 3. Admin Creates Quote

1. Admin goes to **Manage Inquiries**
2. Selects the inquiry
3. Admin creates a quote:
   - Selects aircraft
   - System calculates pricing using:
     - Aircraft-specific commission (if set)
     - OR Aircraft-type margin (from pricing rules)
     - OR Global margin (from pricing rules)
   - Formula: `(Hourly Operating Cost + Fuel Surcharge + Airport Fees + Crew Expenses) × (1 + Margin %)`
   - Adds tax
   - Applies multi-leg discount if applicable
4. Admin sends quote to customer (email sent automatically)

### 4. Customer Accepts Quote

1. Customer receives email with quote details
2. Customer logs in to their account
3. Customer views quote in their account
4. Customer accepts quote
5. System creates booking automatically
6. Customer receives booking confirmation email

### 5. Booking Management

**Customer Account** (`/account`)
- View all bookings
- View booking details
- Request reschedule
- Update profile

**Admin Panel** (`/3636847rgyuvfu3f/98184t763gvf/bookings`)
- View all bookings
- Update booking status
- Manage reschedule requests

## Pricing Calculation

### Formula
```
Subtotal = Hourly Operating Cost + Fuel Surcharge + Airport Fees + Crew Expenses
Subtotal with Handling = Subtotal + Ground Handling
Margin Amount = Subtotal with Handling × Margin %
Subtotal with Margin = Subtotal with Handling + Margin Amount
Tax Amount = Subtotal with Margin × Tax Rate
Total Before Discount = Subtotal with Margin + Tax Amount
Multi-Leg Discount = Total Before Discount × Discount % (if applicable)
Final Total = Total Before Discount - Multi-Leg Discount
```

### Margin Priority
1. **Aircraft-specific commission** (`aircraft.commissionPercentage`) - Highest priority
2. **Aircraft-type margin** (from pricing rules, e.g., `marginByAircraftType.Light`)
3. **Global margin** (from pricing rules, `marginPercentage`)

### Example
- Aircraft: Cessna Citation CJ2
- Commission: 15% (aircraft-specific)
- Route: DEL → BOM (1400 km)
- Flight hours: 3.5
- Hourly operating cost: $5,000
- Base flying cost: $17,500
- Fuel surcharge: $1,400 (at $1/km)
- Airport fees: $500 (per leg)
- Crew expenses: $1,750 (at $500/hour)
- Subtotal: $21,150
- Ground handling: $1,000
- Subtotal with handling: $22,150
- Margin (15%): $3,322.50
- Subtotal with margin: $25,472.50
- Tax (18%): $4,585.05
- **Total: $30,057.55**

## Adding Aircraft and Configuring Pricing

### Step 1: Add Aircraft
1. Go to **Manage Fleet** in admin panel
2. Click "Add Aircraft"
3. Fill in:
   - **Basic Info**: Name, Tail Number, Category, Manufacturer, Model
   - **Pricing**: 
     - Hourly Rate: Base hourly rate for this aircraft
     - Currency: USD, INR, etc.
     - **Commission %**: Aircraft-specific commission (overrides pricing rule margins)
   - **Operating Costs**:
     - Hourly Operating Cost: Base cost per hour
     - Fuel Cost per km: Fuel surcharge per kilometer
     - Crew Expense per hour: Crew cost per hour
   - **Specifications**: Seats, speed, range, base, pilots, YOM, etc.
   - **Images**: Main image, interior photos, range map
4. Save aircraft

### Step 2: Configure Pricing Rules
1. Go to **Pricing Rules** in admin panel
2. Create or edit a pricing rule:
   - Set global margin percentage
   - Set margins by aircraft type (if you want different margins for Light vs Large jets)
   - Configure fees (fuel surcharge, airport fees, ground handling, crew expenses)
   - Set tax rate and name
   - Configure multi-leg discounts
3. Mark rule as "Active"

### Step 3: Add Routes
1. Go to **Manage Routes** in admin panel
2. Add routes for all city pairs you serve:
   - Origin airport code (e.g., DEL)
   - Destination airport code (e.g., BOM)
   - Origin city (e.g., New Delhi)
   - Destination city (e.g., Mumbai)
   - Distance in km
   - Estimated time in hours
3. Mark popular routes

## Booking Types

### One-Way
- Single leg: Origin → Destination
- One departure date/time
- Pricing calculated for one leg

### Round-Trip
- Two legs: Origin → Destination → Origin
- Departure date/time and return date/time
- Pricing calculated for both legs
- Return leg uses same aircraft

### Multi-Trip
- Multiple legs (e.g., DEL → BOM → BLR → DEL)
- Each leg has its own departure date/time
- Pricing calculated for all legs
- Multi-leg discount applied if configured (after N legs)

## Email Templates

All emails include:
- Skyriting logo (`her_o.png`)
- Professional styling
- Complete booking/quote details

Email types:
1. **Quote Email**: Sent when admin creates a quote
2. **Booking Confirmation**: Sent when customer accepts quote
3. **Reschedule Notification**: Sent when reschedule is approved/rejected
4. **Verification Email**: Sent for email verification
5. **Password Reset**: Sent for password reset

## Deployment on Railway

### Prerequisites
1. Railway account
2. MongoDB Atlas cluster
3. GoDaddy domain (optional)

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Complete admin panel and booking system"
   git push origin main
   ```

2. **Connect Railway to GitHub**
   - Go to Railway dashboard
   - New Project → Deploy from GitHub repo
   - Select your repository

3. **Set Environment Variables in Railway**
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/skyritingdb?appName=Cluster0
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ADMIN_EMAIL=admin@skyriting.com
   ADMIN_PASSWORD=Admin@123
   GMAIL_CLIENT_ID=your-gmail-client-id
   GMAIL_CLIENT_SECRET=your-gmail-client-secret
   GMAIL_REFRESH_TOKEN=your-gmail-refresh-token
   GMAIL_REDIRECT_URI=https://developers.google.com/oauthplayground
   GMAIL_USER=info@skyriting.com
   NODE_ENV=production
   ```
   **Important**: Do NOT use quotes around values in Railway!

4. **Configure Custom Domain (Optional)**
   - In Railway project settings, add custom domain
   - Update GoDaddy DNS:
     - A record: `@` → Railway IP address
     - CNAME: `www` → `your-railway-domain.up.railway.app`
     - TXT: `_railway-verify` → Railway verification code

5. **Deploy**
   - Railway automatically deploys on push to main branch
   - Check deployment logs for any errors
   - Admin user is automatically created on first deployment

## Testing the Complete Flow

### 1. Admin Setup
1. Login to admin panel
2. Add at least one aircraft with:
   - Tail number
   - Hourly rate
   - Commission percentage (optional)
   - Operating costs
   - Specifications
3. Add routes for city pairs
4. Create/activate a pricing rule

### 2. Client Booking
1. Go to home page
2. Search for flights (one-way, round-trip, or multi-trip)
3. View search results
4. Click "View Details" on an aircraft
5. Fill out enquiry form
6. Submit enquiry

### 3. Admin Processing
1. Go to Manage Inquiries
2. Find the new enquiry
3. Create quote (system calculates pricing automatically)
4. Quote is sent to customer via email

### 4. Customer Acceptance
1. Customer logs in
2. Views quote in account
3. Accepts quote
4. Booking is created automatically
5. Confirmation email sent

### 5. Booking Management
1. Customer can view booking in account
2. Customer can request reschedule
3. Admin can update booking status
4. Admin can manage reschedule requests

## Troubleshooting

### Admin Login Issues
- Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars
- Admin is auto-created on server startup if doesn't exist
- Check server logs for admin initialization messages

### Pricing Calculation Issues
- Ensure routes are added for all city pairs
- Check aircraft has operating costs configured
- Verify pricing rule is active
- Check commission percentage on aircraft

### Email Issues
- Verify Gmail OAuth2 credentials
- Check `GMAIL_USER` matches OAuth2 account
- Check email service logs

### Booking Issues
- Ensure quote is accepted before creating booking
- Check aircraft is available
- Verify all required fields are filled

## Support

For issues or questions:
- Email: info@skyriting.com
- Check server logs in Railway dashboard
- Review MongoDB Atlas logs

---

**Last Updated**: 2024
**Version**: 1.0.0
