# Stickman Lab — Finance & Economics for Beginners

Interactive companion site for the **Finance & Economics for Beginners** course.
It bundles all 10 "GitHub Practice" tools — one per module — into a single
static website. No build step, no backend: pure HTML/CSS/JS, ready for
GitHub Pages.

## Tools included

| # | Module | Tool |
|---|--------|------|
| 01 | The Economic Mindset | The Life-Value Calculator |
| 02 | Market Dynamics | Market Equilibrium Sim |
| 03 | The Business Engine | Break-even Point Calculator |
| 04 | The Math of Time | The Fortune Map (compound interest) |
| 05 | Valuation | Fair Value Estimator (Gordon Growth Model) |
| 06 | Risk & Resilience | Portfolio Risk Simulator (CAPM beta) |
| 07 | The Macro Lens | Personal Inflation Tracker |
| 08 | Power & Policy | The Central Bank Dashboard |
| 09 | Behavioral Economics | The Bias Quiz |
| 10 | Capstone | The Master Model (NPV / startup valuation) |

## Project structure

```
index.html        — page shell, sidebar nav, and the "notebook" layout
css/style.css      — the graph-paper / blueprint design system
js/app.js          — router + all 10 tools (each is one render function)
README.md          — this file
```

Everything runs client-side. Charts are drawn with [Chart.js](https://www.chartjs.org/)
loaded from a CDN — no npm install needed.

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `stickman-lab`).
2. Push these files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Stickman Lab: interactive finance & economics tools"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**,
   branch **main**, folder **/ (root)**. Save.
5. GitHub will publish the site at
   `https://<your-username>.github.io/<repo-name>/` within a minute or two.

## Extending

Each tool is a single `render(root)` function registered in the `TOOLS` array
at the bottom of `js/app.js`. To add an 11th tool: write a `renderYourTool(root)`
function following the existing pattern (inject HTML into `root`, attach input
listeners, call `mountChart(...)` if you need a chart, call `setStickman(mood, caption)`
for the margin reaction), then add one entry to `TOOLS`.
