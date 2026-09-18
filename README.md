# Ting-Chen Su — Illustration Portfolio

A static HTML/CSS/JavaScript portfolio with 19 illustrations and 12 original transparent character sketches. No build dependencies or third-party scripts.

## Local preview

```sh
python3 scripts/validate.py
node --check script.js
python3 -m http.server 8765
```

Open http://localhost:8765. Resource URLs are relative so the site supports the `/illustration-portfolio/` GitHub Pages subpath.

## Interaction

- Character float and gentle rotation; cards reveal once on scroll.
- Artwork buttons open a native modal dialog. Use previous/next buttons or left/right arrow keys; Escape, the close button, or backdrop dismisses it. Focus returns to the selected artwork.
- System reduced-motion settings disable animation. Gallery content stays visible when JavaScript is unavailable.
- Responsive one-column mobile gallery, lazy-loaded images, and explicit image dimensions.

## Deployment

In repository Settings → Pages → Build and deployment, select **GitHub Actions** as the source. Pushes to `main` (or a manual workflow run) validate asset references and publish only the public site files using `.github/workflows/pages.yml`.

If `actions/configure-pages` reports “Get Pages site failed / Not Found”, the repository owner must first enable GitHub Pages with the source above. No personal access token belongs in the site or workflow; deployment uses GitHub's scoped workflow token.

See `assets/README.md` for source mappings. Artwork copyright remains with Ting-Chen Su.
