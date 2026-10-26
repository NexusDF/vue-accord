# GitHub Pages

Enable the site under **Settings → Pages → Source: GitHub Actions**.

Pushes to `main` (and manual **workflow_dispatch**) run `.github/workflows/pages.yml`, which builds with `GITHUB_PAGES=true` and `VITE_INCLUDE_SEEDS=false`, then deploys to `https://<user>.github.io/vue-accord/`.

Public builds keep original **practice** sheets only. Famous demo lyrics in `src/data/seedSongs.js` stay out of `dist/` (see `LEGAL.md`). Songsterr’s Vite proxy does not exist on Pages.
