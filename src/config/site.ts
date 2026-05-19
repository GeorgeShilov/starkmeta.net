export const site = {
  name: "StarkMeta",
  domain: "starkmeta.net",
  url: import.meta.env.SITE_URL || "https://starkmeta.net",
  email: "hello@starkmeta.net",
  description:
    "StarkMeta is the infrastructure layer for metaverse worlds and blockchain realms, powered by StarkNet. Build, explore, and own digital experiences at scale.",
  launchContext: [
    "Build persistent metaverse worlds with on-chain ownership and provable digital real estate.",
    "Leverage StarkNet infrastructure for fast, low-cost, and secure blockchain transactions at scale.",
    "Empower users with portable digital identity and verifiable assets across interconnected realms."
  ]
};

export const navItems = [
  { label: "Command OS", href: "/gateway/" },
  { label: "Docs", href: "/docs/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact/" }
];
