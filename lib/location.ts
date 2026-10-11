export interface ZoneLocation {
  pincode: string;
  area: string;
  lat: number;
  lng: number;
  tier: 'core' | 'phase2' | 'out-of-range';
  isDeliverable: boolean;
  deliveryFee: number;
  distanceKm: number;
  avgDeliveryMinutes: number;
  description: string;
}

export const CENTRAL_KITCHEN = {
  name: 'Central Kitchen Hub (Semmozhi Nagar)',
  area: 'Kuniyamuthur',
  city: 'Coimbatore',
  pincode: '641008',
  lat: 10.9575,
  lng: 76.9530,
  coreRadiusKm: 4.0,
  maxDeliveryRadiusKm: 10.0,
  phase2BaseFee: 35,
};

/**
 * Calculates straight line (haversine) distance in kilometers between two geo-coordinates
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const COIMBATORE_ALL_ZONES: ZoneLocation[] = [
  // --- Phase 1: Core Kitchen Hub (0 - 4 km) -> 100% Free Delivery ---
  {
    pincode: '641008',
    area: 'Kuniyamuthur',
    lat: 10.9575,
    lng: 76.9530,
    distanceKm: 0.0,
    tier: 'core',
    isDeliverable: true,
    deliveryFee: 0,
    avgDeliveryMinutes: 15,
    description: 'Central Kitchen Hub (Semmozhi Nagar) • Instant Priority Dispatch • Free Delivery',
  },
  {
    pincode: '641042',
    area: 'Kovaipudhur',
    lat: 10.9415,
    lng: 76.9360,
    distanceKm: 2.6,
    tier: 'core',
    isDeliverable: true,
    deliveryFee: 0,
    avgDeliveryMinutes: 20,
    description: 'Kovaipudhur Township & Ashram area • Daily insulated delivery • Free Delivery',
  },
  {
    pincode: '641001',
    area: 'Ukkadam',
    lat: 10.9880,
    lng: 76.9630,
    distanceKm: 3.6,
    tier: 'core',
    isDeliverable: true,
    deliveryFee: 0,
    avgDeliveryMinutes: 20,
    description: 'Ukkadam Lake & Bypass stretch • Hot insulated box delivery • Free Delivery',
  },
  {
    pincode: '641024',
    area: 'Sundarapuram',
    lat: 10.9575,
    lng: 76.9850,
    distanceKm: 3.5,
    tier: 'core',
    isDeliverable: true,
    deliveryFee: 0,
    avgDeliveryMinutes: 20,
    description: 'Pollachi Main Road & SIDCO corridor • Express dispatch • Free Delivery',
  },

  // --- Phase 2: Extended Delivery (4 - 10 km) -> Deliverable with Delivery Charge (₹35) ---
  {
    pincode: '641002',
    area: 'RS Puram',
    lat: 11.0089,
    lng: 76.9500,
    distanceKm: 5.7,
    tier: 'phase2',
    isDeliverable: true,
    deliveryFee: 35,
    avgDeliveryMinutes: 30,
    description: 'Phase 2 Route (5.7 km) • ₹35 Delivery Fee applies',
  },
  {
    pincode: '641018',
    area: 'Race Course',
    lat: 11.0038,
    lng: 76.9744,
    distanceKm: 5.7,
    tier: 'phase2',
    isDeliverable: true,
    deliveryFee: 35,
    avgDeliveryMinutes: 25,
    description: 'Phase 2 Route (5.7 km) • ₹35 Delivery Fee applies',
  },
  {
    pincode: '641045',
    area: 'Ramanathapuram',
    lat: 10.9942,
    lng: 76.9936,
    distanceKm: 6.0,
    tier: 'phase2',
    isDeliverable: true,
    deliveryFee: 35,
    avgDeliveryMinutes: 30,
    description: 'Phase 2 Route (6.0 km) • ₹35 Delivery Fee applies',
  },
  {
    pincode: '641012',
    area: 'Gandhipuram',
    lat: 11.0183,
    lng: 76.9644,
    distanceKm: 6.9,
    tier: 'phase2',
    isDeliverable: true,
    deliveryFee: 35,
    avgDeliveryMinutes: 30,
    description: 'Phase 2 Route (6.9 km) • ₹35 Delivery Fee applies',
  },
  {
    pincode: '641011',
    area: 'Saibaba Colony',
    lat: 11.0268,
    lng: 76.9442,
    distanceKm: 7.8,
    tier: 'phase2',
    isDeliverable: true,
    deliveryFee: 35,
    avgDeliveryMinutes: 35,
    description: 'Phase 2 Route (7.8 km) • ₹35 Delivery Fee applies',
  },
  {
    pincode: '641005',
    area: 'Singanallur',
    lat: 10.9995,
    lng: 77.0270,
    distanceKm: 9.3,
    tier: 'phase2',
    isDeliverable: true,
    deliveryFee: 35,
    avgDeliveryMinutes: 35,
    description: 'Phase 2 Route (9.3 km) • ₹35 Delivery Fee applies',
  },
  {
    pincode: '641006',
    area: 'Ganapathy',
    lat: 11.0345,
    lng: 76.9850,
    distanceKm: 9.2,
    tier: 'phase2',
    isDeliverable: true,
    deliveryFee: 35,
    avgDeliveryMinutes: 35,
    description: 'Phase 2 Route (9.2 km) • ₹35 Delivery Fee applies',
  },
  {
    pincode: '641004',
    area: 'Peelamedu',
    lat: 11.0289,
    lng: 77.0097,
    distanceKm: 9.8,
    tier: 'phase2',
    isDeliverable: true,
    deliveryFee: 35,
    avgDeliveryMinutes: 35,
    description: 'Phase 2 Route (9.8 km) • ₹35 Delivery Fee applies',
  },
  {
    pincode: '641041',
    area: 'Vadavalli',
    lat: 11.0315,
    lng: 76.9015,
    distanceKm: 9.9,
    tier: 'phase2',
    isDeliverable: true,
    deliveryFee: 35,
    avgDeliveryMinutes: 40,
    description: 'Phase 2 Route (9.9 km) • ₹35 Delivery Fee applies',
  },

  // --- Phase 3 / Beyond 10 km -> Not Deliverable Yet ---
  {
    pincode: '641035',
    area: 'Saravanampatti',
    lat: 11.0797,
    lng: 76.9980,
    distanceKm: 14.4,
    tier: 'out-of-range',
    isDeliverable: false,
    deliveryFee: 0,
    avgDeliveryMinutes: 45,
    description: 'Beyond 10km radius (14.4 km) • Expansion Phase 3 Coming Soon',
  },
];

export interface EvaluatedLocation {
  area: string;
  pincode: string;
  city: string;
  lat?: number;
  lng?: number;
  distanceKm: number;
  tier: 'core' | 'phase2' | 'out-of-range';
  isDeliverable: boolean;
  deliveryFee: number;
  formattedAddress: string;
  message: string;
}

/**
 * Evaluates coordinates and determines tier and delivery charges
 */
export function evaluateLocation(
  lat: number,
  lng: number,
  overrideArea?: string,
  overridePincode?: string
): EvaluatedLocation {
  const distance = calculateDistanceKm(
    lat,
    lng,
    CENTRAL_KITCHEN.lat,
    CENTRAL_KITCHEN.lng
  );

  // Find closest pre-defined zone
  let closestZone: ZoneLocation = COIMBATORE_ALL_ZONES[0];
  let minDistance = 99999;
  for (const z of COIMBATORE_ALL_ZONES) {
    const d = calculateDistanceKm(lat, lng, z.lat, z.lng);
    if (d < minDistance) {
      minDistance = d;
      closestZone = z;
    }
  }

  const area = overrideArea || closestZone.area;
  const pincode = overridePincode || closestZone.pincode;
  const city = 'Coimbatore';

  let tier: 'core' | 'phase2' | 'out-of-range';
  let isDeliverable: boolean;
  let deliveryFee: number;
  let message: string;

  if (distance <= CENTRAL_KITCHEN.coreRadiusKm) {
    tier = 'core';
    isDeliverable = true;
    deliveryFee = 0;
    message = `Core Hub Zone (${distance} km from kitchen) • Free Doorstep Delivery`;
  } else if (distance <= CENTRAL_KITCHEN.maxDeliveryRadiusKm) {
    tier = 'phase2';
    isDeliverable = true;
    deliveryFee = CENTRAL_KITCHEN.phase2BaseFee;
    message = `Phase 2 Route (${distance} km from kitchen) • ₹${deliveryFee} Delivery Charge applies`;
  } else {
    tier = 'out-of-range';
    isDeliverable = false;
    deliveryFee = 0;
    message = `Location is ${distance} km away (Beyond our 10km active delivery radius). Coming in Phase 3!`;
  }

  return {
    area,
    pincode,
    city,
    lat,
    lng,
    distanceKm: distance,
    tier,
    isDeliverable,
    deliveryFee,
    formattedAddress: `${area}, ${pincode}, Coimbatore`,
    message,
  };
}

/**
 * Finds zone by pincode
 */
export function getZoneByPincode(pincode: string): ZoneLocation | undefined {
  const clean = pincode.trim();
  return COIMBATORE_ALL_ZONES.find((z) => z.pincode === clean);
}
