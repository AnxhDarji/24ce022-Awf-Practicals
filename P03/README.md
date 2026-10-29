# Practical 3 - API Integration and Data Rendering

This React portfolio uses the public GitHub REST API to load repositories on the Projects page.

## Features

- `useEffect` fetches data once when the Projects page loads.
- Separate loading spinner and error message components.
- Repository name, description, star count, and GitHub URL are displayed.
- Search input filters repository names.
- Retry button appears when the API request fails.

## Run

```bash
npm install
npm run dev
```

The project fetches `octocat` repositories from `https://api.github.com`, so no API key is required.
