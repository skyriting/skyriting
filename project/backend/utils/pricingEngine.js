import PricingRule from '../models/PricingRule.js';
import Route from '../models/Route.js';

/**
 * Calculate distance between two airports
 * Uses Route collection if available, otherwise calculates using coordinates
 */
async function getRouteDistance(origin, destination) {
  // Try to find in Route collection
  const route = await Route.findOne({ 
    origin: origin.toUpperCase(), 
    destination: destination.toUpperCase() 
  });
  
  if (route) {
    return {
      distance: route.distance_km,
      estimatedTime: route.estimatedTime_hours,
    };
  }
  
  // Fallback: calculate from airport coordinates if available
  // For now, return null - admin should add routes
  return null;
}

/**
 * Calculate flight hours for a leg
 */
function calculateFlightHours(distance, cruiseSpeed, buffer = 0.5) {
  if (!distance || !cruiseSpeed) return 0;
  return (distance / cruiseSpeed) + buffer;
}

/**
 * Calculate cost for a single leg
 */
function calculateLegCost(aircraft, distance, pricingRule) {
  const flightHours = calculateFlightHours(
    distance, 
    aircraft.cruise_speed || aircraft.specs?.speed,
    pricingRule?.flightTimeBuffer || 0.5
  );
  
  const hourlyRate = aircraft.hourly_rate || aircraft.operatingCosts?.hourlyOperatingCost || 0;
  const baseFlyingCost = flightHours * hourlyRate;
  
  return {
    flightHours: Math.round(flightHours * 100) / 100,
    baseFlyingCost: Math.round(baseFlyingCost * 100) / 100,
  };
}

/**
 * Main pricing calculation function - Transparent Cost-Plus Model
 * Formula: (Hourly Operating Cost + Fuel Surcharge + Airport Fees + Crew Expenses) × (1 + Margin %)
 */
export async function calculatePricing(aircraft, legs, pricingRule = null) {
  try {
    // Get active pricing rule if not provided
    if (!pricingRule) {
      pricingRule = await PricingRule.findOne({ isActive: true });
      if (!pricingRule) {
        // Default pricing rule
        pricingRule = {
          marginPercentage: 0,
          taxRate: 0,
          fees: {
            fuelSurchargePerKm: 0,
            airportFeePerLeg: 0,
            groundHandling: 0,
            crewExpensePerHour: 0,
          },
          defaultCurrency: 'USD',
          flightTimeBuffer: 0.5,
        };
      }
    }

    const currency = pricingRule.defaultCurrency || 'USD';
    let totalBaseFlyingCost = 0;
    let totalFuelSurcharge = 0;
    let totalAirportFees = 0;
    let totalCrewExpenses = 0;
    const legBreakdown = [];

    // Calculate each leg
    for (const leg of legs) {
      const distance = leg.distance || await getRouteDistance(leg.origin, leg.destination).then(r => r?.distance);
      
      if (!distance) {
        throw new Error(`Distance not found for route ${leg.origin} to ${leg.destination}`);
      }

      const legCost = calculateLegCost(aircraft, distance, pricingRule);
      const fuelSurcharge = (pricingRule.fees?.fuelSurchargePerKm || 0) * distance;
      const airportFee = pricingRule.fees?.airportFeePerLeg || 0;
      const crewExpense = legCost.flightHours * (pricingRule.fees?.crewExpensePerHour || 0);

      totalBaseFlyingCost += legCost.baseFlyingCost;
      totalFuelSurcharge += fuelSurcharge;
      totalAirportFees += airportFee;
      totalCrewExpenses += crewExpense;

      legBreakdown.push({
        origin: leg.origin,
        destination: leg.destination,
        distance: Math.round(distance),
        flightHours: legCost.flightHours,
        baseFlyingCost: Math.round(legCost.baseFlyingCost * 100) / 100,
        fuelSurcharge: Math.round(fuelSurcharge * 100) / 100,
        airportFee: Math.round(airportFee * 100) / 100,
        crewExpense: Math.round(crewExpense * 100) / 100,
        legSubtotal: Math.round((legCost.baseFlyingCost + fuelSurcharge + airportFee + crewExpense) * 100) / 100,
      });
    }

    // Calculate subtotal (before margin)
    const subtotal = totalBaseFlyingCost + totalFuelSurcharge + totalAirportFees + totalCrewExpenses;
    
    // Apply ground handling (once per trip)
    const groundHandling = pricingRule.fees?.groundHandling || 0;
    const subtotalWithHandling = subtotal + groundHandling;

    // Apply margin percentage
    const marginPercentage = pricingRule.marginPercentage || 0;
    const marginAmount = (subtotalWithHandling * marginPercentage) / 100;
    const subtotalWithMargin = subtotalWithHandling + marginAmount;

    // Apply tax
    const taxRate = pricingRule.taxRate || 0;
    const taxAmount = (subtotalWithMargin * taxRate) / 100;
    const totalCost = subtotalWithMargin + taxAmount;

    // Apply multi-leg discount if applicable
    let multiLegDiscount = 0;
    if (legs.length >= (pricingRule.multiLegRules?.applyDiscountAfterLegs || 3)) {
      const discountRate = pricingRule.multiLegRules?.multiLegDiscount || 0;
      multiLegDiscount = (totalCost * discountRate) / 100;
    }

    const finalTotal = totalCost - multiLegDiscount;

    return {
      breakdown: {
        baseFlyingCost: Math.round(totalBaseFlyingCost * 100) / 100,
        fuelSurcharge: Math.round(totalFuelSurcharge * 100) / 100,
        airportFees: Math.round(totalAirportFees * 100) / 100,
        crewExpenses: Math.round(totalCrewExpenses * 100) / 100,
        groundHandling: Math.round(groundHandling * 100) / 100,
        subtotal: Math.round(subtotalWithHandling * 100) / 100,
        marginPercentage,
        marginAmount: Math.round(marginAmount * 100) / 100,
        subtotalWithMargin: Math.round(subtotalWithMargin * 100) / 100,
        taxRate,
        taxAmount: Math.round(taxAmount * 100) / 100,
        totalBeforeDiscount: Math.round(totalCost * 100) / 100,
        multiLegDiscount: Math.round(multiLegDiscount * 100) / 100,
        totalCost: Math.round(finalTotal * 100) / 100,
      },
      legBreakdown,
      currency,
      pricingRule: {
        marginPercentage,
        taxRate,
        taxName: pricingRule.taxName || 'Tax',
      },
    };
  } catch (error) {
    throw new Error(`Pricing calculation error: ${error.message}`);
  }
}

/**
 * Filter aircraft based on search criteria
 */
export function filterAircraft(aircraftList, filters) {
  let filtered = [...aircraftList];

  // Filter by aircraft class/type
  if (filters.aircraftClass && filters.aircraftClass !== 'all') {
    filtered = filtered.filter(a => 
      a.category === filters.aircraftClass || 
      a.type === filters.aircraftClass
    );
  }

  // Filter by capacity
  if (filters.minCapacity) {
    filtered = filtered.filter(a => 
      (a.passenger_capacity || a.specs?.seats) >= filters.minCapacity
    );
  }

  // Filter by amenities
  if (filters.amenities && filters.amenities.length > 0) {
    filtered = filtered.filter(a => {
      const aircraftAmenities = a.amenities || [];
      return filters.amenities.every(amenity => 
        aircraftAmenities.includes(amenity)
      );
    });
  }

  // Filter by price range (will be applied after pricing calculation)
  // This is handled in the search route

  return filtered;
}
