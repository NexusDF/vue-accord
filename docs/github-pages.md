# GitHub Pages

Enable the site under **Settings → Pages → Source: GitHub Actions**.

Pushes to `main` or `feat/github-pages-pwa` (and manual **workflow_dispatch**) run `.github/workflows/pages.yml`, which builds with `GITHUB_PAGES=true` and `VITE_INCLUDE_SEEDS=false`, then deploys to `https://NexusDF.github.io/vue-accord/`.

If deploy fails with **environment protection rules**, GitHub Pages currently allows only the repo default branch. The default is `feat/github-pages-pwa` (first push). To deploy from `main`:

1. **Settings → General → Default branch** → `main`
2. **Settings → Environments → github-pages → Deployment branches** → add `main` (or “All branches”)

Public builds keep original **practice** sheets only. Famous demo lyrics in `src/data/seedSongs.js` stay out of `dist/` (see `LEGAL.md`). Songsterr’s Vite proxy does not exist on Pages.
