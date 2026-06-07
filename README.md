# Qassim National Day Proposal — Overdo

Technical proposal for the official Qassim National Day celebration (96th Saudi National Day), produced by **Overdo**.

## Deployment

This project is a static HTML presentation optimized for Vercel deployment.

### Deploy to Vercel

1. Push this repository to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Set the **Root Directory** to the project folder (if nested)
4. Deploy — Vercel will automatically use `vercel.json` for routing

The root URL (`/`) will automatically redirect to the main proposal file.

## Project Structure

```
├── index.html              ← Entry point (redirects to main file)
├── العرض الفني.html        ← Main proposal presentation
├── proposal.css            ← Presentation styles
├── deck-stage.js           ← Slide engine
├── vercel.json             ← Vercel routing & cache headers
├── assets/
│   ├── photos/             ← Background & hero photos (WebP)
│   ├── team/               ← Team member portraits (WebP)
│   ├── artists/            ← Artist photos (WebP)
│   ├── designs/            ← Design mockups (WebP)
│   ├── projects/           ← Previous project gallery (WebP)
│   ├── cpu/                ← Factory/CPU section images (WebP)
│   └── *.png               ← Logos & pattern overlays (PNG, transparency preserved)
└── fonts/
    └── *.woff2             ← All fonts in WOFF2 format
```

## Optimization Notes

- All photos converted to **WebP** at 78–82% quality
- All fonts converted to **WOFF2** (smallest web font format)
- Unused assets removed
- Non-critical images use `loading="lazy"`
- Long-lived cache headers set for all static assets via `vercel.json`
- Total project size: **~14 MB** (down from 42 MB)
