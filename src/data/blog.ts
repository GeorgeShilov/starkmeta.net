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
    slug: "building-persistent-worlds-on-starknet",
    title: "Building persistent worlds on StarkNet",
    description:
      "How StarkMeta uses StarkNet rollups to power scalable, persistent metaverse worlds with on-chain ownership.",
    pubDate: "2026-05-16",
    author: "StarkMeta Team",
    category: "Infrastructure",
    tags: ["StarkNet", "Metaverse", "Layer 2"],
    featured: true,
    heroImage: "/assets/archive-grid.svg",
    inlineImages: ["/assets/identity-shield.svg", "/assets/wallet-ledger.svg"],
    articleText: `
      <p>The metaverse cannot exist as a series of disconnected islands. For digital worlds to feel real, they must be persistent, interoperable, and owned by the people who inhabit them. StarkMeta builds on StarkNet to deliver exactly that: a Layer 2 foundation where land, identity, and assets live on-chain with negligible cost and cryptographic certainty.</p>
      <p>StarkNet's validity rollups give us the throughput to support millions of concurrent users without congesting Ethereum mainnet. Every plot of digital real estate, every avatar customization, and every in-world transaction is settled on a zk-rollup that inherits Ethereum's security while operating at a fraction of the cost.</p>
      <p>For developers, this means you can build immersive experiences without worrying about gas spikes or throughput ceilings. For users, it means true ownership: your assets are provably yours, portable across realms, and immune to platform shutdowns.</p>
    `
  },
  {
    slug: "digital-identity-and-verifiable-avatars",
    title: "Digital identity and verifiable avatars",
    description:
      "Why portable identity matters in the open metaverse and how StarkMeta makes avatars ownable, verifiable, and interoperable.",
    pubDate: "2026-05-15",
    author: "StarkMeta Team",
    category: "Identity",
    tags: ["Digital Identity", "Avatars", "Blockchain"],
    heroImage: "/assets/archive-grid.svg",
    inlineImages: ["/assets/identity-shield.svg", "/assets/wallet-ledger.svg"],
    articleText: `
      <p>In the physical world, your identity travels with you. In most digital worlds today, it does not. Each platform demands a new account, a new avatar, and a new reputation score. StarkMeta treats identity as infrastructure: one verifiable profile, portable across every realm in the ecosystem.</p>
      <p>Our identity layer binds avatar metadata, reputation proofs, and credential attestations to a StarkNet address. This gives users a single sign-on for the metaverse and gives builders a trust layer they can rely on for gating, governance, and commerce.</p>
      <p>The result is an open standard for who you are online. No more locked-in profiles. No more starting from zero on every new world. Just one identity, owned by you, verifiable by anyone.</p>
    `
  },
  {
    slug: "on-chain-economies-for-digital-realms",
    title: "On-chain economies for digital realms",
    description:
      "A practical look at how StarkMeta enables creator economies, land markets, and in-world commerce using Cairo smart contracts.",
    pubDate: "2026-05-14",
    author: "StarkMeta Team",
    category: "Economy",
    tags: ["StarkNet", "Creator Economy", "Smart Contracts"],
    heroImage: "/assets/archive-grid.svg",
    inlineImages: ["/assets/identity-shield.svg", "/assets/wallet-ledger.svg"],
    articleText: `
      <p>Economies are what make worlds feel alive. StarkMeta provides the smart contract primitives for land sales, creator royalties, and in-world marketplaces, all written in Cairo and deployed on StarkNet. This gives realm builders a turnkey economic layer they can customize without rebuilding from scratch.</p>
      <p>Land parcels are represented as NFTs with programmable zoning, lease terms, and development rights. Creators can mint wearables, tools, and experiences as tradable assets with embedded royalty logic. And because everything settles on a validity rollup, transaction fees stay low enough for micro-payments and high-frequency trading.</p>
      <p>The most important design choice is composability. Every contract is designed to be called by other contracts, which means economies can interact across realms. A sword forged in one world can be wielded in another. A currency earned in a game can be spent in a gallery. That is the promise of an open metaverse, and StarkMeta is building the rails.</p>
    `
  }
];
