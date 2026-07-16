#!/usr/bin/env node
'use strict';
// Run: node audit-all.js
// Aggregation auditor — runs audit-converted.js for all waves, plus global checks.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// =============================================================================
// Helpers
// =============================================================================

function getRunner() {
  // Try node first, fall back to bun
  try {
    execSync('node --version', { stdio: 'ignore' });
    return 'node';
  } catch (_) {
    try {
      execSync('bun --version', { stdio: 'ignore' });
      return 'bun';
    } catch (_2) {
      console.error('ERROR: neither node nor bun is available');
      process.exit(2);
    }
  }
}

function runAudit(args) {
  const runner = getRunner();
  const cmd = runner + ' scripts/audit-converted.js ' + args;
  console.log('\n=== Running: ' + cmd);
  try {
    const output = execSync(cmd, {
      cwd: process.cwd(),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    console.log(output);
    return { exitCode: 0, stdout: output, stderr: '' };
  } catch (e) {
    const stdout = e.stdout ? (typeof e.stdout === 'string' ? e.stdout : e.stdout.toString()) : '';
    const stderr = e.stderr ? (typeof e.stderr === 'string' ? e.stderr : e.stderr.toString()) : '';
    console.log(stdout);
    if (stderr) console.error(stderr);
    return { exitCode: e.status || 1, stdout, stderr };
  }
}

function runCmd(cmd, opts) {
  try {
    const output = execSync(cmd, {
      cwd: opts.cwd || process.cwd(),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      ...opts,
    });
    return { exitCode: 0, stdout: output, stderr: '' };
  } catch (e) {
    return {
      exitCode: e.status || 1,
      stdout: e.stdout ? (typeof e.stdout === 'string' ? e.stdout : e.stdout.toString()) : '',
      stderr: e.stderr ? (typeof e.stderr === 'string' ? e.stderr : e.stderr.toString()) : '',
    };
  }
}

// =============================================================================
// Wave definitions
// =============================================================================

const WAVES = {
  1: {
    globs: [
      'zh/manual/configuration/*.md',
      'en/manual/configuration/*.md',
      'zh/manual/deployment/*.md',
      'en/manual/deployment/*.md',
      'zh/manual/getting-started/index.md',
      'en/manual/getting-started/index.md',
    ],
    excludes: [],
    strictSkipLines: null,
  },
  2: {
    globs: [
      'zh/manual/adapters/*.md',
      'en/manual/adapters/*.md',
      'zh/manual/features/mcp.md',
      'en/manual/features/mcp.md',
      'zh/manual/webui/index.md',
      'en/manual/webui/index.md',
      'zh/about/PRIVACY.md',
      'en/about/PRIVACY.md',
    ],
    excludes: [],
    strictSkipLines: null,
  },
  3: {
    globs: [
      'zh/develop/**/*.md',
      'en/develop/**/*.md',
      'zh/plugin/**/*.md',
      'en/plugin/**/*.md',
    ],
    excludes: [
      'zh/develop/markdown-features.md',
      'en/develop/markdown-features.md',
    ],
    strictSkipLines: null,
  },
  4: {
    globs: [
      'zh/faq/error-troubleshooting.md',
      'en/faq/error-troubleshooting.md',
    ],
    excludes: [],
    strictSkipLines: null,
  },
  5: {
    globs: [
      'zh/develop/markdown-features.md',
      'en/develop/markdown-features.md',
    ],
    excludes: [],
    strictSkipLines: 'zh/en:19-29:93-117:152-154:164-172:191-193',
  },
};

// =============================================================================
// Per-wave audit
// =============================================================================

function auditWave(waveNum) {
  const config = WAVES[waveNum];
  if (!config) {
    console.error('ERROR: no config for wave ' + waveNum);
    return false;
  }

  let args = '--wave ' + waveNum;
  for (const g of config.globs) {
    args += " --file-glob '" + g + "'";
  }
  for (const e of config.excludes) {
    args += " --exclude '" + e + "'";
  }
  if (config.strictSkipLines) {
    args += " --strict-skip-lines '" + config.strictSkipLines + "'";
  }

  const result = runAudit(args);
  return result.exitCode === 0;
}

// =============================================================================
// Global checks
// =============================================================================

function globalChecks() {
  const errors = [];
  const cwd = process.cwd();

  // 1. pnpm docs:build
  console.log('\n=== Global check: pnpm docs:build');
  const buildResult = runCmd('pnpm docs:build', { cwd });
  if (buildResult.exitCode !== 0) {
    errors.push('FAIL: pnpm docs:build exit ' + buildResult.exitCode);
    console.error('Build stderr: ' + buildResult.stderr.slice(0, 500));
  } else {
    // Check stderr for code-group warnings
    const combined = (buildResult.stdout + buildResult.stderr).toLowerCase();
    const grepResult = runCmd('echo "' + combined.replace(/"/g, '\\"') + '" | grep -i code-group', { cwd });
    // Simpler: just check if "code-group" appears in stderr
    if (buildResult.stderr.toLowerCase().includes('code-group')) {
      errors.push('FAIL: code-group warning found in build stderr');
    }
    console.log('pnpm docs:build — OK');
  }

  // 2. git diff --stat scope check
  console.log('\n=== Global check: git diff --stat scope');
  const diffStatResult = runCmd('git diff --stat', { cwd });
  const diffLines = diffStatResult.stdout.split('\n').filter(Boolean);
  const forbiddenPatterns = ['README.md', 'AGENTS.md', 'public/', '.vitepress/', '.sisyphus/'];
  for (const line of diffLines) {
    // First column is the filename
    const fileMatch = line.match(/^\s*([^|]+?)\s+\|/);
    if (fileMatch) {
      const fileName = fileMatch[1].trim();
      for (const pattern of forbiddenPatterns) {
        if (fileName.includes(pattern)) {
          errors.push('FAIL: forbidden file in diff: ' + fileName);
        }
      }
    }
  }
  if (diffLines.length === 0) {
    console.log('git diff --stat — empty (no changes)');
  } else {
    console.log('git diff --stat — OK (only allowed files)');
  }

  // 3. git diff .vitepress/config.mts
  console.log('\n=== Global check: .vitepress/config.mts untouched');
  const configResult = runCmd('git diff .vitepress/config.mts', { cwd });
  if (configResult.stdout.trim()) {
    errors.push('FAIL: .vitepress/config.mts has changes');
  } else {
    console.log('.vitepress/config.mts — no changes (OK)');
  }

  // 4. Idempotent check: git diff --stat should be empty
  // (After conversion, re-run should produce no new changes)
  console.log('\n=== Global check: idempotent re-run');
  const idemResult = runCmd('git diff --stat', { cwd });
  if (idemResult.stdout.trim()) {
    errors.push('FAIL: idempotent re-run produced changes');
    console.error('Diff output:\n' + idemResult.stdout.slice(0, 1000));
  } else {
    console.log('idempotent — no changes (OK)');
  }

  // 5. Content fidelity: sample 5 converted blocks
  console.log('\n=== Global check: content fidelity (sample 5 blocks)');
  // Collect all converted blocks from all manifests
  const allConverted = [];
  for (let w = 1; w <= 5; w++) {
    const manifestPath = path.join(cwd, '.omo', 'evidence',
      'standalone-blocks-to-icon-codegroups', 'task-' + w, 'manifest-' + w + '.json');
    try {
      const raw = fs.readFileSync(manifestPath, 'utf-8');
      const manifest = JSON.parse(raw);
      const converted = manifest.converted || [];
      for (const entry of converted) {
        allConverted.push(entry);
      }
    } catch (_) {
      // Manifest may not exist yet — that's OK for T0
    }
  }

  if (allConverted.length === 0) {
    console.log('No converted blocks to sample (OK for pre-conversion)');
  } else {
    // Sample up to 5 blocks
    const sample = [];
    const step = Math.max(1, Math.floor(allConverted.length / 5));
    for (let i = 0; i < allConverted.length && sample.length < 5; i += step) {
      sample.push(allConverted[i]);
    }

    for (const entry of sample) {
      const filePath = path.resolve(cwd, entry.file);
      try {
        const currentContent = fs.readFileSync(filePath, 'utf-8');
        const currentLines = currentContent.split('\n');

        // Extract the block's fence content from current file
        const blockStart = entry.start_line - 1; // 0-indexed
        const blockLines = [];
        let j = blockStart + 1; // skip opening fence
        while (j < currentLines.length) {
          const line = currentLines[j];
          if (/^\x60{3,}/.test(line)) {
            break; // closing fence
          }
          blockLines.push(line);
          j++;
        }
        const blockContent = blockLines.join('\n');

        // Get the original content from git HEAD
        const headResult = runCmd('git show HEAD:' + entry.file, { cwd });
        if (headResult.exitCode !== 0) {
          errors.push('FAIL: cannot get HEAD content for ' + entry.file);
          continue;
        }
        const headLines = headResult.stdout.split('\n');
        const headBlockLines = [];
        let hj = blockStart + 1;
        while (hj < headLines.length) {
          const line = headLines[hj];
          if (/^\x60{3,}/.test(line)) {
            break;
          }
          headBlockLines.push(line);
          hj++;
        }
        const headBlockContent = headBlockLines.join('\n');

        // Byte comparison
        if (blockContent !== headBlockContent) {
          errors.push('FAIL: content mismatch for ' + entry.file + ':' + entry.start_line);
          console.error('  Current: ' + blockContent.slice(0, 80));
          console.error('  HEAD:    ' + headBlockContent.slice(0, 80));
        } else {
          console.log('  Content match for ' + entry.file + ':' + entry.start_line + ' (OK)');
        }
      } catch (e) {
        errors.push('FAIL: error checking ' + entry.file + ': ' + e.message);
      }
    }
  }

  return errors;
}

// =============================================================================
// Main
// =============================================================================

function main() {
  console.log('=== Audit-All: Starting aggregation audit ===\n');

  const cwd = process.cwd();
  let allPassed = true;

  // Check that audit-converted.js exists
  const auditPath = path.join(cwd, 'scripts', 'audit-converted.js');
  if (!fs.existsSync(auditPath)) {
    console.error('ERROR: scripts/audit-converted.js not found');
    process.exit(2);
  }

  // Run per-wave audits
  for (let wave = 1; wave <= 5; wave++) {
    console.log('\n--- Wave ' + wave + ' audit ---');
    const passed = auditWave(wave);
    if (!passed) {
      allPassed = false;
      console.error('Wave ' + wave + ' audit FAILED');
    } else {
      console.log('Wave ' + wave + ' audit PASSED');
    }
  }

  // Global checks
  console.log('\n=== Global checks ===');
  const globalErrors = globalChecks();

  if (globalErrors.length > 0) {
    allPassed = false;
    console.error('\nGlobal check failures:');
    for (const err of globalErrors) {
      console.error('  ' + err);
    }
  }

  if (allPassed) {
    console.log('\n=== Audit-All: ALL CHECKS PASSED ===');
    process.exit(0);
  } else {
    console.error('\n=== Audit-All: SOME CHECKS FAILED ===');
    process.exit(1);
  }
}

main();
