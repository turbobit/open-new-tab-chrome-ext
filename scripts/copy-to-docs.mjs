#!/usr/bin/env node
import { rmSync, mkdirSync, cpSync, existsSync, readdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { cwd } from "node:process";
import { execSync } from "node:child_process";

const rootDir = cwd();
const distDir = resolve(rootDir, "dist");
const extensionDir = resolve(distDir, "extension");
const docsDir = resolve(rootDir, "docs");

function removePath(path) {
  rmSync(path, { recursive: true, force: true });
}

function assertExists(path, label) {
  if (!existsSync(path)) {
    throw new Error(`Missing ${label}: ${path}`);
  }
}

function parseRepoFromGitUrl(url) {
  if (!url) return null;
  // git@github.com:owner/repo.git or https://github.com/owner/repo.git
  const sshMatch = url.match(/git@github.com:([^/]+)\/([^.]+)(\.git)?/);
  if (sshMatch) return `${sshMatch[1]}/${sshMatch[2]}`;
  const httpsMatch = url.match(/github\.com\/([^/]+)\/([^.\/]+)(\.git)?/);
  if (httpsMatch) return `${httpsMatch[1]}/${httpsMatch[2]}`;
  return null;
}

function getRepoOwnerAndName() {
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY;
  try {
    const url = execSync("git config --get remote.origin.url", { encoding: "utf8" }).trim();
    return parseRepoFromGitUrl(url);
  } catch (e) {
    return null;
  }
}

function createReleaseLinks(version, repo) {
  if (!repo) {
    return {
      latest: "https://github.com/",
      tag: "https://github.com/"
    };
  }
  const latest = `https://github.com/${repo}/releases/latest`;
  const tag = version ? `https://github.com/${repo}/releases/tag/${version}` : latest;
  return { latest, tag };
}

function copyDistToDocs() {
  assertExists(distDir, "dist directory (run npm run build first)");
  assertExists(extensionDir, "dist/extension directory (run npm run build first)");

  // clean docs
  removePath(docsDir);
  mkdirSync(docsDir, { recursive: true });

  // copy extension files into docs root
  cpSync(extensionDir, docsDir, { recursive: true });

  // read version from build-meta.json if present
  let version = null;
  try {
    const meta = JSON.parse(readFileSync(join(distDir, "build-meta.json"), "utf8"));
    version = meta.version || null;
  } catch (e) {
    // ignore
  }

  // determine repo
  const repo = getRepoOwnerAndName();
  const links = createReleaseLinks(version, repo);

  // create download page that points to GitHub Releases (do NOT copy zip into docs)
  const downloadHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0;url=${links.tag}">
    <title>Download - Redirecting to Releases</title>
  </head>
  <body>
    <p>리디렉션 중입니다. 또는 <a href="${links.tag}">여기</a>를 클릭하세요.</p>
    <p>Latest releases: <a href="${links.latest}">${links.latest}</a></p>
  </body>
</html>
`;
  writeFileSync(join(docsDir, "download.html"), downloadHtml, "utf8");
  writeFileSync(join(docsDir, "RELEASES_LINK.txt"), links.tag + "\n", "utf8");
  // create index.html to avoid 404 on root URL; index redirects to download.html
  const indexHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0;url=./download.html">
    <title>Redirecting…</title>
  </head>
  <body>
    <p>리디렉트 중입니다. <a href="./download.html">여기</a>를 클릭하세요.</p>
  </body>
</html>
`;
  writeFileSync(join(docsDir, "index.html"), indexHtml, "utf8");

  console.log("Copied dist/extension -> docs/");
  console.log("Created docs/download.html -> points to:", links.tag);
  console.log("Created docs/index.html -> redirects to download.html");
}

function cleanDocs() {
  removePath(docsDir);
  console.log("Removed docs/");
}

if (process.argv.includes("--clean")) {
  cleanDocs();
} else {
  try {
    copyDistToDocs();
  } catch (err) {
    console.error("Failed to copy to docs:", err);
    process.exit(1);
  }
}

