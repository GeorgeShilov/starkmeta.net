export const site = {
  name: "StarkMeta",
  domain: "starkmeta.net",
  url: import.meta.env.SITE_URL || "https://starkmeta.net",
  email: "hello@starkmeta.net",
  description:
    "StarkMeta is a metaverse studio building Unreal Engine-based P2E NFT games, dynamic digital worlds, and collectible NFT experiences. Play, collect, and own.",
  launchContext: [
    "Build immersive P2E NFT games on Unreal Engine with dynamic cities, racing, and open-world mechanics.",
    "Power a collectible NFT economy where in-game items can be traded on marketplaces like OpenSea.",
    "Create persistent metaverse real estate and character collections with true digital ownership."
  ]
};

export const navItems = [
  { label: "Games", href: "/games/" },
  { label: "NFT Collections", href: "/nft/" },
  { label: "Blog", href: "/blog/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Contact", href: "/contact/" }
];
