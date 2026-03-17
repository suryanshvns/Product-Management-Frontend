# Product Management & Analytics Platform

Enterprise admin dashboard for e-commerce operations: products, categories, inventory, analytics, and activity logs.

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript
- **Styling:** TailwindCSS
- **Components:** Radix-based UI (Shadcn-style)
- **State:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **HTTP:** Axios
- **Icons:** Lucide React

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Set `NEXT_PUBLIC_API_URL` in `.env.local` to point to your API (see `.env.example`).

## Project structure

```
app/                 # Next.js App Router pages and layouts
components/          # Shared UI and layout components
  ui/                # Base primitives (Button, Card, Input, etc.)
  shared/            # DataTable, Modal, Pagination, SearchBar, etc.
  layout/            # Sidebar, Header, Breadcrumb, DashboardLayout
features/            # Feature modules
  products/          # Product list, form, hooks, services usage
  categories/
  inventory/
  analytics/
  activity/
hooks/               # useToast and other global hooks
services/            # API layer (auth, product, category, inventory, analytics, activity)
lib/                 # axios instance, utils
types/               # Shared constants and types
utils/               # App constants (routes, sidebar config)
```

## Routes

| Route | Description |
|-------|-------------|
| `/login` | Sign in |
| `/signup` | Create account |
| `/dashboard` | Dashboard overview |
| `/dashboard/products` | Products table (search, sort, filters, pagination) |
| `/dashboard/products/new` | Create product |
| `/dashboard/products/[id]` | Edit product |
| `/dashboard/categories` | Categories (create/edit via modal) |
| `/dashboard/inventory` | Inventory summary and stock table |
| `/dashboard/analytics` | Charts (by category, distribution, status) |
| `/dashboard/activity` | Activity log feed |

## Features

- **Auth:** Login/signup forms with validation; token stored in `localStorage`; Axios interceptor for `Authorization` and 401 redirect.
- **Products:** List with pagination, sort, search, status filter; create/edit forms with category and status; delete from row menu.
- **Categories:** Card grid; add/edit in modal with React Hook Form + Zod.
- **Inventory:** Summary cards and table with low-stock/out-of-stock badges.
- **Analytics:** Recharts for products by category, inventory distribution, product status.
- **Activity:** Feed of admin actions with user and timestamp.
- **UI:** Loading skeletons, error and empty states, toasts, breadcrumbs, collapsible sidebar, user menu.

## API integration

Services in `services/` call `lib/axios` (base URL from `NEXT_PUBLIC_API_URL`). Backend can return:

- List: `{ data: [], total }` or `{ items: [], meta: { total } }`
- Single: `{ data: {} }` or the entity object directly

The UI normalizes these shapes. Implement your backend and adjust service methods/params as needed.

## Building for production

```bash
npm run build
npm start
```
# Product-Management
# Product-Management
# Product-Management-Frontend
# Product-Management-Frontend
