# Content Seed Guide

This file explains the easiest way to populate a new site with initial blog content while keeping the site build-safe.

## Goal

Start with local fallback content, then seed the same articles into Squidex once the app and schema are ready.

## 1. Keep Local Fallback First

Store starter posts in:

- `src/data/blog.ts`

Why:

- the blog works before CMS is ready
- the site still builds if Squidex is empty
- the same entries can be imported into Squidex later

## 2. Use Archived Domain Content First

Before inventing starter content, inspect the archived domain.

Domain rule:

- take the domain from the project folder name
- for this project, use `atenwallet.com`

Wayback URL pattern:

```text
https://web.archive.org/web/20160328162852/{domain}/
```

For this project:

```text
https://web.archive.org/web/20160328162852/atenwallet.com/
```

Use the archived page as the first content source for:

- brand and product description
- terms that appeared in old headings or navigation
- old feature areas that can become new pages or sections
- support/contact/legal clues
- blog seed topics that fit the domain's real history

If the snapshot is missing or unusable, document that briefly and continue with a conservative fallback concept that still fits the domain name.

## 3. Recommended Blog Schema

Use Squidex schema:

- `blog-posts`

Fields:

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

Important for this project style:

- use `article-text` as `String`
- store rendered article HTML there if you are seeding from local rich text

## 4. Seed Order

1. Inspect the archived domain snapshot.
2. Add fallback posts locally using archived context where useful.
3. Confirm local blog renders.
4. Create Squidex app.
5. Create Squidex client.
6. Create `blog-posts` schema.
7. Seed local posts into Squidex.
8. Publish them.
9. Confirm the API returns them.

## 5. What To Seed From

Source file:

- `src/data/blog.ts`

Typical local shape:

- title
- description
- pubDate
- author
- category
- tags
- featured
- heroImage
- referenceUrl
- `richText`

## 6. Conversion Rule

If local content uses custom rich-text JSON:

- convert it to HTML before sending to Squidex
- store that HTML string in `article-text`

Why:

- direct import into Squidex RichText may fail
- HTML string content is simpler and predictable for initial launch

## 7. Minimal Verification

After seeding, confirm:

- Squidex app shows published entries
- content endpoint returns `total > 0`
- local blog page loads
- article routes load
- the page source label changes from fallback logic if your UI shows source state

## 8. Recommended Seed Checklist

- first post is marked `featured`
- dates are valid ISO strings
- hero image paths are real
- tags are not empty on every post
- article body is readable HTML
- no article body overflows the page layout

## 9. Practical Lessons From This Project

- seed only a few strong posts first
- three articles are enough to make the blog feel real
- keep titles human and specific
- avoid leaving builder-style filler copy in article CTA blocks
- review blog cards and article layout right after seed, because real content exposes overflow issues fast
