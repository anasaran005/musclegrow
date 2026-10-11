import { NextRequest, NextResponse } from 'next/server';
import { evaluateLocation, CENTRAL_KITCHEN } from '@/lib/location';

export async function GET(request: NextRequest) {
  try {
    // Query public IP geolocation service with short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://ipwho.is/', {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.latitude && data.longitude) {
        const evaluated = evaluateLocation(
          data.latitude,
          data.longitude,
          data.city || data.region,
          data.postal
        );
        return NextResponse.json(evaluated);
      }
    }
  } catch (err) {
    console.warn('IP geolocation lookup failed or timed out:', err);
  }

  // If IP lookup fails or is unavailable, default gracefully to the central kitchen hub in Kuniyamuthur
  const fallback = evaluateLocation(
    CENTRAL_KITCHEN.lat,
    CENTRAL_KITCHEN.lng,
    CENTRAL_KITCHEN.area,
    CENTRAL_KITCHEN.pincode
  );

  return NextResponse.json(fallback);
}
