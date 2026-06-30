# MyFlightBook Modern

A modern, sleek redesign of [MyFlightBook.com](https://myflightbook.com/) — the world's most popular free digital pilot logbook. Built with Next.js, TypeScript, and a premium jet-black UI design system.

## 🛫 Live Demo

Deploy to Vercel in one click, or run locally.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with CSS Modules + Custom Properties design system
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Fonts**: Inter + JetBrains Mono (Google Fonts)
- **Deployment**: [Vercel](https://vercel.com/)

## Features

- ✈️ **Flight Logbook** — Searchable flight log with totals, currency tracking
- 🛩️ **Aircraft Management** — Fleet overview with model statistics
- 🗺️ **Airport Explorer** — Most visited airports leaderboard
- 📊 **Training Progress** — Ratings progress rings, endorsements, achievements
- 📋 **Feature Comparison** — Side-by-side comparison table
- 💬 **FAQ** — Searchable, categorized accordion
- 📞 **Contact** — Contact form with social links

## Design

- Jet black UI (`#000` → `#1a1a1a`) with cyan (`#00d4ff`) and emerald (`#00ff88`) accents
- Glassmorphism effects with `backdrop-filter: blur()`
- Micro-animations and scroll-triggered reveals
- Fully responsive (mobile-first)
- Premium typography with Inter + JetBrains Mono

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → "Add New Project"
3. Import the repository
4. Click **Deploy** — zero configuration needed
5. Your site is live! 🎉

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (header, footer, fonts)
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Design system
│   ├── about/              # About page
│   ├── aircraft/           # Aircraft management
│   ├── airports/           # Airport explorer
│   ├── contact/            # Contact form
│   ├── faq/                # FAQ accordion
│   ├── logbook/            # Flight logbook (core)
│   ├── pricing/            # Feature comparison
│   └── training/           # Training & progress
├── components/
│   ├── Header.tsx          # Glassmorphic navbar
│   └── Footer.tsx          # Footer with links
└── data/
    └── siteData.ts         # Mock data
```

## License

This is a UI redesign / demonstration project. The original MyFlightBook is open source at [github.com/ericberman/MyFlightbookWeb](https://github.com/ericberman/MyFlightbookWeb).
