# Youth Cell Snack Schedule

A premium React application for managing snack schedules.

## 🚀 Quick Start

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run locally**:
    ```bash
    npm run dev
    ```

## 🗄️ Database Setup

This app uses **Supabase** to store schedules so they don't change every time you refresh.

1.  Go to [Supabase](https://supabase.com/) and create a free project.
2.  In your project dashboard, go to **SQL Editor** and run this query to create the table:
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
3.  Copy `.env.example` to `.env.local` and fill in your keys:
    ```bash
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```
4.  Restart the dev server. The app will automatically generate and save the schedule on the first load if the database is empty.

## 🌍 Deployment (How to put it online)

The easiest way to host this for free is using **Vercel** or **Netlify**.

### Option 1: Vercel (Recommended)
1.  Push this code to a GitHub repository.
2.  Go to [Vercel.com](https://vercel.com) and sign up/login.
3.  Click **"Add New..."** -> **"Project"**.
4.  Import your GitHub repository.
5.  **Important**: In the configuration step, find the **"Environment Variables"** section.
6.  Add the same variables you used locally:
    -   `VITE_SUPABASE_URL`
    -   `VITE_SUPABASE_ANON_KEY`
7.  Click **Deploy**.

### Option 2: Netlify
1.  Push code to GitHub.
2.  Go to [Netlify.com](https://netlify.com).
3.  **"Add new site"** -> **"Import an existing project"**.
4.  Select your repo.
5.  In **"Site settings"** or **"Environment variables"**, add the Supabase keys.
6.  Deploy.

Once deployed, anyone with the link can view the schedule!
