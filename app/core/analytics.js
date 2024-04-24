'use client';
import { useEffect } from "react";
import ReactGA from "react-ga4";

export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  // console.log("Page View: " + window.location.pathname)
};

export default function Analytics() {
  const initGA = () => {
    ReactGA.initialize(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID); // Replace with your tracking ID
  };
  
  useEffect(() => {
    initGA();
    logPageView();
  });

  return (
    <div></div>
  );
}
