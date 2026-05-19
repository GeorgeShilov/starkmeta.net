import { existsSync, readFileSync } from "node:fs";
import { fallbackPosts } from "../src/data/blog.ts";

type FieldType = "String" | "DateTime" | "Boolean";

type SchemaField = {
  name: string;
  partitioning: "invariant";
  properties: {
    fieldType: FieldType;
    isRequired?: boolean;
    editor?: string;
  };
};

function loadEnv() {
  if (!existsSync(".env")) return;

  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;

    const key = trimmed.slice(0, index);
    const value = trimmed.slice(index + 1);
    process.env[key] ||= value;
  }
}

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, "");
}

loadEnv();

const squidexUrl = normalizeBaseUrl(requiredEnv("SQUIDEX_URL"));
const app = requiredEnv("SQUIDEX_APP");
const clientId = requiredEnv("SQUIDEX_CLIENT_ID");
const clientSecret = requiredEnv("SQUIDEX_CLIENT_SECRET");
const schema = "blog-posts";

async function getToken() {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "squidex-api"
  });

  const response = await fetch(`${squidexUrl}/identity-server/connect/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body
  });

  if (!response.ok) {
    throw new Error(`Token request failed with ${response.status}: ${await response.text()}`);
  }

  return (await response.json()).access_token as string;
}

const token = await getToken();

async function request(path: string, init: RequestInit = {}) {
  const response = await fetch(`${squidexUrl}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...(init.headers || {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${init.method || "GET"} ${path} failed with ${response.status}: ${text}`);
  }

  if (response.status === 204) return undefined;
  const text = await response.text();
  return text ? JSON.parse(text) : undefined;
}

async function requestOptional(path: string, init: RequestInit = {}) {
  const response = await fetch(`${squidexUrl}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...(init.headers || {})
    }
  });

  if (response.status === 404) return undefined;
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${init.method || "GET"} ${path} failed with ${response.status}: ${text}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : undefined;
}

async function deleteOptional(path: string) {
  const response = await fetch(`${squidexUrl}${path}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json"
    }
  });

  if (response.status === 404 || response.status === 204) return;
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`DELETE ${path} failed with ${response.status}: ${text}`);
  }
}

const fields: SchemaField[] = [
  { name: "slug", partitioning: "invariant", properties: { fieldType: "String", isRequired: true } },
  { name: "title", partitioning: "invariant", properties: { fieldType: "String", isRequired: true } },
  { name: "description", partitioning: "invariant", properties: { fieldType: "String", isRequired: true, editor: "TextArea" } },
  { name: "pubDate", partitioning: "invariant", properties: { fieldType: "DateTime", isRequired: true } },
  { name: "heroImage", partitioning: "invariant", properties: { fieldType: "String" } },
  { name: "inlineImages", partitioning: "invariant", properties: { fieldType: "String" } },
  { name: "author", partitioning: "invariant", properties: { fieldType: "String" } },
  { name: "category", partitioning: "invariant", properties: { fieldType: "String" } },
  { name: "tags", partitioning: "invariant", properties: { fieldType: "String" } },
  { name: "referenceUrl", partitioning: "invariant", properties: { fieldType: "String" } },
  { name: "featured", partitioning: "invariant", properties: { fieldType: "Boolean" } },
  { name: "article-text", partitioning: "invariant", properties: { fieldType: "String", editor: "Html" } }
];

async function ensureSchema() {
  const existing = await requestOptional(`/api/apps/${app}/schemas/${schema}`);
  if (existing) {
    const tagsField = existing.fields?.find((field: { name: string }) => field.name === "tags");
    const inlineImagesField = existing.fields?.find((field: { name: string }) => field.name === "inlineImages");
    if (tagsField?.properties?.fieldType === "Array") {
      await deleteOptional(`/api/apps/${app}/schemas/${schema}`);
      console.log(`Schema ${schema} deleted to replace tags Array with String`);
    } else if (!inlineImagesField) {
      await deleteOptional(`/api/apps/${app}/schemas/${schema}`);
      console.log(`Schema ${schema} deleted to add inlineImages`);
    } else {
    console.log(`Schema ${schema} already exists`);
    return;
    }
  }

  await request(`/api/apps/${app}/schemas`, {
    method: "POST",
    body: JSON.stringify({
      name: schema,
      fields,
      isPublished: true
    })
  });

  try {
    await request(`/api/apps/${app}/schemas/${schema}/publish`, { method: "PUT" });
  } catch {
    await request(`/api/apps/${app}/schemas/${schema}/publish`, { method: "POST" });
  }

  console.log(`Schema ${schema} created and published`);
}

async function getExistingContent() {
  const result = await request(`/api/content/${app}/${schema}/?$top=200`, {
    headers: { "X-Unpublished": "1" }
  });
  const items = (result?.items || []) as Array<{ id: string; data?: { slug?: { iv?: string } } }>;
  return new Map(
    items
      .map((item) => [item.data?.slug?.iv, item.id] as const)
      .filter((entry): entry is [string, string] => Boolean(entry[0] && entry[1]))
  );
}

function toSquidexDate(value: string) {
  return value.includes("T") ? value : `${value}T00:00:00.000Z`;
}

async function publishPost(id: string) {
  const attempts: Array<{ method: string; path: string; body?: unknown }> = [
    {
      method: "PUT",
      path: `/api/content/${app}/${schema}/${id}/status`,
      body: { status: "Published" }
    },
    {
      method: "POST",
      path: `/api/content/${app}/${schema}/${id}/status`,
      body: { status: "Published" }
    },
    {
      method: "PUT",
      path: `/api/content/${app}/${schema}/${id}/status/Published`
    },
    {
      method: "POST",
      path: `/api/content/${app}/${schema}/${id}/status/Published`
    },
    {
      method: "POST",
      path: `/api/content/${app}/${schema}/${id}/publish`
    },
    {
      method: "PUT",
      path: `/api/content/${app}/${schema}/${id}/publish`
    }
  ];

  const errors: string[] = [];

  for (const attempt of attempts) {
    const response = await fetch(`${squidexUrl}${attempt.path}`, {
      method: attempt.method,
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json"
      },
      body: attempt.body ? JSON.stringify(attempt.body) : undefined
    });

    if (response.ok || response.status === 204) return;

    const text = await response.text();
    if (response.status === 400 && text.includes("Published")) return;
    errors.push(`${attempt.method} ${attempt.path} -> ${response.status}: ${text}`);
  }

  throw new Error(`Could not publish content ${id}:\n${errors.join("\n")}`);
}

async function createPost(post: (typeof fallbackPosts)[number]) {
  const created = await request(`/api/content/${app}/${schema}/`, {
    method: "POST",
    body: JSON.stringify({
      slug: { iv: post.slug },
      title: { iv: post.title },
      description: { iv: post.description },
      pubDate: { iv: toSquidexDate(post.pubDate) },
      heroImage: { iv: post.heroImage },
      inlineImages: { iv: post.inlineImages.join(", ") },
      author: { iv: post.author },
      category: { iv: post.category },
        tags: { iv: post.tags.join(", ") },
      referenceUrl: { iv: post.referenceUrl },
      featured: { iv: Boolean(post.featured) },
      "article-text": { iv: post.articleText.trim() }
    })
  });

  if (created?.id) {
    await publishPost(created.id);
  }
}

await ensureSchema();
const existingContent = await getExistingContent();

let created = 0;
let skipped = 0;

for (const post of fallbackPosts) {
  const existingId = existingContent.get(post.slug);
  if (existingId) {
    await publishPost(existingId);
    skipped += 1;
    continue;
  }

  await createPost(post);
  created += 1;
}

const finalContent = await request(`/api/content/${app}/${schema}/?$top=1`);

console.log(
  JSON.stringify(
    {
      app,
      schema,
      created,
      skipped,
      total: finalContent?.total || 0
    },
    null,
    2
  )
);
