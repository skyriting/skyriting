import express from 'express';
import Aircraft from '../models/Aircraft.js';
import Route from '../models/Route.js';
import { calculatePricing, filterAircraft } from '../utils/pricingEngine.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Multi-leg search with advanced filtering
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { tripType, legs, filters = {} } = req.body;

    if (!tripType || !legs || !Array.isArray(legs) || legs.length === 0) {
      return res.status(400).json({ error: 'Trip type and legs are required' });
    }

    // Validate legs
    for (const leg of legs) {
      if (!leg.origin || !leg.destination || !leg.departureDate || !leg.departureTime) {
        return res.status(400).json({ error: 'Each leg must have origin, destination, departureDate, and departureTime' });
      }
    }

    // Get all available aircraft
    let aircraftList = await Aircraft.find({ 
      available: { $ne: false },
      isActive: { $ne: false }
    });

    // Apply filters
    aircraftList = filterAircraft(aircraftList, {
      aircraftClass: filters.aircraftClass,
      minCapacity: filters.minCapacity || legs[0]?.paxCount || 1,
      amenities: filters.amenities,
    });

    // Calculate pricing for each aircraft
    const results = [];
    for (const aircraft of aircraftList) {
      try {
        // Get distances for all legs
        const legsWithDistance = await Promise.all(
          legs.map(async (leg) => {
            const route = await Route.findOne({
              origin: leg.origin.toUpperCase(),
              destination: leg.destination.toUpperCase(),
            });
            
            return {
              ...leg,
              distance: route?.distance_km || null,
            };
          })
        );

        // Check if all legs have distances
        const missingDistances = legsWithDistance.filter(leg => !leg.distance);
        if (missingDistances.length > 0) {
          continue; // Skip aircraft if route distances not available
        }

        // Calculate pricing
        const pricing = await calculatePricing(aircraft, legsWithDistance);

        // Apply price range filter if specified
        if (filters.minPrice && pricing.breakdown.totalCost < filters.minPrice) {
          continue;
        }
        if (filters.maxPrice && pricing.breakdown.totalCost > filters.maxPrice) {
          continue;
        }

        results.push({
          aircraft: {
            _id: aircraft._id,
            name: aircraft.name,
            category: aircraft.category,
            type: aircraft.type,
            manufacturer: aircraft.manufacturer,
            model: aircraft.model,
            passenger_capacity: aircraft.passenger_capacity || aircraft.specs?.seats,
            range_km: aircraft.range_km,
            cruise_speed: aircraft.cruise_speed || aircraft.specs?.speed,
            image_url: aircraft.image_url || (aircraft.images && aircraft.images[0]),
            images: aircraft.images,
            description: aircraft.description,
            amenities: aircraft.amenities,
            specs: aircraft.specs,
          },
          pricing: pricing.breakdown,
          legBreakdown: pricing.legBreakdown,
          currency: pricing.currency,
        });
      } catch (error) {
        console.error(`Error calculating pricing for aircraft ${aircraft._id}:`, error);
        continue;
      }
    }

    // Sort results
    const sortBy = filters.sortBy || 'price';
    if (sortBy === 'price') {
      results.sort((a, b) => a.pricing.totalCost - b.pricing.totalCost);
    } else if (sortBy === 'capacity') {
      results.sort((a, b) => b.aircraft.passenger_capacity - a.aircraft.passenger_capacity);
    } else if (sortBy === 'speed') {
      results.sort((a, b) => b.aircraft.cruise_speed - a.aircraft.cruise_speed);
    }

    res.json({
      results,
      count: results.length,
      filters: filters,
      tripType,
      legs,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get route distance
router.get('/route-distance', async (req, res) => {
  try {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }

    const route = await Route.findOne({
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
    });

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json({
      origin: route.origin,
      destination: route.destination,
      distance_km: route.distance_km,
      estimatedTime_hours: route.estimatedTime_hours,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
