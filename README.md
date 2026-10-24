# Rat City Homebrew Club website

Next.js site exported as static HTML and hosted on GitHub Pages.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site written to ./out
```

To preview the build as it will be served from `ratcityhomebrewclub.github.io/website`:

```bash
NEXT_PUBLIC_BASE_PATH=/website npm run build
```

## Editing content

The text-heavy pages (About, Officers, History, Awards, Rat Cup, Useful Links)
are markdown files in [`content/`](content/), rendered at build time. The list
of editable pages lives in [`app/config/pages.js`](app/config/pages.js).

Edit them either directly in git, or through the **admin page** at `/admin`
(also linked in the footer):

- Officers sign in with Google. Only emails listed in [`admins.txt`](admins.txt)
  are allowed in; admins can manage that list from the **Admins** tab.
- Saving commits to `main` as that officer, and the site redeploys in a minute
  or two.
- Images uploaded from the admin page go to `public/images/uploads/`.

The admin page talks to a small Cloudflare Worker that holds the GitHub
credential. See [`worker/README.md`](worker/README.md) for the one-time setup.

## Deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and
deploys every push to `main`. One-time setup in the repo settings:

- **Settings → Pages → Build and deployment → Source: GitHub Actions**
- Optional: add a custom domain there; the base path is picked up automatically.
- Optional: the `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` secret is used as the
  Google Analytics measurement ID.
- Images in markdown should use root paths such as `/images/foo.jpg`; the base
  path is added when the page is built.
