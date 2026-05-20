export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  author: string;
  category: string;
  tags: string[];
  featured?: boolean;
  heroImage: string;
  inlineImages: string[];
  referenceUrl?: string;
  articleText: string;
};

export const fallbackPosts: BlogPost[] = [
  {
    slug: "designing-p2e-racing-games-in-unreal-engine",
    title: "Designing P2E racing games in Unreal Engine",
    description:
      "How StarkMeta builds speed-action racing experiences with NFT rewards, dynamic cities, and Unreal Engine visuals.",
    pubDate: "2026-05-16",
    author: "StarkMeta Team",
    category: "Game Dev",
    tags: ["Unreal Engine", "P2E", "Racing"],
    featured: true,
    heroImage: "/assets/archive-grid.svg",
    inlineImages: ["/assets/identity-shield.svg", "/assets/wallet-ledger.svg"],
    articleText: `
      <p>A racing game only feels alive when the world around it moves. StarkMeta builds speed-action racing titles on Unreal Engine where dynamic cities, animated backgrounds, and 100 types of personality-filled supercars create genuine immersion.</p>
      <p>The play-to-earn layer is not an afterthought. Every race, drift, and jump can yield collectible NFTs that players own outright. These items are not locked to our servers. They live on-chain and can be auctioned or traded on marketplaces like OpenSea.</p>
      <p>For players, this means skill translates to real digital ownership. For the studio, it means building an economy that survives beyond any single game update or platform policy change.</p>
    `
  },
  {
    slug: "inside-the-ttmc-nft-collection",
    title: "Inside the TTMC NFT collection",
    description:
      "A look at the Tycoon Tiger MegaYacht Club: 10,000 unique tiger characters blending hip-hop, cyborg, and 200 hand-crafted traits.",
    pubDate: "2026-05-15",
    author: "StarkMeta Team",
    category: "NFTs",
    tags: ["TTMC", "NFT Collection", "Metaverse"],
    heroImage: "/assets/archive-grid.svg",
    inlineImages: ["/assets/identity-shield.svg", "/assets/wallet-ledger.svg"],
    articleText: `
      <p>The Tycoon Tiger MegaYacht Club is StarkMeta's flagship character collection. Ten thousand unique tigers, each assembled from over two hundred possible traits ranging from classic hip-hop style to full cyborg augmentation. Every tiger carries on-chain metadata that proves its rarity and origin.</p>
      <p>TTMC holders are not just collectors. They become part of the studio's creative loop: early access to new game builds, input on world design, and whitelist spots for future drops. The collection is designed as a membership layer, not a static JPEG set.</p>
      <p>Rarity is transparent. Provenance is verifiable. And because the contract is standard ERC-721, every tiger can be traded, collateralized, or imported into any compatible metaverse world.</p>
    `
  },
  {
    slug: "metaverse-real-estate-and-city-of-tycoon-3d",
    title: "Metaverse real estate and City of Tycoon 3D",
    description:
      "How StarkMeta uses Unreal Engine to build persistent metaverse real estate where players own land, build assets, and trade property.",
    pubDate: "2026-05-14",
    author: "StarkMeta Team",
    category: "Real Estate",
    tags: ["Metaverse", "Real Estate", "Unreal Engine"],
    heroImage: "/assets/archive-grid.svg",
    inlineImages: ["/assets/identity-shield.svg", "/assets/wallet-ledger.svg"],
    articleText: `
      <p>Land in the metaverse should feel as tangible as land in the physical world. City of Tycoon 3D is StarkMeta's Unreal Engine-based real estate layer where parcels are ownable, developable, and tradable.</p>
      <p>Each plot is minted as an NFT with programmable zoning and development rights. Owners can construct structures, lease space to other players, or hold parcels as speculative assets. The graphics engine renders these properties in full 3D with dynamic lighting and day-night cycles.</p>
      <p>The economy is built around scarcity and utility. Prime locations near transit hubs or event arenas command higher value. Development fees and lease income flow back to landowners in SMETA tokens. This is not a map with pins. It is a city that breathes.</p>
    `
  }
];
