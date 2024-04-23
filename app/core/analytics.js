import ReactGA from 'react-ga';

export const initGA = () => {
  ReactGA.initialize(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID); // Replace with your tracking ID
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};