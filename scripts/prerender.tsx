import { readFileSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import Site from "@/site";
import { siteDescription, siteName, siteTitle, siteUrl } from "@/lib/site";

const canonical = siteUrl.href;
const shareImage = new URL("images/share.jpg", siteUrl).href;
const head = renderToStaticMarkup(
  <>
    <title>{`${siteTitle} | ${siteName}`}</title>
    <meta name="description" content={siteDescription} />
    <link rel="canonical" href={canonical} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta property="og:title" content={siteTitle} />
    <meta property="og:description" content={siteDescription} />
    <meta property="og:site_name" content={siteName} />
    <meta property="og:locale" content="ru_BY" />
    <meta property="og:image" content={shareImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Графитовый автомобиль" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={siteTitle} />
    <meta name="twitter:description" content={siteDescription} />
    <meta name="twitter:image" content={shareImage} />
  </>,
);

const file = "dist/index.html";
const title = `<title>${siteName}</title>`;
const root = '<div id="root"></div>';
const template = readFileSync(file, "utf8");
if (!template.includes(title) || !template.includes(root)) {
  throw new Error("Prerender template is missing the title or application root");
}

writeFileSync(file, template
  .replace(title, () => head)
  .replace(root, () => `<div id="root">${renderToString(<Site />)}</div>`));
writeFileSync("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${new URL("sitemap.xml", siteUrl).href}\n`);
writeFileSync("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${canonical}</loc></url>\n</urlset>\n`);
if (!/(^|\.)github\.io$/.test(siteUrl.hostname)) {
  writeFileSync("dist/CNAME", `${siteUrl.hostname}\n`);
}
