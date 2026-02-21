#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { cwd } from "node:process";
import { execFileSync } from "node:child_process";

const rootDir = cwd();
const distDir = resolve(rootDir, "dist");
const extensionDir = resolve(distDir, "extension");
const zipPath = resolve(distDir, "link-collector.zip");

const requiredFiles = [
  "manifest.json",
  "content.js",
  "background.js",
  "popup.html",
  "popup.js",
  "icon-16x16.png",
  "icon-32x32.png",
  "icon-48x48.png",
  "icon-128x128.png"
];

const requiredDirs = ["_locales"];

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

function createZip() {
  try {
    execFileSync("zip", ["-q", "-r", zipPath, "."], {
      cwd: extensionDir,
      stdio: "inherit"
    });
  } catch (error) {
    throw new Error(
      "Failed to create zip archive. Make sure 'zip' is installed and available in PATH."
    );
  }
}

function build() {
  const version = ensureManifestVersion();
  removePath(distDir);
  mkdirSync(extensionDir, { recursive: true });

  copyReleaseFiles();
  createZip();

  const metadata = {
    generatedAt: new Date().toISOString(),
    version,
    artifact: "dist/link-collector.zip"
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
  build();
}
