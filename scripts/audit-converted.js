#!/usr/bin/env node
'use strict';
// Run: node audit-converted.js --wave <N> --file-glob <glob> [--file-glob ...] [--exclude ...] [--strict-skip-lines '<lang_dir>:<ranges>'] [--manifest <path>]

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// =============================================================================
// Constants
// =============================================================================

const ICON_MAP = {
  toml: 'vscode-icons:file-type-toml',
  python: 'vscode-icons:file-type-python',
  py: 'vscode-icons:file-type-python',
  rust: 'vscode-icons:file-type-rust',
  rs: 'vscode-icons:file-type-rust',
  go: 'vscode-icons:file-type-go',
  typescript: 'vscode-icons:file-type-typescript',
  ts: 'vscode-icons:file-type-typescript',
  javascript: 'vscode-icons:file-type-js',
  js: 'vscode-icons:file-type-js',
  json: 'vscode-icons:file-type-json',
  html: 'vscode-icons:file-type-html',
  css: 'vscode-icons:file-type-css',
  scss: 'vscode-icons:file-type-scss',
  yaml: 'vscode-icons:file-type-yaml-official',
  yml: 'vscode-icons:file-type-yaml-official',
  ini: 'vscode-icons:file-type-ini',
  conf: 'vscode-icons:file-type-config',
  env: 'vscode-icons:file-type-dotenv',
  bash: 'vscode-icons:file-type-shell',
  sh: 'vscode-icons:file-type-shell',
  shell: 'vscode-icons:file-type-shell',
  powershell: 'vscode-icons:file-type-powershell',
  ps1: 'vscode-icons:file-type-powershell',
  dockerfile: 'vscode-icons:file-type-docker',
};

const CONVERTIBLE_LANGS = new Set([
  'toml', 'yaml', 'yml', 'json', 'python', 'py', 'bash', 'sh', 'shell',
  'powershell', 'ps1', 'html', 'css', 'scss', 'rust', 'rs', 'go',
  'typescript', 'ts', 'javascript', 'js', 'env', 'dockerfile', 'ini', 'conf',
]);

const VALID_SKIP_RULES = new Set(['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8']);

const SKIP_LABELS = {
  S1: 'mermaid/mmd',
  S2: 'inside-container',
  S3: 'live-html-component',
  S4: '4plus-backtick-fence',
  S5: 'no-lang-or-text',
  S6: 'has-info-string-attrs',
  S7: 'near-container-boundary',
  S8: 'vue-sfc',
};

// =============================================================================
// CLI argument parsing
// =============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    wave: null,
    fileGlobs: [],
    excludes: [],
    strictSkipLines: null,
    manifestPath: null,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--wave':
        opts.wave = args[++i];
        break;
      case '--file-glob':
        opts.fileGlobs.push(args[++i]);
        break;
      case '--exclude':
        opts.excludes.push(args[++i]);
        break;
      case '--strict-skip-lines':
        opts.strictSkipLines = args[++i];
        break;
      case '--manifest':
        opts.manifestPath = args[++i];
        break;
      default:
        // Ignore unknown flags
        break;
    }
  }

  if (!opts.wave) {
    console.error('ERROR: --wave <N> is required');
    process.exit(2);
  }
  if (opts.fileGlobs.length === 0) {
    console.error('ERROR: at least one --file-glob <glob> is required');
    process.exit(2);
  }

  return opts;
}

// =============================================================================
// Minimal glob expansion (no external deps)
// =============================================================================

function expandGlob(globPattern, cwd) {
  // Support simple ** and * patterns
  const results = [];

  function walk(dir, patternParts, partIndex) {
    if (partIndex >= patternParts.length) {
      // All parts consumed, this is a match if it's a file
      try {
        const stat = fs.statSync(dir);
        if (stat.isFile()) {
          results.push(path.relative(cwd, dir));
        }
      } catch (_) { /* ignore */ }
      return;
    }

    const part = patternParts[partIndex];

    if (part === '**') {
      // Recursively walk all subdirectories
      try {
        const entries = fs.readdirSync(dir);
        for (const entry of entries) {
          const fullPath = path.join(dir, entry);
          try {
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
              // Try matching ** at this level (consume **)
              walk(fullPath, patternParts, partIndex + 1);
              // Also try keeping ** for deeper recursion
              walk(fullPath, patternParts, partIndex);
            }
          } catch (_) { /* ignore */ }
        }
      } catch (_) { /* ignore */ }
    } else if (part.includes('*')) {
      // Handle * in filename
      const regex = new RegExp('^' + part.replace(/\*/g, '.*') + '$');
      try {
        const entries = fs.readdirSync(dir);
        for (const entry of entries) {
          if (regex.test(entry)) {
            const fullPath = path.join(dir, entry);
            walk(fullPath, patternParts, partIndex + 1);
          }
        }
      } catch (_) { /* ignore */ }
    } else {
      // Literal directory or file name
      const fullPath = path.join(dir, part);
      try {
        const stat = fs.statSync(fullPath);
        if (partIndex === patternParts.length - 1 && stat.isFile()) {
          results.push(path.relative(cwd, fullPath));
        } else if (stat.isDirectory()) {
          walk(fullPath, patternParts, partIndex + 1);
        }
      } catch (_) { /* ignore */ }
    }
  }

  // Normalize and split pattern
  const normalized = globPattern.replace(/\\/g, '/');
  const parts = normalized.split('/').filter(p => p !== '' && p !== '.');

  // Find the root directory
  let root = cwd;
  let startIdx = 0;

  // Walk up directories that don't contain glob chars
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].includes('*')) {
      startIdx = i;
      break;
    }
    root = path.join(root, parts[i]);
    startIdx = i + 1;
  }

  // If the entire pattern has no glob chars, try direct file match
  if (startIdx >= parts.length) {
    try {
      const stat = fs.statSync(root);
      if (stat.isFile()) {
        results.push(path.relative(cwd, root));
      }
    } catch (_) { /* ignore */ }
    return results;
  }

  // Ensure root exists
  try {
    fs.statSync(root);
  } catch (_) {
    return results;
  }

  walk(root, parts, startIdx);
  return results;
}

function resolveFiles(globs, excludes, cwd) {
  const fileSet = new Set();

  for (const g of globs) {
    const matches = expandGlob(g, cwd);
    for (const m of matches) {
      if (m.endsWith('.md')) {
        fileSet.add(m);
      }
    }
  }

  // Apply excludes
  for (const excl of excludes) {
    const exclFiles = expandGlob(excl, cwd);
    for (const ef of exclFiles) {
      fileSet.delete(ef);
    }
    // Also try direct prefix match
    for (const f of fileSet) {
      if (f.startsWith(excl) || f === excl) {
        fileSet.delete(f);
      }
    }
  }

  return Array.from(fileSet).sort();
}

// =============================================================================
// Fence-state scanner (S1-S8 aware)
// =============================================================================

function isOpeningFence(line) {
  const m = line.match(/^(\x60{3,})\s*(\S.*)?$/);
  return m ? { backtickCount: m[1].length, rest: (m[2] || '').trim() } : null;
}

function isClosingFence(line, minBackticks) {
  // Must be at least minBackticks backticks, optionally followed by word chars and spaces
  const m1 = line.match(/^(\x60{3,})\s*$/);
  if (m1 && m1[1].length >= minBackticks) return true;
  const m2 = line.match(/^(\x60{3,})\s*\w[\w-]*\s*$/);
  if (m2 && m2[1].length >= minBackticks) return true;
  return false;
}

function isContainerOpen(line) {
  return /^:::\s+\w/.test(line);
}

function isContainerClose(line) {
  return /^:::\s*$/.test(line);
}

function isContainerLine(line) {
  return isContainerOpen(line) || isContainerClose(line);
}

/**
 * Scan a single file and return all fenced code blocks with contextual info.
 *
 * @param {string} filePath - relative file path
 * @param {string} cwd - working directory
 * @returns {{blocks: Array, containerLines: Array, fenceBoundaryMap: Map}}
 *
 * Each block: {
 *   file, start_line, end_line, lang, info_rest, open_bt, close_bt,
 *   container_depth_at_open, inside_s4, content_lines
 * }
 */
function scanFile(filePath, cwd) {
  const fullPath = path.resolve(cwd, filePath);
  let content;
  try {
    content = fs.readFileSync(fullPath, 'utf-8');
  } catch (_) {
    return { blocks: [], containerLines: [], fenceBoundaryMap: new Map() };
  }

  const lines = content.split('\n');
  const blocks = [];
  const containerLines = []; // {line, type: 'open'|'close'}
  const fenceBoundaryMap = new Map(); // lineNum -> boolean (is inside fence?)

  let fence_open = false;
  let fence_len = 0;
  let container_depth = 0;
  let in_s4_fence = false;
  let s4_fence_len = 0;
  let s4_fence_start_line = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];

    fenceBoundaryMap.set(lineNum, fence_open);

    if (!fence_open) {
      const openMatch = isOpeningFence(line);
      if (openMatch) {
        const btCount = openMatch.backtickCount;
        const rest = openMatch.rest;

        // Extract lang and info_rest
        let lang = '';
        let infoRest = '';
        if (rest) {
          const langMatch = rest.match(/^(\w[\w-]*)/);
          if (langMatch) {
            lang = langMatch[1].toLowerCase();
            infoRest = rest.slice(langMatch[0].length).trim();
          } else {
            infoRest = rest;
          }
        }

        fence_open = true;
        fence_len = btCount;

        // Track S4 outer fence
        const is_s4_outer = btCount >= 4 && !in_s4_fence;
        if (is_s4_outer) {
          in_s4_fence = true;
          s4_fence_len = btCount;
          s4_fence_start_line = lineNum;
        }

        const block = {
          file: filePath,
          start_line: lineNum,
          lang: lang,
          info_rest: infoRest,
          open_bt: btCount,
          container_depth_at_open: container_depth,
          inside_s4: in_s4_fence,
          content_lines: [],
          end_line: -1,
          close_bt: 0,
        };

        // Find closing fence
        let j = i + 1;
        while (j < lines.length) {
          const closeLine = lines[j];
          if (isClosingFence(closeLine, fence_len)) {
            const closeBtMatch = closeLine.match(/^(\x60+)/);
            block.close_bt = closeBtMatch ? closeBtMatch[1].length : fence_len;
            block.end_line = j + 1;
            blocks.push(block);

            // Check if this closes an S4 outer fence
            if (in_s4_fence && block.close_bt >= s4_fence_len &&
                block.start_line === s4_fence_start_line) {
              in_s4_fence = false;
              s4_fence_len = 0;
              s4_fence_start_line = 0;
            }

            fence_open = false;
            fence_len = 0;
            i = j; // continue scanning from the closing fence line
            break;
          }
          block.content_lines.push(closeLine);
          j++;
        }

        if (block.end_line === -1) {
          // Unclosed fence — treat as not a fence
          fence_open = false;
          fence_len = 0;
          if (in_s4_fence && block.start_line === s4_fence_start_line) {
            in_s4_fence = false;
            s4_fence_len = 0;
            s4_fence_start_line = 0;
          }
        }
      } else {
        // Check for ::: container lines (only when not inside a fence)
        if (isContainerOpen(line)) {
          container_depth++;
          containerLines.push({ line: lineNum, type: 'open', depth: container_depth });
        } else if (isContainerClose(line)) {
          const prevDepth = container_depth;
          container_depth = Math.max(0, container_depth - 1);
          containerLines.push({ line: lineNum, type: 'close', depth: prevDepth });
        }
      }
    }
  }

  return { blocks, containerLines, fenceBoundaryMap };
}

/**
 * Classify a block according to S1-S8 rules.
 * Returns {skip: true, skip_rule: 'S1'|...} or {skip: false, skip_rule: null}
 */
function classifyBlock(block) {
  const lang = block.lang;

  // S1: mermaid or mmd
  if (lang === 'mermaid' || lang === 'mmd') {
    return { skip: true, skip_rule: 'S1' };
  }

  // S2: inside container
  if (block.container_depth_at_open > 0) {
    return { skip: true, skip_rule: 'S2' };
  }

  // S3: html lang with live components
  if (lang === 'html') {
    const content = block.content_lines.join('\n');
    if (content.includes('<xgplayer') || content.includes('<iframe') || content.includes('<Linkcard')) {
      return { skip: true, skip_rule: 'S3' };
    }
  }

  // S4: 4+ backtick fence or inside one
  if (block.open_bt >= 4 || block.inside_s4) {
    return { skip: true, skip_rule: 'S4' };
  }

  // S5: no lang or text/none/plaintext
  if (!lang || lang === 'text' || lang === 'none' || lang === 'plaintext') {
    return { skip: true, skip_rule: 'S5' };
  }

  // S6: info string has VitePress attributes {...} or title [...]
  if (block.info_rest) {
    if (block.info_rest.includes('{') || block.info_rest.includes('[')) {
      return { skip: true, skip_rule: 'S6' };
    }
  }

  // S8: inside Vue SFC (script/template) — repo doesn't have these, check anyway
  // We check by looking if the block is inside a Vue component region
  // For now, we don't have a reliable way to detect this without a full parse.
  // Skip for now — if needed, scan nearby lines for <script> / <template> tags.

  return { skip: false, skip_rule: null };
}

/**
 * Check S7: block within 2 lines of a ::: open/close line.
 * This is checked AFTER other rules because it requires knowledge of nearby lines.
 */
function checkS7(block, containerLines, fenceBoundaryMap) {
  // Check 2 lines before the opening fence
  for (let d = 1; d <= 2; d++) {
    const checkLine = block.start_line - d;
    if (checkLine < 1) continue;
    // Ensure the line is not inside a fence
    if (fenceBoundaryMap.get(checkLine)) continue;
    // Check if it's a container line
    for (const cl of containerLines) {
      if (cl.line === checkLine) return { skip: true, skip_rule: 'S7' };
    }
  }

  // Check 2 lines after the closing fence
  for (let d = 1; d <= 2; d++) {
    const checkLine = block.end_line + d;
    if (fenceBoundaryMap.has(checkLine) && fenceBoundaryMap.get(checkLine)) continue;
    for (const cl of containerLines) {
      if (cl.line === checkLine) return { skip: true, skip_rule: 'S7' };
    }
  }

  return { skip: false, skip_rule: null };
}

/**
 * Scan all files and return expectSet (blocks that should be converted).
 * expectSet entries: "<file>:<start_line>"
 */
function buildExpectSet(files, cwd) {
  const expectSet = new Set();
  const allResults = []; // For statistics

  for (const file of files) {
    const { blocks, containerLines, fenceBoundaryMap } = scanFile(file, cwd);

    for (const block of blocks) {
      // Apply S1-S6, S8 classification
      let classification = classifyBlock(block);

      // Apply S7 (requires containerLines)
      if (!classification.skip) {
        classification = checkS7(block, containerLines, fenceBoundaryMap);
      }

      allResults.push({
        file: block.file,
        start_line: block.start_line,
        lang: block.lang,
        skip: classification.skip,
        skip_rule: classification.skip_rule,
      });

      if (!classification.skip && CONVERTIBLE_LANGS.has(block.lang)) {
        expectSet.add(block.file + ':' + block.start_line);
      }
    }
  }

  return { expectSet, allResults };
}

// =============================================================================
// Manifest loading and validation
// =============================================================================

function findManifest(wave, cwd, manifestPath, files) {
  if (manifestPath) {
    const full = path.resolve(cwd, manifestPath);
    if (fs.existsSync(full)) return full;
    console.error('ERROR: specified manifest not found: ' + manifestPath);
    process.exit(2);
  }

  const candidates = [];

  // 1. CWD
  candidates.push(path.join(cwd, 'manifest-' + wave + '.json'));

  // 2. Default path
  candidates.push(path.join(cwd, '.omo', 'evidence', 'standalone-blocks-to-icon-codegroups',
    'task-' + wave, 'manifest-' + wave + '.json'));

  // 3. Directories of matched files (for fixture discovery)
  if (files && files.length > 0) {
    const seenDirs = new Set();
    for (const file of files) {
      const dir = path.dirname(path.resolve(cwd, file));
      if (!seenDirs.has(dir)) {
        seenDirs.add(dir);
        candidates.push(path.join(dir, 'manifest-' + wave + '.json'));
      }
    }
  }

  for (const cand of candidates) {
    if (fs.existsSync(cand)) return cand;
  }

  console.error('ERROR: manifest-' + wave + '.json not found. Tried:');
  for (const cand of candidates) {
    console.error('  ' + cand);
  }
  process.exit(2);
}

function loadManifest(manifestFullPath) {
  try {
    const raw = fs.readFileSync(manifestFullPath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('ERROR: failed to parse manifest: ' + e.message);
    process.exit(2);
  }
}

// =============================================================================
// Manifest label validation
// =============================================================================

function validateManifestLabels(manifest) {
  const errors = [];
  const converted = manifest.converted || [];
  const skipped = manifest.skipped || [];

  for (const entry of converted) {
    const iconId = entry.icon_id;
    if (!iconId) {
      errors.push('FAIL: converted entry missing icon_id at ' + entry.file + ':' + entry.start_line);
      continue;
    }
    // Check if icon_id is in the values of ICON_MAP
    const validIcons = new Set(Object.values(ICON_MAP));
    if (!validIcons.has(iconId)) {
      errors.push('FAIL: icon-id out-of-table (' + iconId + ') at ' + entry.file + ':' + entry.start_line);
    }
  }

  for (const entry of skipped) {
    const rule = entry.skip_rule;
    if (!rule) {
      errors.push('FAIL: skipped entry missing skip_rule at ' + entry.file + ':' + entry.start_line);
      continue;
    }
    if (!VALID_SKIP_RULES.has(rule)) {
      errors.push('FAIL: skip-rule out-of-range (' + rule + ') at ' + entry.file + ':' + entry.start_line);
    }
  }

  return errors;
}

// =============================================================================
// False-skip check (symmetric difference)
// =============================================================================

function falseSkipCheck(files, manifest, cwd) {
  const gotSet = new Set();
  const converted = manifest.converted || [];
  for (const entry of converted) {
    // Normalize path separators
    const normalizedFile = entry.file.replace(/\\/g, '/');
    gotSet.add(normalizedFile + ':' + entry.start_line);
  }

  const { expectSet, allResults } = buildExpectSet(files, cwd);

  const missing = new Set(); // expectSet \ gotSet (false-skip: should be converted but isn't)
  const over = new Set();    // gotSet \ expectSet (over-conversion: converted but shouldn't be)

  for (const key of expectSet) {
    if (!gotSet.has(key)) {
      missing.add(key);
    }
  }
  for (const key of gotSet) {
    if (!expectSet.has(key)) {
      over.add(key);
    }
  }

  // Build detail for missing blocks
  const missingDetails = [];
  if (missing.size > 0) {
    for (const block of allResults) {
      const key = block.file + ':' + block.start_line;
      if (missing.has(key)) {
        missingDetails.push(
          '  ' + key + ' lang=' + block.lang + ' reason=MISSING: false-skip'
        );
      }
    }
  }

  // Also check: are there blocks in allResults that should be converted but aren't in the manifest?
  // (This is the `expectSet \ gotSet` case — our scanner says they should be converted,
  // but manifest doesn't have them as converted.)
  // We already handle this above with `missing`.

  // For over-conversion: blocks in gotSet that aren't in expectSet
  const overDetails = [];
  if (over.size > 0) {
    // Find what rule they should have hit
    for (const block of allResults) {
      const key = block.file + ':' + block.start_line;
      if (over.has(key)) {
        overDetails.push(
          '  ' + key + ' lang=' + block.lang +
          ' should-be-skipped=' + (block.skip_rule || 'N/A')
        );
      }
    }
    // Also check blocks that are in gotSet but weren't found in our scan at all
    for (const gk of over) {
      const found = allResults.some(b => (b.file + ':' + b.start_line) === gk);
      if (!found) {
        overDetails.push('  ' + gk + ' lang=? reason=block-not-found-in-scan');
      }
    }
  }

  return {
    missing,
    over,
    missingDetails,
    overDetails,
    allResults,
  };
}

// =============================================================================
// Parity check (zh/ vs en/)
// =============================================================================

function parityCheck(manifest) {
  const converted = manifest.converted || [];
  let zhConverted = 0;
  let enConverted = 0;

  for (const entry of converted) {
    const file = entry.file || '';
    if (file.startsWith('zh/') || file.startsWith('zh\\')) {
      zhConverted++;
    } else if (file.startsWith('en/') || file.startsWith('en\\')) {
      enConverted++;
    }
  }

  const delta = Math.abs(zhConverted - enConverted);
  return { zhConverted, enConverted, delta };
}

// =============================================================================
// Skip statistics
// =============================================================================

function skipStats(manifest) {
  const skipped = manifest.skipped || [];
  const counts = {};
  for (const rule of VALID_SKIP_RULES) {
    counts[rule] = 0;
  }
  for (const entry of skipped) {
    const rule = entry.skip_rule;
    if (counts[rule] !== undefined) {
      counts[rule]++;
    }
  }
  return counts;
}

// =============================================================================
// Strict skip-lines check
// =============================================================================

function strictSkipLinesCheck(strictSkipLinesArg, files, cwd) {
  // Parse: "<lang_dir>:<range1>:<range2>:..." or "<lang_dir1>/<lang_dir2>:<range1>:..."
  // Example: "zh:19-29:93-117:152-154:164-172:191-193"
  // Example: "zh/en:19-29:93-117:152-154:164-172:191-193"

  const errors = [];
  if (!strictSkipLinesArg) return errors;

  const colonIdx = strictSkipLinesArg.indexOf(':');
  if (colonIdx === -1) {
    errors.push('FAIL: invalid --strict-skip-lines format (missing colon): ' + strictSkipLinesArg);
    return errors;
  }

  const langDirsPart = strictSkipLinesArg.slice(0, colonIdx);
  const rangesPart = strictSkipLinesArg.slice(colonIdx + 1);

  // Parse lang dirs: "zh" or "zh/en"
  const langDirs = langDirsPart.split('/').filter(Boolean);

  // Parse ranges: "19-29:93-117:..."
  const rangeStrs = rangesPart.split(':').filter(Boolean);
  const ranges = [];
  for (const rs of rangeStrs) {
    const parts = rs.split('-');
    if (parts.length === 2) {
      ranges.push({ start: parseInt(parts[0], 10), end: parseInt(parts[1], 10) });
    }
  }

  // Find files under each lang_dir
  for (const ld of langDirs) {
    const dirFiles = files.filter(f => f.startsWith(ld + '/') || f.startsWith(ld + '\\'));

    for (const file of dirFiles) {
      try {
        // Run git diff and check for protected patterns
        const diffOutput = execSync('git diff -- ' + file, {
          cwd: cwd,
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
        }).toString();

        if (!diffOutput.trim()) continue; // No changes

        // Check for protected patterns in diff lines
        const protectedPattern = /^[+-].*(<xgplayer|<iframe|<Linkcard|\x60{4,})/m;
        if (protectedPattern.test(diffOutput)) {
          // Further check: are these changes in protected line ranges?
          // Parse diff hunks to get line numbers
          const hunkHeaderRe = /^@@\s+-(\d+)(?:,(\d+))?\s+\+(\d+)(?:,(\d+))?\s+@@/gm;
          let hunk;
          const changedLines = [];

          while ((hunk = hunkHeaderRe.exec(diffOutput)) !== null) {
            const newStart = parseInt(hunk[3], 10);
            const newCount = hunk[4] ? parseInt(hunk[4], 10) : 1;

            // Find the actual changed lines within this hunk
            const hunkStart = hunk.index;
            const hunkEnd = diffOutput.indexOf('\n@@', hunkStart + 1);
            const hunkText = diffOutput.slice(
              hunkStart,
              hunkEnd === -1 ? diffOutput.length : hunkEnd
            );

            const hunkLines = hunkText.split('\n');
            let newLineNum = newStart;
            for (const hl of hunkLines) {
              if (hl.startsWith('+') && !hl.startsWith('+++')) {
                changedLines.push(newLineNum);
                newLineNum++;
              } else if (!hl.startsWith('-')) {
                newLineNum++;
              }
            }
          }

          // Check if any changed line falls in protected ranges
          for (const cl of changedLines) {
            for (const range of ranges) {
              if (cl >= range.start && cl <= range.end) {
                // Check if the changed line contains the protected pattern
                const diffLines = diffOutput.split('\n');
                for (const dl of diffLines) {
                  if ((dl.startsWith('+') || dl.startsWith('-')) &&
                      /(<xgplayer|<iframe|<Linkcard|\x60{4,})/.test(dl)) {
                    errors.push(
                      'FAIL: S3/S4 protected-line violation at ' + file +
                      ' (line ' + cl + ' in range ' + range.start + '-' + range.end + ')'
                    );
                    break;
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        // git diff may fail if file is not tracked; that's OK
        if (e.stdout && e.stdout.toString().trim()) {
          // Some output exists, check it
        }
      }
    }
  }

  return errors;
}

// =============================================================================
// Main
// =============================================================================

function main() {
  const opts = parseArgs();
  const cwd = process.cwd();

  // Resolve files from globs
  const files = resolveFiles(opts.fileGlobs, opts.excludes, cwd);

  if (files.length === 0) {
    console.log('converted=0, skipped=0 (S1:0 S2:0 S3:0 S4:0 S5:0 S6:0 S7:0 S8:0)');
    console.log('parity: zh-converted=0 en-converted=0 delta=0');
    process.exit(0);
  }

  // Find and load manifest
  const manifestFullPath = findManifest(opts.wave, cwd, opts.manifestPath, files);
  const manifest = loadManifest(manifestFullPath);

  let allErrors = [];
  let exitCode = 0;

  // 1. Manifest label validation
  const labelErrors = validateManifestLabels(manifest);
  allErrors = allErrors.concat(labelErrors);

  // 2. False-skip check
  const fsCheck = falseSkipCheck(files, manifest, cwd);

  if (fsCheck.missing.size > 0) {
    allErrors.push('FAIL: false-skip detected (' + fsCheck.missing.size + ' blocks)');
    allErrors = allErrors.concat(fsCheck.missingDetails);
  }

  if (fsCheck.over.size > 0) {
    allErrors.push('FAIL: over-conversion (' + fsCheck.over.size + ' blocks)');
    allErrors = allErrors.concat(fsCheck.overDetails);
  }

  // 3. Strict skip-lines check
  if (opts.strictSkipLines) {
    const sslErrors = strictSkipLinesCheck(opts.strictSkipLines, files, cwd);
    allErrors = allErrors.concat(sslErrors);
  }

  // 4. Parity
  const parity = parityCheck(manifest);

  // 5. Skip stats
  const stats = skipStats(manifest);
  const statParts = [];
  for (const rule of ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8']) {
    if (stats[rule] > 0 || true) { // Always show all rules
      statParts.push(rule + ':' + stats[rule]);
    }
  }

  const converted = (manifest.converted || []).length;
  const skipped = (manifest.skipped || []).length;

  // Output
  console.log('converted=' + converted + ', skipped=' + skipped + ' (' + statParts.join(' ') + ')');
  console.log('parity: zh-converted=' + parity.zhConverted +
    ' en-converted=' + parity.enConverted + ' delta=' + parity.delta);

  if (allErrors.length > 0) {
    exitCode = 1;
    for (const err of allErrors) {
      console.error(err);
    }
  }

  process.exit(exitCode);
}

main();
