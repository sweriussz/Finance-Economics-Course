# 📓 Stickman Lab
### *Finance & Economics for Beginners*

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Stack](https://img.shields.io/badge/stack-HTML%20%2F%20CSS%20%2F%20JS-2B5F8A)
![Build](https://img.shields.io/badge/build-none%20required-lightgrey)
![Charts](https://img.shields.io/badge/charts-Chart.js-C68A2E)

> **Mission:** Democratizing Economic Intelligence.
> **Vision:** Bringing Ivy League–level academic rigor to every student worldwide through visual storytelling and interactive engineering.

This repo is the **interactive hub** of *Finance & Economics for Beginners* — a course that bridges the gap between dry university theory and the real-world logic of money. It bundles all **10 GitHub Practice tools** (one per module) and a **45-lesson video library** into a single static site. No build step, no backend — pure HTML/CSS/JS, ready for GitHub Pages.

**[🎬 Watch on YouTube →](https://www.youtube.com/@liteconomics)**

---

## Table of Contents

- [The Stickman Methodology](#the-stickman-methodology)
- [The Ivy League Foundation](#the-ivy-league-foundation)
- [The 10-Module Roadmap](#the-10-module-roadmap)
- [The Multichannel Ecosystem](#the-multichannel-ecosystem)
- [What's in This Repo](#whats-in-this-repo)
- [Run Locally](#run-locally)
- [The Graduate Profile](#the-graduate-profile)

---

## The Stickman Methodology

Forget spreadsheets and 800-page textbooks. This course runs on **Visual Deconstruction**:

- **Narrative Learning** — every concept is a micro-story featuring *Stickman*, a character navigating real-world economic trade-offs.
- **Theory-to-Practice Synthesis** — we don't just teach Mankiw's theory of inflation; we immediately apply Brealey's financial principles to show Stickman how to protect his savings from it.

Heavy academic concepts, translated into the visual language of the social-media generation — turning passive observers into active financial thinkers.

## The Ivy League Foundation

This isn't "internet advice." The curriculum is built on two pillars of elite business education:

| Discipline | Source |
|---|---|
| **Economics** | *Principles of Economics* — N. Gregory Mankiw (Harvard University) |
| **Finance** | *Fundamentals of Corporate Finance* — Brealey, Myers & Marcus (MIT / London Business School) |

That academic alignment is what gives students legitimacy for top-tier university applications and professional credibility — not just view counts.

## The 10-Module Roadmap

A comprehensive journey from basic logic to complex valuation. Every module pairs its lessons with one hands-on JS tool, live in this repo.

| # | Module | Lessons | Academic Base | GitHub Practice Tool |
|---|---|---|---|---|
| 01 | The Economic Mindset | 4 | Mankiw, Ch. 1–2 | The Life-Value Calculator |
| 02 | Market Dynamics — Supply & Demand | 5 | Mankiw, Ch. 4–6 | Market Equilibrium Sim |
| 03 | The Business Engine — Costs & Production | 5 | Mankiw, Ch. 13–14 | Break-even Point Calculator |
| 04 | The Math of Time — Time Value of Money | 5 | Brealey/Myers/Marcus, Ch. 4–5 | The Fortune Map |
| 05 | Valuation — Bonds & Stocks | 5 | Brealey/Myers/Marcus, Ch. 6–7 | Fair Value Estimator |
| 06 | Risk, Return & Portfolio Theory | 5 | Brealey/Myers/Marcus, Ch. 11–12 | Portfolio Risk Simulator |
| 07 | Macroeconomics — The Global Stage | 4 | Mankiw, Ch. 23–24 | Personal Inflation Tracker |
| 08 | Money, Banking & Central Policy | 4 | Mankiw, Ch. 29–30 | The Central Bank Dashboard |
| 09 | Behavioral Economics & Personal Finance | 4 | Brealey, Ch. 13 + Mankiw insights | The Bias Quiz |
| 10 | Corporate Finance & Final Project | 4 | Brealey/Myers/Marcus, Ch. 8–10 | The Master Model |

**45 lessons** in total — all linked from the site's **Video Course** page (`#videos`), grouped exactly as above with a direct "▶ Watch" link to each YouTube video.

## The Multichannel Ecosystem

The project operates across three integrated layers:

- **🎬 YouTube — The Visual Engine.** The entry point: dynamic animations with high-retention storytelling that drive global awareness. → [@liteconomics](https://www.youtube.com/@liteconomics)
- **💻 GitHub — The Interactive Hub.** *(you are here)* The technical heart. Students don't just watch — they build, using interactive JS calculators, financial models, and open-source cheat sheets.
- **🎓 Udemy — The Masterclass.** The structured academic path: deep-dive lectures, rigorous testing, and official certification for career and university advancement.

## What's in This Repo

```
index.html   — page shell, sidebar nav, and the "notebook" layout
style.css    — the graph-paper / blueprint design system
app.js       — router + all 10 tools + the video library, one file
README.md    — this file
```

Everything runs client-side. Charts are drawn with [Chart.js](https://www.chartjs.org/) loaded from a CDN — no `npm install` needed.

**Inside the site:**
- 10 interactive, single-page tools — one per module, each a self-contained calculator or simulator.
- A **Video Course** page with all 45 lessons, grouped by module, linking straight to YouTube.
- A hand-drawn "graph paper / field notebook" design system, with a stickman mascot that reacts to your inputs.
- Fully responsive — works from a phone in the metro to a lecture-hall projector.

## Run Locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## The Graduate Profile

A graduate of this program stops seeing economic news as "white noise." They understand the logic of central banks, the mechanics of the stock market, and the fundamental principles of wealth creation. They exit the course not just *literate* — but **economically intelligent**.

---

<p align="center"><sub>Free & open · part of <strong>Finance & Economics for Beginners</strong> — Democratizing Economic Intelligence.</sub></p>
