# 📅 Escala do Lanche — Célula de Jovens

A premium, cyberpunk-themed React application for managing weekly snack schedules (*escala do lanche*) for a church youth cell. Built with performance, accessibility, and visual impact in mind.

> **[Live Demo](https://snack-schedule.vercel.app/)**

---

## ✨ Features

- **🔍 Smart Search** — Find any volunteer across all schedules with accent-insensitive matching
- **👤 Personalized View** — Identify yourself once and the app highlights your role (Food / Drink / Free) every week
- **📋 Copy to Clipboard** — One-click formatted schedule export, ready to paste into WhatsApp groups
- **🔄 Auto-Regenerate** — Admin panel to regenerate balanced schedules with new date ranges and team members
- **💾 Persistent Storage** — Schedules stored in Supabase so they never reset between refreshes
- **📱 Fully Responsive** — Mobile-first design with adaptive layouts for all screen sizes
- **🎨 Cyberpunk Aesthetic** — Neon accents, grid backgrounds, and sharp typography

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 7 |
| **Styling** | Tailwind CSS v4 |
| **Database** | Supabase (PostgreSQL) |
| **Fonts** | Plus Jakarta Sans + Material Symbols Outlined |
| **Linting** | ESLint (flat config) |

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/heitor-exe/calendar-cell.git
   cd calendar-cell
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Supabase credentials (see [Database Setup](#-database-setup) below).

4. **Start the dev server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Database Setup

This app uses **Supabase** to persist schedules so they don't regenerate on every refresh.

### 1. Create a Supabase Project

Go to [supabase.com](https://supabase.com/) and create a free project.

### 2. Create the Table

In your Supabase dashboard, open **SQL Editor** and run:

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

### 3. Configure Environment Variables

Copy `.env.example` to `.env` (or `.env.local`) and fill in your keys:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ADMIN_PASSWORD=your_admin_password
```

### 4. Restart

```bash
npm run dev
```

On first load, the app will automatically generate and save schedules to your database if the table is empty.

---

## 📁 Project Structure

```
src/
  components/    React UI components
  hooks/         Custom React hooks (data fetching, state logic)
  services/      Supabase client singleton
  utils/         Pure utility functions (scheduling, dates, filtering)
  App.jsx        Root orchestrator
  main.jsx       Entry point
  index.css      Tailwind v4 @theme block + design tokens
```

---

## 🎮 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | Run ESLint |
| `npm run lint -- --fix` | Run ESLint with auto-fix |
| `npm run preview` | Preview production build |

---

## 🎨 Design Tokens

| Token | Value | Usage |
|---|---|---|
| Primary Neon | `#00FFC2` | Accents, borders, highlights |
| Food | `#FDCB29` | Food team indicators |
| Drink | `#4BC3FA` | Drink team indicators |
| Search Highlight | `#FF3366` | Search match highlights |
| Background | `#0A0A0B` | Page background |
| Card | `#161618` | Card surfaces |
| Border | `#2A2A2E` | Muted borders |

---

## 🌍 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your repository
4. Add environment variables in the deployment settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD`
5. Click **Deploy**

### Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project**
3. Select your repo and configure environment variables
4. Deploy

---

## 🧑‍💻 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with 💚 by <a href="https://github.com/heitor-exe">Heitor Macedo</a>
</p>
