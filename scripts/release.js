#!/usr/bin/env node

/**
 * Release script for Colonist Companion
 * Usage: node scripts/release.js [patch|minor|major]
 *
 * This script:
 * 1. Bumps version in package.json
 * 2. Runs checks (typecheck, lint)
 * 3. Builds the extension
 * 4. Creates a zip file ready for Chrome Web Store
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

const run = (cmd, options = {}) => {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: rootDir, ...options });
};

const bumpVersion = (version, type) => {
  const [major, minor, patch] = version.split(".").map(Number);
  switch (type) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
    default:
      return `${major}.${minor}.${patch + 1}`;
  }
};

const main = () => {
  const bumpType = process.argv[2] || "patch";

  if (!["patch", "minor", "major"].includes(bumpType)) {
    console.error("❌ Invalid bump type. Use: patch, minor, or major");
    process.exit(1);
  }

  console.log("🚀 Starting release process...\n");

  // Read package.json
  const pkgPath = join(rootDir, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  const oldVersion = pkg.version;
  const newVersion = bumpVersion(oldVersion, bumpType);

  console.log(`📦 Bumping version: ${oldVersion} → ${newVersion} (${bumpType})`);

  // Update package.json
  pkg.version = newVersion;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

  try {
    // Run checks
    console.log("\n🔍 Running checks...");
    run("yarn typecheck");
    run("yarn lint");

    // Build
    console.log("\n🔨 Building extension...");
    run("yarn build");

    // Create release directory
    const releaseDir = join(rootDir, "release");
    if (!existsSync(releaseDir)) {
      mkdirSync(releaseDir);
    }

    // Create zip
    console.log("\n📦 Creating zip file...");
    const zipName = `colonist-companion-v${newVersion}.zip`;
    run(`cd dist && zip -r ../release/${zipName} .`);

    console.log("\n✅ Release complete!");
    console.log(`\n📁 Output: release/${zipName}`);
    console.log(`\n📋 Next steps:`);
    console.log(`   1. git add -A && git commit -m "release: v${newVersion}"`);
    console.log(`   2. git tag v${newVersion}`);
    console.log(`   3. git push && git push --tags`);
    console.log(`   4. Upload release/${zipName} to Chrome Web Store`);
  } catch (_error) {
    // Rollback version on failure
    console.error("\n❌ Release failed! Rolling back version...");
    pkg.version = oldVersion;
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    process.exit(1);
  }
};

main();
