# Stickman Lab — Finance & Economics for Beginners

Interactive companion site for the **Finance & Economics for Beginners** course.
It bundles all 10 "GitHub Practice" tools — one per module — into a single
static website. No build step, no backend: pure HTML/CSS/JS, ready for
GitHub Pages.

## Video course

All lessons live on the [Stickman Lab YouTube channel](https://www.youtube.com/@liteconomics).
The site has an 11th page, **Video Course**, listing every lesson (grouped
by module, with real lesson titles) with a "▶ Watch" link once a URL is
filled in. The "N Lessons" counter in the header and on that page is
computed automatically from the data — it always matches what's in the list.

**To add your video links:** open `app.js`, find the `VIDEO_MODULES` array
near the top of the "VIDEO COURSE" section, and set the `url` field for each
lesson (e.g. `'https://youtu.be/XXXXXXX'`). Until a `url` is filled in, that
row renders as a greyed-out "link pending" placeholder; once filled, it
automatically becomes a clickable link — no other code needs to change.

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
index.html         — page shell, sidebar nav, and the "notebook" layout
style.css           — the graph-paper / blueprint design system
app.js              — router + all 10 tools (each is one render function)
README.md           — this file
```

Everything runs client-side. Charts are drawn with [Chart.js](https://www.chartjs.org/)
loaded from a CDN — no npm install needed.

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

