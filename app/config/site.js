// Repository the site is built from. The admin page edits markdown here
// through the admin Worker; every commit to `branch` triggers the GitHub
// Pages deploy workflow.
const site = {
  name: 'Rat City Homebrew Club',
  email: 'ratcityhomebrewers@gmail.com',
  repo: {
    owner: 'ratcityhomebrewclub',
    name: 'website',
    branch: 'main',
  },
  contentDir: 'content',
  // Admin sign-in (see worker/README.md). Both values are public.
  admin: {
    // e.g. https://rchb-admin.<account>.workers.dev (env var overrides for local dev)
    apiUrl: process.env.NEXT_PUBLIC_ADMIN_API_URL || '',
    // e.g. 1234-abc.apps.googleusercontent.com
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    adminsFile: 'admins.txt',
  },
  uploadsDir: 'public/images/uploads',
};

export default site;
