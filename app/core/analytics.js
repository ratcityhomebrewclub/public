import ReactGA from 'react-ga';
import 'dotenv/config'

export const initGA = () => {
  ReactGA.initialize(process.env.FIREBASE_MEASUREMENT_ID); // Replace with your tracking ID
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};