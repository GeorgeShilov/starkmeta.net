import { mkdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const apiKey = process.env.FAL_KEY;
const root = new URL("../public/assets/fal/", import.meta.url);

if (!apiKey) {
  throw new Error("FAL_KEY is required");
}

const assets = [
  {
    name: "logo-1",
    size: "square_hd",
    prompt:
      "Minimal SaaS logo mark for Codex Workplace, sharp lightning bolt forming subtle letters TFC, premium B2B software brand, flat vector-like mark, high contrast, electric cyan and deep navy, centered on plain white background, no mockup, no 3d, no tiny text"
  },
  {
    name: "logo-2",
    size: "square_hd",
    prompt:
      "Modern technology logo for Codex Workplace, abstract speed signal and funnel control symbol, clean geometric icon, black navy and bright amber accent, flat vector-like, centered, plain white background, no extra words"
  },
  {
    name: "logo-3",
    size: "square_hd",
    prompt:
      "Premium SaaS logo symbol for Codex Workplace, compact monogram TFC with flash motion cut, sophisticated fintech-style geometry, teal, white, graphite, crisp edges, centered, flat vector-like, no text artifacts"
  },
  {
    name: "hero-background",
    size: "landscape_16_9",
    prompt:
      "Hero background for Codex Workplace, AI AI work launch command center for SaaS growth teams, elegant product dashboard environment, live signal streams, campaign flow map, conversion panels, premium modern SaaS website visual, deep navy, cyan, amber, realistic UI surfaces, soft studio lighting, no readable text"
  },
  {
    name: "blog-launch-cover",
    size: "landscape_16_9",
    prompt:
      "Editorial blog cover image for a SaaS launch sprint, Codex Workplace brand style, product launch command desk, timeline cards, deployment signal, modern B2B SaaS illustration, deep navy with cyan and amber highlights, no readable text"
  },
  {
    name: "blog-launch-inline-1",
    size: "landscape_4_3",
    prompt:
      "Inline blog image showing a SaaS launch workflow from brief to domain to deploy, clean UI process diagram style, premium Codex Workplace brand, no readable text, navy cyan amber palette"
  },
  {
    name: "blog-launch-inline-2",
    size: "landscape_4_3",
    prompt:
      "Inline blog image showing a deployment stack with Cloudflare edge and Railway backend, abstract infrastructure dashboard, premium SaaS editorial style, no logos, no readable text"
  },
  {
    name: "blog-visuals-cover",
    size: "landscape_16_9",
    prompt:
      "Editorial blog cover for AI generated SaaS visuals, brand system board with logo variants, hero image, blog covers, modern creative operations dashboard, Codex Workplace colors, no readable text"
  },
  {
    name: "blog-visuals-inline-1",
    size: "landscape_4_3",
    prompt:
      "Inline image showing two or three logo variants being compared in a clean brand review interface, premium B2B SaaS style, no readable text"
  },
  {
    name: "blog-visuals-inline-2",
    size: "landscape_4_3",
    prompt:
      "Inline image showing blog image generation assets arranged as cover and inline visuals, modern editorial SaaS content system, no readable text"
  },
  {
    name: "blog-stack-cover",
    size: "landscape_16_9",
    prompt:
      "Editorial blog cover for Cloudflare and Railway launch stack, edge network flowing into backend service blocks, modern infrastructure visualization, premium SaaS look, no vendor logos, no readable text"
  },
  {
    name: "blog-stack-inline-1",
    size: "landscape_4_3",
    prompt:
      "Inline image of DNS routing and CDN edge nodes for a newly bought SaaS domain, clean technical diagram look, no readable text, navy cyan amber"
  },
  {
    name: "blog-stack-inline-2",
    size: "landscape_4_3",
    prompt:
      "Inline image of API service, database, and frontend deployment blocks connected in a simple SaaS launch architecture, no readable text"
  }
];

async function generate(asset) {
  const response = await fetch("https://fal.run/fal-ai/flux/schnell", {
    method: "POST",
    headers: {
      Authorization: `Key ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: asset.prompt,
      image_size: asset.size,
      num_images: 1,
      num_inference_steps: 4,
      guidance_scale: 3.5,
      enable_safety_checker: true,
      output_format: "png",
      acceleration: "regular"
    })
  });

  if (!response.ok) {
    throw new Error(`${asset.name} failed: ${response.status} ${await response.text()}`);
  }

  const result = await response.json();
  const image = result.images?.[0];
  if (!image?.url) throw new Error(`${asset.name} returned no image URL`);

  const imageResponse = await fetch(image.url);
  if (!imageResponse.ok) throw new Error(`${asset.name} download failed: ${imageResponse.status}`);

  const fileName = `${asset.name}.png`;
  const output = join(root.pathname, fileName);
  await writeFile(output, Buffer.from(await imageResponse.arrayBuffer()));
  await writeFile(
    join(root.pathname, `${asset.name}.prompt.json`),
    JSON.stringify({ ...asset, model: "fal-ai/flux/schnell", result: { seed: result.seed } }, null, 2)
  );
  console.log(`${basename(output)} <- ${image.url}`);
}

await mkdir(root, { recursive: true });

for (const asset of assets) {
  await generate(asset);
}
