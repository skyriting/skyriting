# Skyriting Mobile App Features

## Progressive Web App (PWA) Capabilities

Skyriting is now a full-featured Progressive Web App that can be installed on mobile devices for a native app-like experience.

## NEW: Smart Input & Autocomplete Features

### Intelligent City Selection
- **Autocomplete Dropdowns:** Type-ahead search for all cities
- **Popular Cities Highlighted:** Quick access to frequently used airports
- **25+ Indian Cities:** Major airports across India pre-loaded
- **Search by Name or Code:** Find cities by name, airport code, or state
- **Real-time Filtering:** Instant results as you type

### Quick Route Selection
- **One-Click Popular Routes:** Pre-configured routes like Mumbai-Delhi, Bangalore-Hyderabad
- **Auto-Distance Calculation:** Distances automatically filled for popular routes
- **Route Suggestions:** Smart recommendations based on your selection

### Smart Features in Action

#### Search Widget (Home Page)
- Quick route buttons for instant selection
- City autocomplete with airport details
- Popular routes: Mumbai-Delhi, Bangalore-Hyderabad, Mumbai-Goa, and more

#### Pricing Calculator
- Auto-distance calculation from route database
- 20+ pre-calculated popular routes
- Manual override option for custom routes
- Instant pricing when cities selected

#### Booking Form
- Same smart city selection throughout
- Consistent experience across all forms
- Less typing, faster bookings

### Installation

**On Android:**
1. Open the website in Chrome
2. Tap the three-dot menu
3. Select "Add to Home Screen" or "Install App"
4. The Skyriting icon will appear on your home screen

**On iOS (iPhone/iPad):**
1. Open the website in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. The Skyriting icon will appear on your home screen

### Key Mobile Features

## 1. Instant Pricing Calculator
**New Feature:** Real-time flight cost calculator with detailed breakdowns
- Enter flight details (departure, arrival, distance, passengers)
- Filter by aircraft category
- Get instant pricing estimates for multiple aircraft options
- Compare costs, flight times, and aircraft specifications
- View detailed cost breakdowns (base cost, landing fees, GST)
- One-tap booking from pricing results

**Access:** Bottom navigation → "Pricing" or top menu → "Pricing"

## 2. User Account & Booking History
**New Feature:** Complete account management and booking tracking
- View all your flight enquiries and bookings
- Track booking status (New, Contacted, Quoted, Booked, Cancelled)
- See detailed information for each booking
- Access booking history anytime
- Quick actions for new bookings and support

**Access:** Bottom navigation → "Account"

## 3. Mobile Bottom Navigation
**New Feature:** Quick access navigation bar
- Always visible on mobile devices
- Five main sections:
  - **Home:** Main page with search widget
  - **Fleet:** Browse all aircraft
  - **Pricing:** Calculate flight costs
  - **Deals:** JetSteals empty leg offers
  - **Account:** Your profile and bookings

## 4. Offline Capabilities
- Service Worker caches pages for offline viewing
- View previously loaded content without internet
- Seamless online/offline transitions

## 5. Enhanced Mobile Experience

### Responsive Design
- Optimized layouts for all screen sizes (320px to 1920px)
- Touch-friendly buttons and forms
- Swipe-friendly galleries and lists
- Adaptive typography and spacing

### Mobile-Optimized Search Widget
- Large touch targets for easy input
- Streamlined form fields for mobile
- One-handed operation friendly
- Real-time validation

### Fleet Browsing
- Grid layout optimized for mobile
- Quick filter buttons
- Detailed aircraft cards with specifications
- One-tap booking from any aircraft

### JetSteals (Empty Leg Deals)
- Card-based deal display
- Prominent pricing and savings
- Easy comparison between deals
- Quick booking action

### Booking Forms
- Multi-step forms with clear progression
- Mobile-friendly date/time pickers
- Auto-save form data
- Confirmation screens

## 6. Performance Optimizations

- **Fast Loading:** Optimized assets and code splitting
- **Smooth Animations:** Hardware-accelerated transitions
- **Low Data Usage:** Efficient image loading and caching
- **Battery Efficient:** Optimized rendering and updates

## 7. Technical Features

### PWA Manifest
```json
{
  "name": "Skyriting - Private Aviation",
  "short_name": "Skyriting",
  "display": "standalone",
  "theme_color": "#0284c7",
  "background_color": "#ffffff"
}
```

### Service Worker
- Caches essential assets
- Provides offline functionality
- Background sync for booking submissions
- Updates content automatically

## 8. Database Integration

All features connect to the same Supabase backend:
- **Aircraft:** Real-time fleet data
- **Enquiries:** Booking submissions and tracking
- **Memberships:** Tier information and benefits
- **Empty Legs:** Dynamic JetSteals inventory
- **Pricing:** Real-time cost calculations

## 9. Mobile-Specific Features (Coming Soon)

### Push Notifications
- Booking status updates
- JetSteals alerts for favorite routes
- Membership benefits reminders
- Flight reminders

### Geolocation
- Auto-detect departure city
- Find nearby airports
- Distance calculations
- Route suggestions

### Camera Integration
- Document upload for bookings
- ID verification
- In-flight photos

### Biometric Authentication
- Fingerprint/Face ID login
- Secure payment methods
- Quick booking access

## Pricing Calculator Details

### How It Works

1. **Enter Route Information**
   - Departure and arrival cities
   - Flight distance in kilometers
   - Number of passengers

2. **Filter Aircraft**
   - Choose aircraft category or "All Aircraft"
   - System automatically filters by passenger capacity

3. **View Estimates**
   - Sorted by total cost (best value first)
   - See flight time, hourly rate, and total cost
   - Detailed breakdown of all charges

4. **Cost Breakdown Includes:**
   - **Base Cost:** Hourly rate × Flight hours
   - **Landing Fees:** ₹25,000 (standard estimate)
   - **Ground Handling:** ₹15,000 (standard estimate)
   - **GST:** 18% of subtotal
   - **Total:** All-inclusive cost

5. **Book Directly**
   - One-tap booking from any estimate
   - Pre-filled booking form with your selection
   - Instant quote request to team

### Example Calculation

**Route:** Mumbai to Delhi (1,400 km)
**Passengers:** 6
**Aircraft:** Hawker 900XP (MidSize)

- **Flight Time:** 1.75 hours (1,400 km ÷ 800 km/h)
- **Base Cost:** ₹8,75,000 (₹5,00,000/hr × 1.75 hrs)
- **Landing Fees:** ₹25,000
- **Ground Handling:** ₹15,000
- **Subtotal:** ₹9,15,000
- **GST (18%):** ₹1,64,700
- **Total Cost:** ₹10,79,700

## Account Features

### Booking History
- View all enquiries in chronological order
- Color-coded status indicators
- Detailed information cards
- Quick filters and search (coming soon)

### Status Types
- **New:** Recently submitted, awaiting review
- **Contacted:** Team has reached out
- **Quoted:** Price quote provided
- **Booked:** Confirmed booking
- **Cancelled:** Cancelled by customer or airline

### Profile Information
- Name, email, phone number
- Booking statistics
- Membership status (if applicable)
- Saved preferences

### Quick Actions
- Create new booking
- View membership plans
- Contact support
- Access empty leg deals

## Technology Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS with responsive breakpoints
- **Routing:** React Router v7
- **Database:** Supabase (PostgreSQL)
- **PWA:** Service Workers, Web App Manifest
- **Build:** Vite with optimized production builds

## Browser Support

- **Android:** Chrome 90+, Edge 90+
- **iOS:** Safari 14+
- **Desktop:** All modern browsers

## Installation Size

- **Initial Download:** ~400 KB
- **Cached Assets:** ~1-2 MB
- **Offline Storage:** ~5 MB

## Data Usage

- **First Load:** ~1.5 MB
- **Subsequent Loads:** ~100 KB (cached)
- **Pricing Calculator:** Minimal (database queries)
- **Booking Submission:** <50 KB

## Security

- HTTPS enforced
- Secure database connections
- No sensitive data stored locally
- Session management via Supabase
- RLS policies on all database tables

## Future Enhancements

1. **Payment Integration**
   - Secure payment gateway
   - Save payment methods
   - Booking deposits and full payments

2. **Real-Time Tracking**
   - Live flight tracking
   - Aircraft position updates
   - ETA calculations

3. **Chat Support**
   - In-app messaging
   - Quick responses from team
   - Booking modifications

4. **Favorites & Saved Searches**
   - Save frequent routes
   - Bookmark favorite aircraft
   - Set price alerts

5. **Social Features**
   - Share trips with friends
   - Group bookings
   - Referral program

6. **Enhanced Notifications**
   - Booking reminders
   - Check-in notifications
   - Special offer alerts

## Support

For technical support or feature requests:
- Email: support@skyriting.com
- Phone: +91 123 456 7890
- In-app: Account → Contact Support

## Version History

### v1.0.0 (Current)
- Progressive Web App implementation
- Pricing calculator with real-time quotes
- User account and booking history
- Mobile bottom navigation
- Enhanced responsive design
- Offline capabilities
- 8 aircraft types with detailed specs
- 3 membership tiers
- 4 specialized packages
- Empty leg deals showcase
- Multi-step booking forms
