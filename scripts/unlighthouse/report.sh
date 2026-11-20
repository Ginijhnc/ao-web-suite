#!/usr/bin/env bash
# Reads the latest Unlighthouse report for a given target (localhost or prod)
# and prints overall scores, core web vitals, and key audit results.
# Usage: bash scripts/unlighthouse/report.sh [localhost|prod]
#
# MAINTAINERS: if you modify this script (add/remove sections, change output
# format), update scripts/unlighthouse/README.md to keep the docs and example
# output in sync.

set -euo pipefail

TARGET="${1:-localhost}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BASE_DIR=""

case "$TARGET" in
  localhost)
    BASE_DIR="$ROOT/.unlighthouse/localhost"
    ;;
  prod)
    BASE_DIR="$ROOT/.unlighthouse/www.aowebsuite.com"
    ;;
  *)
    echo "Unknown target '$TARGET'. Use 'localhost' or 'prod'." >&2
    exit 1
    ;;
esac

LATEST=$(ls -t "$BASE_DIR" | head -1)
REPORT="$BASE_DIR/$LATEST/reports/lighthouse.json"

echo "Target:  $TARGET"
echo "Report:  $LATEST"
echo "Created: $(date -r "$BASE_DIR/$LATEST" 2>/dev/null || stat -c '%y' "$BASE_DIR/$LATEST" 2>/dev/null)"
echo ""

node - "$REPORT" <<'EOF'
const fs = require('fs');
const json = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

console.log('=== OVERALL SCORES ===');
for (const [key, cat] of Object.entries(json.categories)) {
  console.log(`${key} : ${Math.round(cat.score * 100)}%`);
}

console.log('\n=== CORE WEB VITALS ===');
const metrics = [
  'first-contentful-paint',
  'largest-contentful-paint',
  'speed-index',
  'cumulative-layout-shift',
  'experimental-interaction-to-next-paint',
  'total-blocking-time',
  'interactive',
];
for (const id of metrics) {
  const audit = json.audits[id];
  if (audit) {
    console.log(`${id} : ${audit.displayValue} (Score: ${Math.round(audit.score * 100)}%)`);
  }
}

console.log('\n=== RENDER-BLOCKING & IMAGE ISSUES ===');
const rb = json.audits['render-blocking-insight'];
console.log(`Render-Blocking: ${Math.round(rb.score * 100)}%`);
if (rb.details?.items?.length) console.log(`  Files: ${rb.details.items.length}`);

const img = json.audits['image-size-responsive'];
console.log(`Image Responsiveness: ${Math.round(img.score * 100)}%`);
if (img.details?.items?.length) console.log(`  Issues: ${img.details.items.length}`);

const imgDel = json.audits['image-delivery-insight'];
console.log(`Image Delivery: ${Math.round(imgDel.score * 100)}%${imgDel.displayValue ? ' (' + imgDel.displayValue + ')' : ''}`);
if (imgDel.details?.items?.length) {
  for (const item of imgDel.details.items) {
    console.log(`  ${item.url} (${Math.round(item.wastedBytes / 1024)} KiB wasted)`);
  }
}

console.log('\n=== JAVASCRIPT ===');
const unusedJs = json.audits['unused-javascript'];
const unusedJsPass = unusedJs.score === 1;
if (unusedJsPass) {
  console.log(`Unused JS: OK`);
} else {
  console.log(`Unused JS: FAIL (${unusedJs.displayValue})`);
  for (const item of (unusedJs.details?.items ?? [])) {
    const url = item.url.split('/').pop();
    console.log(`  ${url}: ${Math.round(item.wastedBytes / 1024)} KiB unused (${Math.round(item.wastedPercent)}% of file)`);
  }
}

console.log('\n=== TRANSFER SIZE ===');
const tbw = json.audits['total-byte-weight'];
console.log(`Total: ${tbw.displayValue}`);
for (const item of (tbw.details?.items ?? []).slice(0, 10)) {
  const name = item.url.split('/').pop();
  console.log(`  ${Math.round(item.totalBytes / 1024)} KiB  ${name}`);
}

console.log('\n=== LCP BREAKDOWN ===');
const lcpB = json.audits['lcp-breakdown-insight'];
if (lcpB.details?.items?.[0]?.items) {
  for (const subpart of lcpB.details.items[0].items) {
    console.log(`  ${subpart.label}: ${Math.round(subpart.duration)} ms`);
  }
  const lcpEl = lcpB.details.items[1];
  if (lcpEl?.snippet) console.log(`  Element: ${lcpEl.snippet}`);
}

console.log('\n=== MAIN THREAD ===');
const srt = json.audits['server-response-time'];
console.log(`Server Response Time: ${srt.displayValue}`);
const mwb = json.audits['mainthread-work-breakdown'];
console.log(`Main Thread Work: ${mwb.displayValue}`);
const bt = json.audits['bootup-time'];
console.log(`JS Execution Time: ${bt.displayValue}`);

console.log('\n=== CSS ===');
const unusedCss = json.audits['unused-css-rules'];
if (unusedCss.score === 1) {
  console.log(`Unused CSS: none`);
} else {
  const totalWasted = (unusedCss.details?.items ?? []).reduce((sum, i) => sum + i.wastedBytes, 0);
  const fileCount = unusedCss.details?.items?.length ?? 0;
  console.log(`Unused CSS: ${Math.round(totalWasted / 1024)} KiB unused in ${fileCount} file${fileCount !== 1 ? 's' : ''}`);
  for (const item of (unusedCss.details?.items ?? [])) {
    const url = item.url.split('/').pop();
    console.log(`  ${url}: ${Math.round(item.wastedBytes / 1024)} KiB unused (${Math.round(item.wastedPercent)}% of file)`);
  }
}

console.log('\n=== NETWORK DEPENDENCY TREE ===');
const ndt = json.audits['network-dependency-tree-insight'];
const ndtChains = ndt.details?.items?.[0]?.value?.chains;
if (ndtChains) {
  const longest = ndt.details.items[0].value.longestChain;
  console.log(`Longest chain: ${Math.round(longest.duration)} ms`);
  const printChain = (node, depth) => {
    const indent = '  '.repeat(depth);
    const url = node.url.split('/').pop() || '/';
    console.log(`${indent}${url} (${Math.round(node.navStartToEndTime)} ms)`);
    for (const child of Object.values(node.children ?? {})) printChain(child, depth + 1);
  };
  for (const chain of Object.values(ndtChains)) printChain(chain, 1);
}

console.log('\n=== CONSOLE ERRORS ===');
const errs = json.audits['errors-in-console'];
console.log(`Errors: ${errs.details?.items?.length ?? 0}`);
if (errs.details?.items?.length) {
  for (const e of errs.details.items) console.log(`  ${e.description}`);
}
EOF
