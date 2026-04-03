# Escala do Lanche

[![Live Demo](https://img.shields.io/badge/Live_Demo-00FFC2?style=for-the-badge&logo=vercel&logoColor=0A0A0B)](https://snack-schedule.vercel.app/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=0A0A0B)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=0A0A0B)](https://supabase.com/)

A React application for managing weekly snack schedules for a youth group. Every Friday, team members are assigned to bring food, drinks, or take the week off — this app keeps everything organized, fair, and accessible.

<p align="center">
  <img src="public/calendar.svg" alt="Escala do Lanche" width="128" height="128">
</p>

---

## Features

- **Current week hero card** — instantly see who's on food, drinks, or off duty this Friday
- **Balanced schedule generation** — a deficit-based algorithm ensures fair rotation across all members, with monthly awareness so nobody gets stuck with the same role
- **Personalized view** — pick your name once, and the app highlights your role every week with color-coded badges
- **Smart search** — find any member across all schedules with accent-insensitive matching (Joao matches João)
- **Copy to clipboard** — one-click formatted export ready for WhatsApp groups
- **Offline-first PWA** — works without internet, installable on any device with Supabase response caching
- **Admin panel** — password-protected interface to regenerate schedules with new date ranges and team lists

## Quick Start

```bash
git clone https://github.com/heitor-exe/calendar-cell.git
cd calendar-cell
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

> [!NOTE]
> The app works out of the box with in-memory generated schedules. To persist data across sessions, set up a Supabase project (see below).

## Configuration

Create a `.env` file at the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ADMIN_PASSWORD=your_secret_password
```

### Database Setup

Create a Supabase project and run this in the SQL Editor:

```sql
create table schedules (
  id uuid default uuid_generate_v4() primary key,
  date date not null unique,
  food_team jsonb not null,
  drink_team jsonb not null,
  free_team jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

On first load, the app auto-generates and saves schedules if the table is empty.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint -- --fix` | ESLint with auto-fix |

## How Scheduling Works

The algorithm (`src/utils/scheduler.js`) uses a **deficit-based greedy approach** with monthly awareness:

1. Each Friday is split into 15 slots: 5 for food, 3 for drinks, 7 off
2. Members accumulate "hunger" — the longer since their last assignment to a role, the higher their priority
3. A global deficit score tracks fairness against ideal distribution
4. At each month boundary, members who got zero free shifts the previous month receive a bonus priority boost
5. The result: over a season, every member gets a roughly equal share of each role

> [!TIP]
> Final distribution stats are logged to the console as a table for verification.

## Deployment

The app deploys as a static SPA to any host. For **Vercel**:

1. Push to GitHub and import the repo at [vercel.com](https://vercel.com)
2. Add the three environment variables above
3. Deploy

Environment variables are also required on Netlify, Cloudflare Pages, or any similar platform.

## Project Structure

```
src/
  components/    React UI components (JSX, Tailwind classes)
  hooks/         Custom hooks for data fetching and state logic
  services/      Supabase client singleton
  utils/         Pure functions: scheduling, dates, filtering
  App.jsx        Root orchestrator
  main.jsx       Entry point with PWA service worker registration
  index.css      Tailwind v4 design tokens and custom utilities
```

## Tech Stack

- **React 19** with functional components and hooks
- **Vite 7** for fast builds and HMR
- **Tailwind CSS v4** with custom design tokens (cyberpunk theme)
- **Supabase** for persistent schedule storage
- **vite-plugin-pwa** for offline support and installability
- **ESLint** (flat config) for code quality

## Design

The interface uses a dark cyberpunk aesthetic with sharp corners, neon accents, and a technical grid background. Key colors:

| Token | Value | Usage |
|---|---|---|
| Primary | `#00FFC2` | Accents, borders, glow effects |
| Food | `#FDCB29` | Food team indicators |
| Drink | `#4BC3FA` | Drink team indicators |
| Highlight | `#FF3366` | Search match highlights |
| Background | `#0A0A0B` | Page surface |

---

<p align="center">
  Built by <a href="https://github.com/heitor-exe">Heitor Macedo</a>
</p>
