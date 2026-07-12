# Kanban Board Frontend

A full-stack Kanban Board application frontend, built with **Next.js 14 (App Router)**. Supports task management with drag-and-drop reordering, image uploads with polygon annotation, and tag-based organization backed by a Django REST Framework API.

## ✨ Features

- 🔐 Secure authentication via **httpOnly cookies**, enforced through a Next.js middleware/proxy layer
- 📋 Drag-and-drop Kanban board (Boards → Columns → Task Cards)
- 🖼️ Image upload (Cloudinary) with polygon annotation canvas
- 🏷️ Tagging system for tasks
- ⚡ Server-first data fetching with **React Query**, lightweight client state with **Zustand**
- 🧩 Atomic design component architecture (atoms → molecules → organisms)

## Tech Stack

Next.js 14 · TypeScript · Tailwind + shadcn/ui · React Query · Zustand · Cloudinary

## 📁 Project Structure

```
src/
├── proxy.ts                # Reads httpOnly cookie, redirects unauthenticated users
├── app/                     # Routes (App Router) — login, registration, dashboard
│   └── api/proxy/[...path]  # Server-side proxy to Django backend
├── components/
│   ├── atoms/                # Base UI primitives
│   ├── molecules/             # Composed UI units
│   └── organisms/              # Feature level components (Board, Canvas, etc.)
├── lib/
│   ├── services/               # API service layer (auth, tasks, images, annotations, tags)
│   └── actions/                # Server actions (auth cookie handling)
├── store/                    # Zustand stores (UI-only state)
├── hooks/                    # Custom React Query hooks
└── types/                    # Shared TypeScript types
```

## 🏗️ Architecture Notes

- **Auth flow**: Login sets an httpOnly cookie via a server action. `proxy.ts` (middleware) guards protected routes and redirects unauthenticated users. All backend calls are routed through `app/api/proxy/[...path]` so the cookie never touches client JS.
- **Component design**: Strict atomic hierarchy atoms are dumb/reusable, organisms hold feature logic, and pages compose organisms.
- **Data layer**: React Query owns server state (tasks, images, annotations); Zustand only manages ephemeral UI state (e.g. drag state, selected tool).

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run the dev server
npm run dev
```

App runs at `http://localhost:3000`.

## 🔑 Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://kanban-board-tuuo.onrender.com
```

## 📜 Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## 🔗 Backend

This frontend expects a Django REST Framework backend exposing auth, tasks, images, annotations, and tags endpoints. See backend repo for setup instructions.
