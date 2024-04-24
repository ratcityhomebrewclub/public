'use client';
import { useEffect } from "react";
import ReactGA from 'react-ga';


export default function Analytics() {
  const initGA = () => {
    console.log("Loading " + process.env.NEXT_PUBLIC_TEST_ENV)
    ReactGA.initialize(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID); // Replace with your tracking ID
  };
  
  const logPageView = () => {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  };
  useEffect(() => {
    initGA();
    logPageView();
  });

  return (
    <div></div>
  );
}
