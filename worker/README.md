# Admin API (Cloudflare Worker)

The site is static, so `/admin` needs a small server to hold the GitHub
credential. This Worker:

1. Verifies the Google sign-in token from the browser.
2. Checks the email against [`admins.txt`](../admins.txt), read from the repo
   on every request (cached for 60 seconds), so removing someone takes effect
   within a minute.
3. Reads and commits `content/*.md`, image uploads, and `admins.txt` (from
   the **Admins** tab) with its own GitHub token. Commits are authored as the
   signed-in officer. Nothing else in the repo can be changed through it.

Sessions last 12 hours.

## One-time setup

### 1. Google OAuth client

1. In [Google Cloud Console](https://console.cloud.google.com/), create or pick
   a project (the existing `rchb-website` Firebase project works).
2. **APIs & Services → OAuth consent screen**: set it to External, fill in the
   app name and support email, and publish it. Only the basic `email`/`profile`
   scopes are used, so no verification is needed.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**,
   type **Web application**. Under **Authorized JavaScript origins**, add
   `https://ratcityhomebrewclub.github.io` (or your custom domain) and
   `http://localhost:3000`. No redirect URIs are needed.
4. Copy the client ID.

### 2. GitHub token for the Worker

Create a [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new)
with resource owner `ratcityhomebrewclub`, access to only the `public`
repository, and **Contents: Read and write**. Pick a long expiry, or use an
account set up for the club, and note when it expires.

### 3. Deploy the Worker

```bash
cd worker
npx wrangler login
# Put the client ID in wrangler.toml (GOOGLE_CLIENT_ID), and your custom
# domain in ALLOWED_ORIGINS if you use one.
npx wrangler secret put GITHUB_TOKEN     # paste the token from step 2
npx wrangler secret put SESSION_SECRET   # paste the output of: openssl rand -hex 32
npx wrangler deploy
```

`wrangler deploy` prints the Worker URL, e.g. `https://rchb-admin.<account>.workers.dev`.

### 4. Point the site at it

In `app/config/site.js`, set `admin.apiUrl` to the Worker URL and
`admin.googleClientId` to the client ID, then push to `main`.

## Managing admins

Use the **Admins** tab on `/admin`, or edit [`admins.txt`](../admins.txt) on
GitHub: one Google account email per line, `#` for comments. Any admin can add
or remove others, but not themselves. The repository is public, so the list is
too.

## Tests and local development

```bash
node --test worker/test/*.test.mjs     # from the repo root
```

To run the whole flow locally, run `npx wrangler dev` in `worker/`, with the
secrets in `worker/.dev.vars` as `NAME=value` lines. Then start the site with
`NEXT_PUBLIC_ADMIN_API_URL=http://localhost:8787 NEXT_PUBLIC_GOOGLE_CLIENT_ID=<id> npm run dev`.
