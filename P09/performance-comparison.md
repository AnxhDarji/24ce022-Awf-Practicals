# Practical 09 - In-Memory Caching and Query Optimization

## Objective

Add server-side in-memory caching to the Task Management API and compare `GET /tasks` response times with and without caching.

## Caching mechanism

The API uses one shared `node-cache` instance with a default TTL of 60 seconds. The `all_tasks` entry is checked before querying MongoDB. The first request after a cache miss fetches the sorted task list and stores it; later requests return the cached list. Successful task creation, update, and deletion invalidate the entry.

## Response-time comparison

| Request | Without Cache (ms) | With Cache (ms) |
|---|---:|---:|
| 1 | 2.91 | 1.19 |
| 2 | 1.80 | 0.93 |
| 3 | 1.12 | 0.83 |
| Average | 1.94 | 0.98 |

**Observed performance difference:** In this local run, cached requests averaged about 0.96 ms less (approximately 49.4% lower) than uncached requests. The first cache-miss request took 2.48 ms and is not included in the cached HIT column.

Measurements were collected on 2026-10-24 with a Node.js HTTP client over localhost, using the same authenticated test account and MongoDB task dataset. The uncached readings came from P07's existing API; the cached readings came from P09 after one cache-warming request.

## Cache invalidation

After each successful task create, update, or delete, the API removes `all_tasks`. Failed writes do not clear the cache. The next `GET /tasks` then queries MongoDB and stores the fresh result.

## Testing limitations

These are three-request local samples and will vary with machine load, network conditions, and database state; they should not be treated as a general performance guarantee. To repeat the comparison in Postman or Thunder Client, record three `GET /tasks` requests against P07 for the uncached baseline, then warm P09's cache and record three more requests within 60 seconds. Keep task data, authentication, and environment the same.
