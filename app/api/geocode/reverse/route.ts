import { NextRequest, NextResponse } from 'next/server';
import { evaluateLocation, COIMBATORE_ALL_ZONES, calculateDistanceKm, CENTRAL_KITCHEN } from '@/lib/location';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');

  if (!latStr || !lngStr) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 }
    );
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: 'Invalid coordinates' },
      { status: 400 }
    );
  }

  let detectedArea = '';
  let detectedPincode = '';
  let formattedAddress = '';

  try {
    // Attempt reverse geocoding via OpenStreetMap Nominatim with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'GramwiseFitnessDeliveryApp/1.0 (info@gramwise.in)',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      detectedPincode = addr.postcode || '';
      detectedArea =
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.quarter ||
        addr.city_district ||
        addr.village ||
        addr.road ||
        addr.town ||
        '';

      formattedAddress = data.display_name || '';
    }
  } catch (err) {
    console.warn('Reverse geocoding upstream timed out or failed, falling back to proximity matching:', err);
  }

  // If no pincode or area extracted from upstream, find the closest known Coimbatore zone
  let closestZone = COIMBATORE_ALL_ZONES[0];
  let minD = 99999;
  for (const z of COIMBATORE_ALL_ZONES) {
    const d = calculateDistanceKm(lat, lng, z.lat, z.lng);
    if (d < minD) {
      minD = d;
      closestZone = z;
    }
  }

  // Check if detected pincode matches any zone
  if (detectedPincode) {
    const matched = COIMBATORE_ALL_ZONES.find((z) => z.pincode === detectedPincode);
    if (matched) {
      // If detected area is missing, or is a generic administrative tag like "Ward 88" or "Zone 5", use the clean area name
      const isRawWardName = !detectedArea || /^ward\s*\d+/i.test(detectedArea) || /^zone\s*\d+/i.test(detectedArea) || /^block\s*\d+/i.test(detectedArea);
      if (isRawWardName || detectedPincode === '641008') {
        detectedArea = matched.area;
      }
    }
  }

  // If detectedArea still looks like "Ward 88", fallback to closestZone.area
  if (!detectedArea || /^ward\s*\d+/i.test(detectedArea)) {
    detectedArea = closestZone.area;
  }

  const finalArea = detectedArea;
  const finalPincode = detectedPincode || closestZone.pincode;

  const result = evaluateLocation(lat, lng, finalArea, finalPincode);
  if (formattedAddress) {
    result.formattedAddress = formattedAddress;
  }

  return NextResponse.json(result);
}
