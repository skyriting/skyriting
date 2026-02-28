// Type definitions for the application

export interface Aircraft {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  manufacturer: string;
  hourly_rate: number;
  passenger_capacity: number;
  range_km: number;
  cruise_speed: number;
  image_url?: string | null;
  description?: string | null;
  amenities?: string[];
  available?: boolean;
  created_at?: string;
}

export interface City {
  _id?: string;
  id?: string;
  name: string;
  code: string;
  airport_name: string;
  state: string;
  popular?: boolean;
}

export interface Enquiry {
  _id?: string;
  id?: string;
  enquiry_type?: string;
  aircraft_type: string;
  trip_type: string;
  departure_city: string;
  arrival_city: string;
  departure_date: string;
  return_date?: string | null;
  passenger_count: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  message?: string | null;
  status: string;
  estimated_cost?: number | null;
  created_at?: string;
}

export interface Membership {
  _id?: string;
  id?: string;
  tier_name: string;
  block_hours: number;
  hourly_rate_discount: number;
  annual_fee: number;
  guaranteed_availability_hours: number;
  priority_level: number;
  benefits: string[];
  active?: boolean;
  created_at?: string;
}

export interface EmptyLeg {
  _id?: string;
  id?: string;
  aircraft_id?: string | null;
  departure_city: string;
  arrival_city: string;
  departure_date: string;
  departure_time: string;
  passenger_capacity: number;
  standard_price: number;
  discount_percentage: number;
  final_price: number;
  available?: boolean;
  created_at?: string;
}

export interface SpecializedPackage {
  _id?: string;
  id?: string;
  package_name: string;
  package_type: string;
  title: string;
  description: string;
  features: string[];
  image_url?: string | null;
  starting_price?: number | null;
  active?: boolean;
  created_at?: string;
}

export interface PopularRoute {
  _id?: string;
  id?: string;
  route_name: string;
  distance_km: number;
  departure_city?: City | { name: string };
  arrival_city?: City | { name: string };
  departure_city_id?: string;
  arrival_city_id?: string;
  booking_count?: number;
}

export interface Service {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  tagline?: string;
  icon?: string;
  imageUrl?: string;
  images?: string[];
  order?: number;
  features?: string[];
  deliverables?: string[];
  benefits?: Array<{
    title: string;
    description: string;
  }>;
  isActive?: boolean;
  showInNavigation?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Package {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  tagline?: string;
  imageUrl?: string;
  order?: number;
  packageIncludes?: string[];
  tourHighlights?: Array<{
    icon?: string;
    text: string;
  }>;
  durationOptions?: Array<{
    name: string;
    duration?: string;
    days?: number;
    nights?: number;
    price?: number;
    pricePerSeat?: number;
    currency?: string;
    maxPax?: number;
    description?: string;
    availableDates?: string[];
  }>;
  itinerary?: Array<{
    day: number;
    title: string;
    description: string;
    activities?: string[];
    accommodation?: string;
    meals?: string;
  }>;
  startingPrice?: number;
  currency?: string;
  priceNote?: string;
  dateFlexibility?: string;
  personCapacity?: string;
  isActive?: boolean;
  showInNavigation?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Article {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  category?: string;
  author?: string;
  publishedAt?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  viewCount?: number;
}

export interface MobilityThreadPost {
  _id?: string;
  id?: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  images?: string[];
  likes?: string[];
  comments?: Array<{
    _id?: string;
    userId: string;
    userName: string;
    userPhoto?: string;
    content: string;
    likes?: string[];
    createdAt?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}
