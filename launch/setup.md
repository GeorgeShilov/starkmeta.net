# Setup Guide

This file documents the practical setup flow for launching another site similar to this one without repeating the same deployment and CMS issues.

## 1. Project Baseline

- Stack: `Astro`
- Local port: `4173`
- Package manager: `npm`
- Deployment target: `Railway`
- CMS: `Squidex`

Recommended first steps:

1. Create the Astro site structure.
2. Add shared layout, header, footer, config, and page components early.
3. Derive the launch domain from the project folder name.
4. Check the historical domain snapshot in the Wayback Machine.
5. Keep the site content in English unless the project explicitly needs another language.
6. Add local fallback blog content before wiring CMS.

## 2. Historical Domain Research

Before writing the new site content, check what used to live on the domain.

Domain rule:

- use the project folder name as the domain
- for this project, the domain is `starkmeta.net`

Wayback URL pattern:

```text
https://web.archive.org/web/20160328162852/{domain}/
```

For this project:

```text
https://web.archive.org/web/20160328162852/starkmeta.net/
```

Use the archived page to collect:

- product or company name
- original positioning and category
- visible navigation labels
- core feature claims
- support, contact, legal, or pricing hints
- any wording that should be preserved or modernized

Then bring that information into the project:

- reflect the real historical positioning in `src/config/site.ts`
- adapt page copy around the archived product/category
- seed blog topics that match the domain history
- avoid inventing a completely unrelated brand if the archive gives enough signal

## 3. Local Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev -- --host 127.0.0.1 --port 4173
```

Build check:

```bash
npm run build
npm run check
```

## 4. Required Files

These files were important for a stable setup:

- `package.json`
- `astro.config.mjs`
- `src/layouts/Layout.astro`
- `src/config/site.ts`
- `src/lib/squidex.ts`
- `.env.example`
- `Dockerfile`
- `server.mjs`
- `railway.json`

## 5. Environment Variables

Use a local `.env` and configure the same values in Railway.

Base variables:

```env
SITE_URL=https://yourdomain.com
FAL_KEY=your-fal-key
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
SQUIDEX_URL=https://cloud.squidex.io
SQUIDEX_APP=your-app-name
SQUIDEX_CLIENT_ID=your-app-name:default
SQUIDEX_CLIENT_SECRET=your-secret
```

Important:

- `SQUIDEX_CLIENT_ID` must be the exact client id from Squidex.
- Watch out for accidental Cyrillic characters inside copied secrets.
- Astro reads env on process start, so restart local dev after changing `.env`.
- Keep provider tokens in local `.env`, Railway variables, or a secret manager. Do not commit real Cloudflare, fal.ai, Railway, or Squidex tokens into launch docs.

## 6. fal.ai Asset Generation

Use fal.ai for quick branded visual systems, but keep generation bounded so launches stay fast.

For Codex Workplace we generated:

- 3 logo directions: `public/assets/fal/logo-1.png`, `logo-2.png`, `logo-3.png`
- 1 homepage hero background: `public/assets/fal/hero-background.png`
- 3 blog posts with 3 images each: 1 cover image and 2 inline images
- prompt metadata beside every image as `*.prompt.json`

Run generation with a local secret:

```bash
FAL_KEY="$FAL_KEY" node scripts/generate-fal-assets.mjs
```

Requirements:

- generate no more than 2-3 logo options per project
- every blog post must have at least 3 generated images
- one of the 3 blog images must be the article cover
- keep prompts domain-specific and avoid readable text in generated images
- review hero contrast in browser after generation, because AI backgrounds can make copy too dim

For Codex Workplace, generated assets are wired through:

- homepage hero: `src/pages/index.astro`
- blog fallback data: `src/data/blog.ts`
- Squidex fallback mapping: `src/lib/squidex.ts`

## 7. Git + GitHub

Initialize and commit early:

```bash
git init
git add .
git commit -m "Initial project setup"
```

Then create the GitHub repo and push:

```bash
git remote add origin <repo-url>
git push -u origin main
```

## 8. Railway Deployment

Use Railway, but do not rely on the default setup blindly.

### What worked reliably

- Build with `Dockerfile`
- Run a custom static Node server from `server.mjs`
- Keep Railway simple and let Docker control runtime

### Dockerfile that worked

- Build image: `node:24-bookworm-slim`
- Runtime image: `node:24-bookworm-slim`
- Build command: `npm ci && npm run build`
- Start command: `node server.mjs`

### Why this matters

Default Nixpacks/Node flow caused unnecessary issues during deploy. The Docker path was much more predictable.

### Deploy flow

1. Create Railway project.
2. Link the local directory to the project.
3. Set environment variables in Railway.
4. Deploy with Railway.
5. Verify the public Railway URL first.

Useful checks:

```bash
railway status
railway variables
curl -I https://your-railway-url.up.railway.app
```

### Codex Workplace Railway run

For the Codex Workplace launch, this folder was linked to:

- Railway project: `starkmeta.net`
- Railway service: `starkmeta.net`
- Railway temporary domain: `https://codexworkplacecom-production.up.railway.app`
- Custom domain: `starkmeta.net`
- Final custom domain target port: `null` / auto
- Final Railway custom domain id: `4c2d2005-ecb3-4fb3-bf18-686a09277ef4`

Commands used:

```bash
railway init -n starkmeta.net -w <workspace-id> --json
railway add --service starkmeta.net --json
railway up --service starkmeta.net --detach --verbose
railway domain --service starkmeta.net --json
railway variable set SITE_URL=https://starkmeta.net --service starkmeta.net --environment production --skip-deploys
```

If `railway domain starkmeta.net ...` returns `Unauthorized` even after `railway login`, use the Railway dashboard or Railway GraphQL API to create the custom domain. In this run, the CLI was intermittently authenticated for `status` but unauthorized for `domain`.

Do not force a custom domain `targetPort` unless Railway explicitly requires it. For Codex Workplace, creating the Railway custom domain with `targetPort: 3000` produced a valid certificate and verified DNS, but live requests still hit Railway fallback / Cloudflare `502`. Recreating the domain without `targetPort` fixed routing.

## 9. Custom Domain + Cloudflare DNS

Use Railway for hosting, but for custom domains prefer the Railway dashboard UI if the CLI behaves inconsistently.

Recommended order:

1. Confirm the Railway subdomain works.
2. Open Railway dashboard.
3. Add the root domain in `Networking` / `Custom Domains`.
4. Copy the exact DNS records Railway gives you.
5. Add those records at the registrar or DNS provider.
6. Wait for propagation and verify with:

```bash
curl -I https://yourdomain.com
curl -I https://www.yourdomain.com
```

Important:

- Do not assume the domain is live immediately after changing DNS.
- Verify both apex and `www` if both are expected.
- With Cloudflare proxy enabled, Railway recommends Cloudflare SSL/TLS mode `Full`, not `Full (strict)`, while Railway is issuing its certificate.

### Codex Workplace DNS records

Railway gave these records for `starkmeta.net`:

```text
CNAME
Name: @
Target: 07ahikmp.up.railway.app
Proxy: ON
```

```text
TXT
Name: _railway-verify
Content: railway-verify=ae1a5bb859dbacdca189e6eefd819b202e2f207d33de26db973815a9140065bc
```

Cloudflare account and zone used:

- account id: `eb6eaa6ef4f4e9d85e3a7c08fba39196`
- zone: `starkmeta.net`
- zone id: `cb59e42e4d12cad2753ada01ea5552b5`

The DNS API token must have:

```text
Zone > DNS > Edit
Zone > Zone > Read
Zone Resources: Include > Specific zone > starkmeta.net
```

Do not paste the real token into this file. Put it in local `.env` as `CLOUDFLARE_API_TOKEN`, export it in the shell for one command, or store it in a secret manager.

Minimal Cloudflare API flow:

```bash
export CLOUDFLARE_API_TOKEN="..."
export CLOUDFLARE_ACCOUNT_ID="eb6eaa6ef4f4e9d85e3a7c08fba39196"
```

```bash
node <<'NODE'
const token = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const zoneName = "starkmeta.net";
const cnameTarget = "07ahikmp.up.railway.app";
const txtValue = "railway-verify=ae1a5bb859dbacdca189e6eefd819b202e2f207d33de26db973815a9140065bc";

async function cf(path, options = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const json = await res.json();
  if (!json.success) throw new Error(JSON.stringify(json.errors));
  return json.result;
}

const zones = await cf(`/zones?name=${zoneName}&account.id=${accountId}`);
const zoneId = zones[0].id;

await cf(`/zones/${zoneId}/dns_records`, {
  method: "POST",
  body: JSON.stringify({ type: "TXT", name: "_railway-verify", content: txtValue, ttl: 1 })
});

await cf(`/zones/${zoneId}/dns_records`, {
  method: "POST",
  body: JSON.stringify({ type: "CNAME", name: "@", content: cnameTarget, proxied: true, ttl: 1 })
});
NODE
```

If records may already exist, list and update them instead of blindly creating duplicates:

```bash
curl -s "https://api.cloudflare.com/client/v4/zones/<zone-id>/dns_records?per_page=100" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

Public DNS checks:

```bash
curl -s "https://cloudflare-dns.com/dns-query?name=starkmeta.net&type=A" \
  -H "accept: application/dns-json"

curl -s "https://cloudflare-dns.com/dns-query?name=_railway-verify.starkmeta.net&type=TXT" \
  -H "accept: application/dns-json"
```

Expected Railway status after DNS propagates:

```text
verified: true
certificateStatus: valid, after any temporary ISSUING state
targetPort: null
syncStatus: ACTIVE
```

If `https://starkmeta.net` returns Cloudflare `502` immediately after verification, first check Railway certificate status and wait a few minutes. If the certificate is already valid and the Railway subdomain works, recreate the Railway custom domain without a forced `targetPort`, update the Cloudflare CNAME to the new Railway target, keep Cloudflare proxy enabled, and retest.

Final Codex Workplace live check:

```bash
curl -I https://starkmeta.net/
curl -I https://starkmeta.net/blog/how-to-read-work-signal-in-one-sprint/
```

Both returned `HTTP/2 200` after the final custom-domain recreation.

## 10. Squidex Setup

Create the app first:

1. Go to `cloud.squidex.io`
2. Create app: `your-app-name`
3. Open `Settings -> Clients`
4. Create client: `your-app-name:default`
5. Copy the secret carefully

### Blog schema

Schema name:

- `blog-posts`

Fields used by this site:

- `title`
- `description`
- `pubDate`
- `heroImage`
- `author`
- `category`
- `tags`
- `referenceUrl`
- `featured`
- `article-text`

### Important compatibility note

For this project, `article-text` ended up being safer as a plain `String` field instead of Squidex `RichText`.

Why:

- the local blog content format did not import cleanly into Squidex RichText
- direct import returned `Invalid rich text`
- switching the field to string allowed seeding content immediately

If you want real Squidex RichText later, plan a proper transformer for the editor format first.

## 11. CMS Fallback Strategy

Keep local blog content in `src/data/blog.ts` even after CMS setup.

Reason:

- builds still succeed if Squidex is empty
- pages still render if CMS credentials break
- content can be seeded from local entries later

## 12. Seeding Blog Posts

Recommended approach:

1. Create the schema in Squidex.
2. Import local posts from `src/data/blog.ts`.
3. Publish them during import.
4. Confirm the content endpoint returns real items.

Verify:

```bash
curl -s https://cloud.squidex.io/api/content/<app>/blog-posts/
```

Or check directly in Squidex UI:

- app: `your-app-name`
- schema: `blog-posts`
- status: `Published`

## 13. Frontend QA Checklist

Before calling the site done, check:

- mobile header alignment
- menu button appearance
- logo width and wrapping
- button text contrast
- blog card spacing
- article meta spacing
- article content padding
- code blocks and long lines inside article overlays
- CTA copy that still sounds like builder placeholder text

## 14. Common Problems We Hit

### Railway CLI auth instability

Problem:

- `railway login` looked successful
- later commands still returned `Unauthorized`

Practical fix:

- use the Railway dashboard UI for custom domains if CLI keeps dropping auth

### Wrong Squidex credentials

Problem:

- `invalid_client`

Practical fix:

- verify exact `Client ID`
- verify secret character by character
- avoid copy/paste with mixed Latin and Cyrillic letters

### Empty Squidex app

Problem:

- auth worked, but content fetch returned `404` or empty data

Practical fix:

- make sure schemas exist before expecting content
- seed posts immediately after creating the schema

### Rich text import failure

Problem:

- Squidex rejected imported article content with `Invalid rich text`

Practical fix:

- use a plain string field for `article-text` unless you are prepared to transform into native Squidex rich-text format

### Cloudflare API token shape

Problem:

- token could read the zone but DNS record calls returned `Authentication error`
- `/user/tokens/verify` returned `Invalid API Token` for a token shape that still worked against some account/zone endpoints

Practical fix:

- test with a harmless DNS read first
- ensure the token has `Zone > DNS > Edit` and `Zone > Zone > Read`
- prefer creating a fresh Cloudflare token from the `Edit zone DNS` template if edited permissions do not apply cleanly
- never commit the token into launch docs or source files

### Cloudflare Web UI automation

Problem:

- browser automation could see existing Cloudflare tabs but lost the active tab/window or got stuck on dashboard state

Practical fix:

- use the Cloudflare API with a scoped token for DNS changes
- use the dashboard only for manual confirmation or if API access is unavailable

## 15. Recommended Final Verification

Before handoff:

1. `npm run build`
2. `npm run check`
3. open local homepage
4. open blog index
5. open at least one article page
6. confirm Railway URL returns `200`
7. confirm domain returns `200` once DNS is live
8. confirm Squidex contains published posts

## 16. Nice-to-Have Follow-Up

For future similar projects, it would be useful to add:

- a repeatable `seed` script for Squidex
- a `setup-domain.md` just for DNS and Railway domain steps
- a `content-model.md` for the Squidex schema contract
- a content copy pass to remove builder-like placeholder phrasing before launch
