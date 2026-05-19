import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "dist");
const port = Number(process.env.PORT || 3000);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function resolvePath(url) {
  const pathname = decodeURIComponent(new URL(url, "http://localhost").pathname);
  const clean = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const direct = join(root, clean);
  const index = join(root, clean, "index.html");

  if (existsSync(direct) && statSync(direct).isFile()) return direct;
  if (existsSync(index)) return index;
  return join(root, "404.html");
}

createServer((request, response) => {
  const file = resolvePath(request.url || "/");
  const status = file.endsWith("404.html") && !request.url?.includes("404") ? 404 : 200;
  response.writeHead(status, {
    "content-type": types[extname(file)] || "application/octet-stream",
    "cache-control": extname(file) === ".html" ? "no-cache" : "public, max-age=31536000, immutable"
  });
  createReadStream(file).pipe(response);
}).listen(port, "0.0.0.0", () => {
  console.log(`Codex Workplace site listening on ${port}`);
});
