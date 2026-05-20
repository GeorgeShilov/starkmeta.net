import { fallbackPosts, type BlogPost } from "@/data/blog";

type SquidexField<T> = { iv?: T };

type SquidexItem = {
  id: string;
  data: {
    title?: SquidexField<string>;
    description?: SquidexField<string>;
    pubDate?: SquidexField<string>;
    heroImage?: SquidexField<string>;
    inlineImages?: SquidexField<string[] | string>;
    author?: SquidexField<string>;
    category?: SquidexField<string>;
    tags?: SquidexField<string[] | string>;
    referenceUrl?: SquidexField<string>;
    featured?: SquidexField<boolean>;
    "article-text"?: SquidexField<string>;
    slug?: SquidexField<string>;
  };
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseTags(value: string[] | string | undefined) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function hasSquidexConfig() {
  return Boolean(
    import.meta.env.SQUIDEX_URL &&
      import.meta.env.SQUIDEX_APP &&
      import.meta.env.SQUIDEX_CLIENT_ID &&
      import.meta.env.SQUIDEX_CLIENT_SECRET
  );
}

async function getToken() {
  const url = `${import.meta.env.SQUIDEX_URL}/identity-server/connect/token`;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: import.meta.env.SQUIDEX_CLIENT_ID,
    client_secret: import.meta.env.SQUIDEX_CLIENT_SECRET,
    scope: "squidex-api"
  });

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body
  });

  if (!response.ok) throw new Error(`Squidex token failed: ${response.status}`);
  const json = await response.json();
  return json.access_token as string;
}

function mapItem(item: SquidexItem): BlogPost {
  const title = item.data.title?.iv || "Untitled";
  return {
    slug: item.data.slug?.iv || slugify(title),
    title,
    description: item.data.description?.iv || "",
    pubDate: item.data.pubDate?.iv || new Date().toISOString(),
    heroImage: item.data.heroImage?.iv || "/assets/archive-grid.svg",
    inlineImages: parseTags(item.data.inlineImages?.iv),
    author: item.data.author?.iv || "Codex Workplace Studio",
    category: item.data.category?.iv || "Research",
    tags: parseTags(item.data.tags?.iv),
    referenceUrl: item.data.referenceUrl?.iv,
    featured: item.data.featured?.iv,
    articleText: item.data["article-text"]?.iv || ""
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!hasSquidexConfig()) return fallbackPosts;

  try {
    const token = await getToken();
    const endpoint = `${import.meta.env.SQUIDEX_URL}/api/content/${import.meta.env.SQUIDEX_APP}/blog-posts/`;
    const response = await fetch(endpoint, {
      headers: { authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error(`Squidex content failed: ${response.status}`);
    const json = await response.json();
    const posts = (json.items || []).map(mapItem);
    return posts.length ? posts : fallbackPosts;
  } catch (error) {
    console.warn(error);
    return fallbackPosts;
  }
}

export async function getBlogPost(slug: string) {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug);
}
