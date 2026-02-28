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
  // create informative index.html (not a redirect) with basic usage and version info
  let manifest = null;
  try {
    manifest = JSON.parse(readFileSync(join(rootDir, "manifest.json"), "utf8"));
  } catch (e) {
    // fallback to extension manifest if present
    try {
      manifest = JSON.parse(readFileSync(join(extensionDir, "manifest.json"), "utf8"));
    } catch (e2) {
      manifest = null;
    }
  }

  const appName = manifest?.name || "Extension";
  const appDesc = manifest?.description || "Chrome 확장 기능";
  const defaultVersion = version || manifest?.version || "unknown";
  const generatedAt = new Date().toISOString();

  const indexHtml = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${appName} — 다운로드 및 설명</title>
    <style>
      body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; max-width: 780px; margin: 48px auto; line-height:1.5; padding: 0 16px; color:#111 }
      header h1 { margin:0 0 8px; font-size:28px }
      .meta { color:#555; margin-bottom:18px }
      .card { border:1px solid #e6e6e6; padding:16px; border-radius:8px; background:#fff }
      a.button { display:inline-block; margin-top:8px; padding:8px 12px; background:#0366d6; color:#fff; text-decoration:none; border-radius:6px }
      footer { margin-top:28px; color:#666; font-size:13px }
    </style>
  </head>
  <body>
    <header>
      <h1>${appName}</h1>
      <div class="meta">버전: <strong>${defaultVersion}</strong> · 업데이트: <time>${generatedAt}</time></div>
    </header>

    <section class="card">
      <h2>설명</h2>
      <p>${appDesc}</p>

      <h3>다운로드</h3>
      <p>최신 릴리스에서 설치 파일을 받을 수 있습니다.</p>
      <p><a class="button" href="${links.tag}" target="_blank" rel="noopener">릴리스 페이지로 이동</a></p>

      <h3>설치(개발자 모드)</h3>
      <ol>
        <li>Chrome 확장 관리(크롬 주소창에 chrome://extensions/ 접속)</li>
        <li>우측 상단 '개발자 모드' 활성화</li>
        <li>'압축해제된 확장 프로그램을 로드' 클릭 후 이 저장소의 <code>dist/extension</code> 또는 <code>docs/</code> 폴더를 선택</li>
      </ol>

      <h3>변경 로그</h3>
      <p>자세한 변경 내용은 <a href="${links.latest}" target="_blank" rel="noopener">릴리스 목록</a>을 확인하세요.</p>
    </section>

    <footer>
      이 페이지는 자동으로 빌드되어 업데이트됩니다. 설치 파일은 GitHub Releases에 업로드되어 있어야 합니다.
    </footer>
  </body>
</html>
`;
  writeFileSync(join(docsDir, "index.html"), indexHtml, "utf8");

  console.log("Copied dist/extension -> docs/");
  console.log("Created docs/download.html -> points to:", links.tag);
  console.log("Created docs/index.html -> informational page (version, install, links)");
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

