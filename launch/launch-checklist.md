# Launch Checklist

Use this file as the shortest path to a live deploy. It is intentionally operational and assumes the site already exists.

## 1. Before You Touch Hosting

- Derive the domain from the project folder name
- Open `https://web.archive.org/web/20160328162852/{domain}/`
- For this project, check `https://web.archive.org/web/20160328162852/starkmeta.net/`
- Pull useful archived content, positioning, navigation, and product clues into the site
- Confirm local site opens on `http://127.0.0.1:4173`
- Run `npm run build`
- Run `npm run check`
- Make sure `.env` has the correct `SITE_URL`
- Keep real provider tokens only in `.env`, shell env, Railway variables, or a secret manager
- If the site uses Squidex, confirm the app, client, and content are already working

Minimum local secret names:

```env
FAL_KEY=
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
RAILWAY_TOKEN=
SQUIDEX_CLIENT_SECRET=
```

## 2. Git Readiness

- `git status` is clean or only includes changes you intend to ship
- repo is pushed to GitHub
- `main` contains the launch-ready version

Quick commands:

```bash
git status
git add .
git commit -m "Prepare launch"
git push origin main
```

## 3. Railway Readiness

- Railway project exists
- local folder is linked to the correct Railway project
- all env vars are present in Railway
- Railway service has already produced at least one successful deploy

Minimum Railway env:

```env
SITE_URL=https://yourdomain.com
SQUIDEX_URL=https://cloud.squidex.io
SQUIDEX_APP=your-app-name
SQUIDEX_CLIENT_ID=your-app-name:default
SQUIDEX_CLIENT_SECRET=your-secret
```

## 4. Railway Deploy Order

1. Push latest code to GitHub.
2. Trigger Railway deploy.
3. Wait for successful build.
4. Open the Railway subdomain first.
5. Only after that move to custom domain.

Check:

```bash
railway status
curl -I https://your-service.up.railway.app
```

For Codex Workplace:

```bash
railway status
railway up --service starkmeta.net --detach --verbose
railway variable set SITE_URL=https://starkmeta.net --service starkmeta.net --environment production --skip-deploys
```

## 5. Custom Domain Order

Do this only after the Railway subdomain works.

1. Add the root domain in Railway `Custom Domains`.
2. Copy Railway DNS records exactly.
3. Add them in Cloudflare.
4. Wait for propagation.
5. Confirm Railway says the domain is verified.
6. Verify apex and `www` if needed.

Codex Workplace records:

```text
CNAME @ -> 07ahikmp.up.railway.app
TXT _railway-verify -> railway-verify=ae1a5bb859dbacdca189e6eefd819b202e2f207d33de26db973815a9140065bc
```

Cloudflare API token requirements:

```text
Zone > DNS > Edit
Zone > Zone > Read
Zone Resources: Include > Specific zone > starkmeta.net
```

Checks:

```bash
curl -I https://yourdomain.com
curl -I https://www.yourdomain.com
```

Cloudflare DNS checks:

```bash
curl -s "https://cloudflare-dns.com/dns-query?name=starkmeta.net&type=A" \
  -H "accept: application/dns-json"

curl -s "https://cloudflare-dns.com/dns-query?name=_railway-verify.starkmeta.net&type=TXT" \
  -H "accept: application/dns-json"
```

Railway should eventually show:

```text
verified: true
targetPort: null
certificateStatus: valid
```

If the domain gives Cloudflare `502` right after DNS verification, wait for Railway certificate issuance and check that Cloudflare SSL/TLS mode is `Full`.

If Railway certificate is already valid and the Railway subdomain works, but the custom domain still returns Cloudflare/Railway `502`, recreate the Railway custom domain without a forced `targetPort`, update the Cloudflare CNAME to the new Railway target, keep Cloudflare proxy enabled, and retest.

## 6. Squidex Readiness

Before launch, confirm:

- Squidex app exists
- client credentials are valid
- schema `blog-posts` exists
- content endpoint returns published items

If using this site's content pattern:

- `article-text` should be treated as plain string content unless a real Squidex RichText transformer is already implemented

## 7. fal.ai Asset Readiness

Before final deploy, confirm:

- no more than 2-3 logo variants were generated
- the homepage has a generated hero background
- each blog post has at least 3 generated images
- each blog post has 1 cover image and at least 2 inline images
- generated prompt metadata is kept beside images in `public/assets/fal`
- hero and blog images were checked in browser for contrast and cropping

## 8. CTA Lead-Capture Requirement

Every conversion CTA must open a lead-capture form instead of linking to a generic page, blog index, or direct `mailto:` action.

Required behavior:

- This applies to all conversion CTAs in the header, hero, pricing, service, assessment, demo, contact, and final CTA sections.
- CTA clicks must open an accessible modal, drawer, or dedicated form page.
- The form must collect at least `name` and one contact method: `email` or `phone`.
- Add a short optional message/project-details field when it fits the CTA intent.
- Required fields must use visible labels, client-side validation, clear errors, keyboard navigation, and an explicit submit button.
- Do not collect data without a configured submission destination. Wire the form to the project's approved backend, CRM, email API, or form provider.
- Disable duplicate submission while the request is being sent and show a clear error message if delivery fails.
- After a successful submission, replace the form state with this exact English confirmation: **“Thank you! We have received your request and will contact you soon.”**
- The form must not claim success until the submission endpoint confirms receipt.
- Non-conversion navigation links such as Blog, Documentation, Privacy, and RSS are not CTAs and should continue to navigate normally.

QA checks:

- Click every conversion CTA on desktop and mobile.
- Confirm each CTA opens the correct form and preserves its context in a hidden `source` or `intent` field.
- Submit valid test data and verify it reaches the configured destination.
- Verify the exact English confirmation appears only after a successful response.
- Test invalid input, backend failure, repeated clicks, Escape-to-close, focus trapping, and keyboard-only submission.

## 9. Frontend Visual QA

Check these pages manually:

- home
- gateway
- docs
- pricing
- FAQ
- blog index
- one blog article
- contact
- terms
- privacy
- 404

Check these UI details:

- header alignment on mobile
- hamburger button spacing
- CTA contrast
- card spacing
- blog meta readability
- blog/article overflow
- code block overflow
- awkward builder-like copy

## 10. Final Go/No-Go Checks

Go only if all are true:

- local build passes
- local check passes
- Railway subdomain returns `200`
- main domain returns `200`
- Railway custom domain is verified
- Cloudflare DNS contains the required CNAME and TXT
- one article page works
- blog index works
- contact/docs pages work
- no obviously broken contrast or overflow issues remain

## 11. Fast Rollback Mindset

If something looks wrong after deploy:

1. Check the Railway subdomain first.
2. Compare live site against local.
3. Check uncommitted local changes.
4. Check Railway env vars.
5. Check DNS separately from app deploy.

Most important lesson:

- app deploy, CMS setup, and DNS cutover are three different layers
- do not debug them as if they are the same issue
