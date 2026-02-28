#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, readdirSync, createWriteStream } from "node:fs";
import { join, resolve } from "node:path";
import { cwd } from "node:process";
import { execFileSync } from "node:child_process";
import archiver from "archiver";

const rootDir = cwd();
const distDir = resolve(rootDir, "dist");
const extensionDir = resolve(distDir, "extension");
let zipPath = resolve(distDir, "link-collector.zip");

// 기본적으로 복사할 필수 파일 목록
const baseRequiredFiles = [
  "manifest.json",
  "content.js",
  "background.js",
  "popup.html",
  "popup.js"
];

// 루트 폴더에 있는 이미지(icon/*.png, .svg, .ico)를 자동으로 포함
let imageFiles = [];
try {
  imageFiles = readdirSync(rootDir).filter((f) => /\.(png|svg|ico)$/i.test(f));
} catch (e) {
  imageFiles = [];
}

const requiredFiles = [...baseRequiredFiles, ...imageFiles];

// 복사할 디렉터리 목록 (_locales는 필수, assets는 존재하면 포함)
const requiredDirs = ["_locales"];
if (existsSync(join(rootDir, "assets"))) {
  requiredDirs.push("assets");
}

function removePath(path) {
  rmSync(path, { recursive: true, force: true });
}

function assertExists(path, label) {
  if (!existsSync(path)) {
    throw new Error(`Missing ${label}: ${path}`);
  }
}

function ensureManifestVersion() {
  const manifestPath = join(rootDir, "manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (!manifest.version) {
    throw new Error("manifest.json is missing a version field");
  }
  return manifest.version;
}

function copyReleaseFiles() {
  for (const file of requiredFiles) {
    const source = join(rootDir, file);
    assertExists(source, `file \"${file}\"`);
    cpSync(source, join(extensionDir, file));
  }

  for (const dir of requiredDirs) {
    const source = join(rootDir, dir);
    assertExists(source, `directory \"${dir}\"`);
    cpSync(source, join(extensionDir, dir), { recursive: true });
  }
}

async function createZip() {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      resolve();
    });

    output.on("error", (err) => {
      reject(err);
    });

    archive.on("error", (err) => {
      reject(err);
    });

    archive.pipe(output);
    // add all extensionDir contents at root of zip
    archive.directory(extensionDir, false);
    archive.finalize().catch(reject);
  });
}

async function build() {
  const version = ensureManifestVersion();
  // include version in zip filename
  zipPath = resolve(distDir, `link-collector-${version}.zip`);
  removePath(distDir);
  mkdirSync(extensionDir, { recursive: true });

  copyReleaseFiles();
  await createZip();

  const metadata = {
    generatedAt: new Date().toISOString(),
    version,
    artifact: `dist/${zipPath.split(/[\\/]/).pop()}`
  };

  writeFileSync(join(distDir, "build-meta.json"), `${JSON.stringify(metadata, null, 2)}\n`, "utf8");

  console.log("Build complete");
  console.log(`- Extension files: ${extensionDir}`);
  console.log(`- Release package: ${zipPath}`);
}

function clean() {
  removePath(distDir);
  console.log(`Removed ${distDir}`);
}

if (process.argv.includes("--clean")) {
  clean();
} else {
  build().catch((err) => {
    console.error("Build failed:", err);
    process.exit(1);
  });
}
