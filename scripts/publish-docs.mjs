#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { cwd } from "node:process";
import { resolve } from "node:path";

const rootDir = cwd();
const docsDir = resolve(rootDir, "docs");

function safeRun(cmd, args) {
  execFileSync(cmd, args, { stdio: "inherit" });
}

if (!existsSync(docsDir)) {
  console.error("docs/ not found. Run `npm run build:pages` first.");
  process.exit(1);
}

const shouldPush =
  process.env.PUSH_DOCS === "true" || process.argv.includes("--push");

if (!shouldPush) {
  console.log("");
  console.log("작업 준비 완료: docs/ 생성됨.");
  console.log("주의: 자동 커밋/푸시는 기본적으로 비활성화 되어 있습니다.");
  console.log("원하시면 수동으로 커밋·푸시하거나, 환경변수로 활성화하세요:");
  console.log("  PUSH_DOCS=true npm run build:publish");
  console.log("또는:");
  console.log("  npm run build:publish -- --push");
  console.log("");
  process.exit(0);
}

try {
  // add, commit, push
  safeRun("git", ["add", "docs"]);
  safeRun("git", ["commit", "-m", "chore(docs): update docs from local build [skip ci]"]);
  safeRun("git", ["push", "origin", "HEAD:main"]);
  console.log("docs/ 커밋 및 푸시 완료.");
} catch (err) {
  console.error("git 작업 실패:", err.message || err);
  process.exit(1);
}

