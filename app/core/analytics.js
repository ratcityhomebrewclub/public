'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ReactGA from 'react-ga4';

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
let initialized = false;

// Sends a GA4 page view on every client-side route change.
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!measurementId) return;
    if (!initialized) {
      ReactGA.initialize(measurementId);
      initialized = true;
    }
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
  }, [pathname]);

  return null;
}
