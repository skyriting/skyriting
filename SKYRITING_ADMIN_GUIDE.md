# Skyriting - Complete Admin Guide

## Table of Contents
1. [Admin Access](#admin-access)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Fleet (Aircraft)](#managing-fleet-aircraft)
4. [Managing Routes](#managing-routes)
5. [Pricing Configuration](#pricing-configuration)
6. [Managing Inquiries](#managing-inquiries)
7. [Creating Quotes](#creating-quotes)
8. [Managing Bookings](#managing-bookings)
9. [Managing Packages](#managing-packages)
10. [Managing Services](#managing-services)
11. [Managing Articles](#managing-articles)
12. [Mobility Thread Management](#mobility-thread-management)
13. [Email Configuration](#email-configuration)

---

## Admin Access

### Login URL
```
https://yourdomain.com/3636847rgyuvfu3f/98184t763gvf/login
```

### Default Credentials
- **Email**: `admin@skyriting.com` (or from `ADMIN_EMAIL` env var)
- **Password**: `Admin@123` (or from `ADMIN_PASSWORD` env var)

**⚠️ Important**: Change password after first login!

### Auto-Initialization
Admin user is automatically created on server startup if it doesn't exist. Check server logs for confirmation.

---

## Dashboard Overview

The dashboard shows:
- **Total Inquiries**: All customer inquiries
- **Total Quotes**: All quotes created
- **Total Bookings**: All confirmed bookings
- **Available Aircraft**: Count of active aircraft

**Quick Actions**:
- Manage Fleet
- Manage Inquiries
- Manage Bookings
- Pricing Rules
- Manage Routes
- Manage Packages
- Manage Services
- Manage Articles
- Mobility Thread

---

## Managing Fleet (Aircraft)

### Adding a New Aircraft

1. **Go to**: Manage Fleet
2. **Click**: "Add Aircraft"
3. **Fill Basic Information**:
   - **Aircraft Name**: e.g., "Cessna Citation CJ2"
   - **Tail Number**: Unique identifier (e.g., "N123AB") - **Required and must be unique**
   - **Category**: Light, Mid, Super Mid, Large, Airliner, Helicopter, Turboprop
   - **Manufacturer**: e.g., "Cessna"
   - **Model**: e.g., "Citation CJ2"
   - **Description**: Brief description

4. **Configure Pricing**:
   - **Hourly Rate**: Base hourly rate (e.g., 500000 for ₹5,00,000/hour)
   - **Currency**: USD, INR, etc.
   - **Commission %**: **Aircraft-specific commission** (0-100%)
     - This overrides pricing rule margins
     - Example: 15% = 15% margin for this specific aircraft
     - Leave 0 to use pricing rule margins

5. **Set Operating Costs**:
   - **Hourly Operating Cost**: Base cost per hour (used in pricing calculation)
   - **Fuel Cost per km**: Fuel surcharge per kilometer
   - **Crew Expense per hour**: Crew cost per hour

6. **Add Specifications**:
   - **Seats**: Passenger capacity
   - **Speed (KTS)**: Cruise speed in knots
   - **Range (km)**: Maximum flying range
   - **Base**: Home base location
   - **Pilots**: Number of pilots (usually 2)
   - **Year of Manufacture**: YOM
   - **Baggage Capacity**: e.g., "74 CUFT"
   - **Flight Attendant**: Yes/No checkbox
   - **Cabin Dimensions**: Height, Width, Length (optional)
   - **Lavatory**: Number of lavatories
   - **Flying Range**: e.g., "1450 NM"

7. **Upload Images**:
   - **Main Image**: Primary aircraft photo
   - **Range Map Image**: Visual range map
   - **Interior Photos**: Can be added later via edit

8. **Set Status**:
   - **Available**: Check if aircraft is available for booking
   - **Active**: Check if aircraft should appear in search results

9. **Click**: "Create Aircraft"

### Editing Aircraft

1. **Go to**: Manage Fleet
2. **Click**: Edit icon (pencil) on aircraft
3. **Update**: Any fields as needed
4. **Click**: "Update Aircraft"

### Deleting Aircraft

1. **Go to**: Manage Fleet
2. **Click**: Delete icon (trash) on aircraft
3. **Confirm**: Deletion

**Note**: Deleted aircraft cannot be recovered. Consider marking as "Inactive" instead.

---

## Managing Routes

### Adding a Route

1. **Go to**: Manage Routes
2. **Click**: "New Route"
3. **Fill Route Details**:
   - **Origin Airport Code**: e.g., "DEL" (3-letter code, uppercase)
   - **Destination Airport Code**: e.g., "BOM"
   - **Origin City**: e.g., "New Delhi"
   - **Destination City**: e.g., "Mumbai"
   - **Distance (km)**: Route distance in kilometers
   - **Estimated Time (hours)**: Flight duration
   - **Route Name**: Auto-generated if empty (e.g., "New Delhi to Mumbai")
   - **Popular Route**: Check if frequently booked

4. **Click**: "Create Route"

### Route Notes

- Routes are **one-way** by default
- For round-trip, system uses: Origin → Destination → Origin
- For multi-trip, system combines multiple routes
- Users can only search routes you've added

### Editing/Deleting Routes

- **Edit**: Click edit icon, update fields, save
- **Delete**: Click delete icon, confirm

---

## Pricing Configuration

### Creating a Pricing Rule

1. **Go to**: Pricing Rules
2. **Click**: "New Rule"
3. **Basic Settings**:
   - **Rule Name**: e.g., "Standard Pricing 2024"
   - **Active**: Check to activate (only one active rule is used)

4. **Margin Configuration**:
   - **Global Margin (%)**: Default margin for all aircraft (0-100%)
   - **Margin by Aircraft Type**: Set different margins:
     - Light: e.g., 10%
     - Mid: e.g., 12%
     - Super Mid: e.g., 15%
     - Large: e.g., 18%
     - Airliner: e.g., 20%
     - Helicopter: e.g., 15%

5. **Tax Configuration**:
   - **Tax Rate (%)**: e.g., 18 for GST
   - **Tax Name**: e.g., "GST"

6. **Fee Structure**:
   - **Fuel Surcharge (per km)**: e.g., 100 (₹100/km)
   - **Airport Fee (per leg)**: e.g., 50000 (₹50,000 per leg)
   - **Ground Handling**: e.g., 100000 (₹1,00,000 one-time)
   - **Crew Expense (per hour)**: e.g., 50000 (₹50,000/hour)

7. **Multi-Leg Rules**:
   - **Max Legs**: Maximum legs allowed (e.g., 10)
   - **Min Layover (hours)**: Minimum time between legs (e.g., 1)
   - **Multi-Leg Discount (%)**: Discount for 3+ legs (e.g., 5%)
   - **Apply Discount After (legs)**: When to apply discount (e.g., 3)

8. **Other Settings**:
   - **Default Currency**: USD, INR, etc.
   - **Flight Time Buffer (hours)**: Buffer for flight time calculation (e.g., 0.5)
   - **Valid From**: Start date
   - **Valid Until**: End date (optional)

9. **Click**: "Create Rule"

### Pricing Priority

When calculating pricing, system uses:
1. **Aircraft Commission** (if set on aircraft) - **Highest Priority**
2. **Aircraft-Type Margin** (from pricing rule)
3. **Global Margin** (from pricing rule)

### Example

**Aircraft**: Cessna Citation CJ2
- Commission: 15% (aircraft-specific)
- Route: DEL → BOM (1400 km)
- Flight hours: 3.5

**Calculation**:
- Base Flying Cost: ₹5,00,000/hour × 3.5 = ₹17,50,000
- Fuel Surcharge: ₹100/km × 1400 = ₹1,40,000
- Airport Fees: ₹50,000 (per leg)
- Crew Expenses: ₹50,000/hour × 3.5 = ₹1,75,000
- **Subtotal**: ₹21,15,000
- Ground Handling: ₹1,00,000
- **Subtotal with Handling**: ₹22,15,000
- **Margin (15%)**: ₹3,32,250
- **Subtotal with Margin**: ₹25,47,250
- **GST (18%)**: ₹4,58,505
- **Total**: ₹30,05,755

---

## Managing Inquiries

### Viewing Inquiries

1. **Go to**: Manage Inquiries
2. **View List**: All inquiries displayed
3. **Filters**:
   - **Status**: All, New, Sourcing, Quoted, Converted, Cancelled
   - **Search**: By name, email, or phone

### Inquiry Details

Click on any inquiry to see:
- **Customer Information**: Name, email, phone
- **Trip Details**: Type, route, dates, passengers
- **Status**: Current status
- **Notes**: Customer notes and admin notes

### Updating Inquiry Status

1. **Select Inquiry**
2. **Change Status** dropdown:
   - **New**: Just received
   - **Sourcing**: Looking for aircraft
   - **Quoted**: Quote sent to customer
   - **Converted**: Booking created
   - **Cancelled**: Inquiry cancelled

3. **Add Notes**:
   - **Customer Notes**: Visible to customer
   - **Admin Notes**: Internal only

4. **Click**: "Save" (if editing notes)

---

## Creating Quotes

### From Inquiry

1. **Go to**: Manage Inquiries
2. **Select**: An inquiry with status "New" or "Sourcing"
3. **Create Quote** (via API or admin panel):
   - Select aircraft
   - System calculates pricing automatically
   - Add terms and notes
   - Send quote

### Quote Details

Quote includes:
- **Aircraft**: Selected aircraft
- **Pricing Breakdown**:
  - Base Flying Cost
  - Fuel Surcharge
  - Airport Fees
  - Crew Expenses
  - Ground Handling
  - Margin
  - Tax
  - Total Cost
- **Legs**: All flight legs with dates/times
- **Validity**: Quote valid until date (usually 7 days)

### Quote Email

Quote is automatically emailed to customer with:
- Quote number
- Aircraft details
- Complete pricing breakdown
- Flight itinerary
- Validity period

---

## Managing Bookings

### Viewing Bookings

1. **Go to**: Manage Bookings
2. **View List**: All bookings
3. **Filters**:
   - **Status**: All, Pending, Confirmed, Completed, Cancelled
   - **Search**: By name, email, phone, booking reference

### Booking Details

Click on any booking to see:
- **Customer**: Name, email, phone
- **Aircraft**: Name, tail number
- **Flight Details**: Trip type, legs, passengers
- **Pricing**: Total cost, currency, payment status
- **Status**: Current booking status

### Updating Booking Status

1. **Select Booking**
2. **Change Status**:
   - **Pending**: Awaiting confirmation
   - **Confirmed**: Booking confirmed
   - **Completed**: Flight completed
   - **Cancelled**: Booking cancelled

### Reschedule Requests

1. **View**: Reschedule requests in booking details
2. **Approve/Reject**: Update reschedule status
3. **Email**: Customer notified automatically

---

## Managing Packages

### Adding a Package

1. **Go to**: Manage Packages
2. **Click**: "New Package"
3. **Fill Details**:
   - **Package Name**: e.g., "Skyriting Yatra"
   - **Slug**: URL-friendly name (auto-generated)
   - **Type**: Yatra, Wed, Heli, Rescue
   - **Price**: Starting price
   - **Duration**: e.g., "5N 6D"
   - **Short Description**: Brief overview
   - **Description**: Full description
   - **Image**: Upload package image
   - **Order**: Display order (lower = first)
   - **Active**: Check to show on website

4. **Click**: "Create Package"

### Package Features

- Packages appear on Packages page
- Users can view details and submit inquiries
- Admin receives package inquiries

---

## Managing Services

### Adding a Service

1. **Go to**: Manage Services
2. **Click**: "New Service"
3. **Fill Details**:
   - **Service Name**: e.g., "Aircraft Management"
   - **Slug**: URL-friendly name
   - **Short Description**: Brief overview
   - **Description**: Full description
   - **Image**: Upload service image
   - **Deliverables**: Array of deliverables
   - **Benefits**: Array of benefits
   - **Order**: Display order
   - **Active**: Check to show on website

4. **Click**: "Create Service"

---

## Managing Articles

### Adding an Article

1. **Go to**: Manage Articles
2. **Click**: "New Article"
3. **Fill Details**:
   - **Title**: Article title
   - **Slug**: URL-friendly name
   - **Category**: News, Media, Blog
   - **Excerpt**: Short summary
   - **Content**: Full article content
   - **Image**: Upload article image
   - **Published Date**: Publication date
   - **Featured**: Check to feature on homepage
   - **Active**: Check to publish

4. **Click**: "Create Article"

---

## Mobility Thread Management

### Viewing Posts

1. **Go to**: Mobility Thread
2. **View**: All community posts
3. **Click**: Post to see details

### Post Details

- **User**: Name, email
- **Content**: Post text
- **Images**: Uploaded images
- **Created**: Post date

### Deleting Posts

1. **Select**: Post
2. **Click**: Delete icon
3. **Confirm**: Deletion

**Note**: Only admin can delete posts. Users can delete their own posts.

---

## Email Configuration

### Gmail OAuth2 Setup

1. **Go to**: Google Cloud Console
2. **Create**: OAuth2 credentials
3. **Get**:
   - Client ID
   - Client Secret
   - Refresh Token

4. **Set Environment Variables**:
   ```
   GMAIL_CLIENT_ID=your-client-id
   GMAIL_CLIENT_SECRET=your-client-secret
   GMAIL_REFRESH_TOKEN=your-refresh-token
   GMAIL_USER=info@skyriting.com
   GMAIL_REDIRECT_URI=https://developers.google.com/oauthplayground
   ```

### Email Templates

All emails use Skyriting branding:
- **Logo**: `her_o.png` (automatically included)
- **Styling**: Professional black/red/white theme
- **Templates**:
  - Verification emails
  - Password reset emails
  - Quote emails
  - Booking confirmations
  - Reschedule notifications

### Email Issues

**If emails not sending**:
1. Check Gmail OAuth2 credentials
2. Verify `GMAIL_USER` matches OAuth2 account
3. Check server logs for errors
4. Ensure refresh token is valid

---

## Best Practices

### Fleet Management
- Add aircraft with complete specifications
- Set realistic operating costs
- Use aircraft-specific commission for special pricing
- Keep images updated
- Mark unavailable aircraft as "Unavailable"

### Pricing
- Create pricing rules for different scenarios
- Test pricing calculations
- Document special pricing arrangements
- Review pricing regularly

### Inquiries
- Respond to inquiries within 24 hours
- Update status promptly
- Add notes for internal tracking
- Create quotes quickly

### Bookings
- Confirm bookings promptly
- Update status accurately
- Handle reschedule requests quickly
- Maintain clear communication

---

## Troubleshooting

### Admin Login Issues
- Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars
- Admin auto-created on server startup
- Check server logs for admin initialization

### Pricing Calculation Errors
- Ensure routes are added for all city pairs
- Check aircraft has operating costs
- Verify pricing rule is active
- Check commission percentage

### Email Not Sending
- Verify Gmail OAuth2 credentials
- Check `GMAIL_USER` matches OAuth2 account
- Review email service logs
- Test email sending manually

### Aircraft Not Appearing in Search
- Check aircraft is marked "Available" and "Active"
- Verify aircraft matches search criteria
- Check route exists for search
- Review search route logs

---

## Support

For technical issues:
- Check server logs in Railway dashboard
- Review MongoDB Atlas logs
- Contact development team

---

**Last Updated**: 2024
**Version**: 1.0.0
