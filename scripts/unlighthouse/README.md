# scripts/unlighthouse/report.sh

Reads the latest Unlighthouse report for a given target and prints a
structured summary to the terminal. Unlighthouse must have already been
run and a report saved to `.unlighthouse/` before using this script.

## Usage

```bash
bash scripts/unlighthouse/report.sh [localhost|prod]
```

- `localhost` (default): reads from `.unlighthouse/localhost/`
- `prod`: reads from `.unlighthouse/www.aowebsuite.com/`

Always picks the most recently created folder inside the target directory.

## Running Unlighthouse

First build and preview the app, then run Unlighthouse against it:

```bash
pnpm build
pnpm preview
npx unlighthouse --site http://localhost:4173 --no-cache
```

For production:

```bash
npx unlighthouse --site https://www.aowebsuite.com --no-cache
```

## Output sections

### OVERALL SCORES

Category scores (0-100%) from Lighthouse: Performance, Accessibility,
Best Practices, SEO.

### CORE WEB VITALS

FCP, LCP, Speed Index, CLS, TBT, and TTI. Each shows its measured value
and Lighthouse score.

### RENDER-BLOCKING & IMAGE ISSUES

- **Render-Blocking**: whether any CSS/JS is blocking the initial render.
- **Image Responsiveness**: whether images are served at the right
  resolution for the device pixel ratio.
- **Image Delivery**: whether images could be smaller with modern formats
  (WebP/AVIF) or better compression.

### JAVASCRIPT

Whether the main bundle contains significant unused code. Shows the
estimated KiB that could be saved and which file is the culprit. A FAIL
means Lighthouse detected code that was loaded but not executed during
page load. This is expected in client-rendered SPAs where some code only
runs on user interaction.

### TRANSFER SIZE

Top 10 heaviest resources loaded on the initial page, ordered by size.
Useful for spotting unoptimized assets at a glance.

### LCP BREAKDOWN

Splits the LCP time into its two sub-parts:

- **Time to first byte**: server latency to deliver the HTML document.
- **Element render delay**: time from TTFB to when the LCP element is
  painted. In a CSR app this is dominated by JS parse and execution time.

Also shows which element is the LCP element.

### MAIN THREAD

- **Server Response Time**: TTFB for the root HTML document.
- **Main Thread Work**: total time the main thread was busy during load.
- **JS Execution Time**: time spent parsing and executing JavaScript.

### CSS

Checks for unused CSS rules. OK means all shipped stylesheet rules are
applied to at least one element on the page. A FAIL means there are rules
that could be removed to reduce the stylesheet size.

### NETWORK DEPENDENCY TREE

The critical request chain: each resource that must finish loading before
the next one can start. A long chain or slow node delays FCP/LCP. The
duration shown per node is time from navigation start to that resource
completing.

### CONSOLE ERRORS

Any JavaScript errors logged to the console during the Lighthouse run.

## Example output

From `bash scripts/unlighthouse/report.sh prod`:

```
Target:  prod
Report:  c4a4
Created: Weekday Month DD HH:MM:SS TZ YYYY

=== OVERALL SCORES ===
performance : 97%
accessibility : 100%
best-practices : 96%
seo : 100%

=== CORE WEB VITALS ===
first-contentful-paint : 2.1 s (Score: 80%)
largest-contentful-paint : 2.1 s (Score: 95%)
speed-index : 2.5 s (Score: 98%)
cumulative-layout-shift : 0 (Score: 100%)
total-blocking-time : 0 ms (Score: 100%)
interactive : 2.1 s (Score: 99%)

=== RENDER-BLOCKING & IMAGE ISSUES ===
Render-Blocking: 100%
Image Responsiveness: 0%
  Issues: 1
Image Delivery: 50% (Est savings of 32 KiB)
  https://www.aowebsuite.com/assets/button_primary_texture-C4dZdS9-.png (32 KiB wasted)

=== JAVASCRIPT ===
Unused JS: FAIL (Est savings of 70 KiB)
  index-B6brhFO9.js: 70 KiB unused (47% of file)

=== TRANSFER SIZE ===
Total: Total size was 458 KiB
  161 KiB  brown_background_texture-CsY12Ele.png
  149 KiB  index-B6brhFO9.js
  39 KiB  apple-touch-icon.png
  34 KiB  button_primary_texture-C4dZdS9-.png
  31 KiB  useEventCallback-DSS-zrrK.js
  18 KiB  border-oxv7tX_K.png
  10 KiB  firetorch-DPmsVDxk.gif
  6 KiB  favicon.ico
  4 KiB  icons-DgvuPics.js
  4 KiB  useSlot-3WujhYSu.js

=== LCP BREAKDOWN ===
  Time to first byte: 187 ms
  Element render delay: 841 ms
  Element: <h1 class="css-1pdw4o4">

=== MAIN THREAD ===
Server Response Time: Root document took 60 ms
Main Thread Work: 0.2 s
JS Execution Time: 0.1 s

=== CSS ===
Unused CSS: none

=== NETWORK DEPENDENCY TREE ===
Longest chain: 801 ms
  / (225 ms)
    site.webmanifest (801 ms)
    index-B6brhFO9.js (800 ms)

=== CONSOLE ERRORS ===
Errors: 0
```
