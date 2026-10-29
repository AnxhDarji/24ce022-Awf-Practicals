# Practical 08: Performance Comparison

## Objective and implementation

The P06 frontend is a single-screen Vite + React application and does not have a router or separate Projects/Contact pages. This practical keeps the existing Task Manager as the home page and also makes it available at `/tasks`. React Router was added for these routes, with the Task Manager and a small not-found page loaded through `React.lazy()`. A `Suspense` fallback displays “Loading page...” while a route component loads.

The baseline was built from an unchanged copy of the P06 frontend in P08 before adding the router or lazy imports. P06 was not modified.

## Results

| Metric | Before optimization | After optimization |
|---|---|---|
| Initial JavaScript bundle size | 144.59 kB (47.21 kB gzip), one bundle | 159.33 kB (52.65 kB gzip) entry chunk; route chunks are separate |
| Initial JavaScript transferred | 144,598 bytes for the baseline JS asset, fetched from the local production preview with `curl` | Not measured in a browser. The individually fetched entry and TaskManager assets total 162,950 bytes (162.95 kB raw; 54.11 kB gzip by build output) |
| Initial page load time | Not measured; the local `curl` asset response time is not a page-load measurement | Not measured |
| Route-specific chunks | None; the application was in one JS bundle | `TaskManager-BlylOTlA.js` 3.61 kB (1.46 kB gzip); `NotFound-Dd-N1vEE.js` 0.45 kB (0.27 kB gzip) |

Build sizes are Vite's production-build output. Asset transfer sizes were also checked against the local production preview. The post-optimization route total is calculated from the generated entry and route chunk sizes; it is not a browser Network-panel observation.

## Interpretation and limitations

The build confirms that the route components are emitted as separate chunks. The Task Manager chunk is imported only when the `/` or `/tasks` route renders, and the not-found chunk is imported for unmatched routes. Since P06 contains only one real application screen and that screen is the home route, opening the app still requires its Task Manager chunk. The added router also increases the entry chunk, so this small project does not demonstrate a reduction in JavaScript required by its main route.

Browser DevTools inspection, Slow 3G testing, browser page-load timing, and screenshots were not available in this run. Therefore, actual browser request timing, initial transfer totals, fallback visibility under throttling, and CRUD interaction against the P06 backend are not reported as tested. No performance improvement is claimed.

## Build and run

From this folder, run `npm ci`, then `npm run dev`. The Task Manager frontend uses the P06 API at `http://localhost:8000`; start the P06 backend separately if you want to test task operations. Run `npm run build` to recreate the production chunks reported above.
