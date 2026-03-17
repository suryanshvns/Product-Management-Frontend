# API Integration Checklist

All backend APIs from the cURL reference are integrated in the frontend as follows.

## 1. API layer (`lib/api.js`)

| # | Method | Path | In `lib/api.js` | Used in UI |
|---|--------|------|-----------------|------------|
| 1 | GET | /health | `healthApi.health()` | — |
| 2 | GET | /ping | `healthApi.ping()` | — |
| 3 | POST | /auth/signup | `authApi.signup(body)` | LoginView → `post('/auth/signup')` |
| 4 | POST | /auth/login | `authApi.login(body)` | LoginView → `post('/auth/login')` |
| 5 | POST | /auth/logout | `authApi.logout(body)` | Dashboard layout → `post('/auth/logout')` |
| 6 | GET | /auth/me | `authApi.me()` | AuthContext, Profile → `get('/auth/me')` |
| 7 | POST | /auth/refresh-token | `authApi.refreshToken(body)` | apiClient interceptor |
| 8 | GET | /users | `usersApi.list(params)` | Users list page |
| 9 | GET | /users/:id | `usersApi.getById(id)` | User edit page |
| 10 | PATCH | /users/:id | `usersApi.update(id, body)` | User edit page |
| 11 | GET | /roles | `rolesApi.list()` | User edit (role assign/revoke) |
| 12 | POST | /roles/users/:userId/roles | `rolesApi.assign(userId, roleId)` | User edit |
| 13 | DELETE | /roles/users/.../roles/:roleId | `rolesApi.revoke(userId, roleId)` | User edit |
| 14–24 | Products | various | `productsApi.*` | Products table, edit, images, bulk |
| 25–29 | Categories | various | `categoriesApi.*` | Categories list page |
| 30–33 | Analytics | various | `analyticsApi.*` | Dashboard, Analytics page |
| 34–37 | Orders | various | `ordersApi.*` | Orders list page |
| 38–42 | Organizations | various | `organizationsApi.*` | Organizations list page |
| 43 | GET | /logs | `logsApi.list(params)` | Logs page |
| 44 | GET | /notifications | `notificationsApi.list(params)` | Notifications page |
| 45 | PATCH | /notifications/:id/read | `notificationsApi.markRead(id)` | API only (UI can add “Mark read”) |
| 46 | POST | /notifications/read-all | `notificationsApi.markAllRead()` | API only (UI can add button) |
| 47–51 | Alert rules | various | `alertRulesApi.*` | Alert rules list (create/update/delete in API) |
| 52–54 | Reports | various | `reportsApi.*` | Reports page; export in API |
| 55 | GET | /dashboard/summary | `dashboardApi.summary()` | Dashboard (optional) |
| 56–58 | Settings | various | `settingsApi.*` | Settings page |
| 59–61 | API keys | various | `apiKeysApi.*` | Settings → API keys tab (revoke in API) |
| 62–66 | Webhooks | various | `webhooksApi.*` | Settings → Webhooks tab |
| 67 | POST | /bulk/import/products | `bulkApi.importProducts(body)` | Products → Bulk import |

## 2. Auth

Auth is currently called via `post()` / `get()` from `lib/apiClient` in components (LoginView, SignupView, dashboard layout, AuthContext, profile). The same endpoints are also exposed as `authApi` in `lib/api.js` for consistency.

## 3. UI coverage

- **Full UI:** Users, Products, Categories, Orders, Organizations, Logs, Notifications (list), Alert rules (list), Reports (sales/inventory), Settings (list + update, API keys create/list, Webhooks create/list), Bulk import products.
- **API only (no or minimal UI):** Health/ping, single order get, organization get/members, notification mark read/read-all, alert rule create/update/delete, report export products, dashboard summary, single setting get, API key revoke, webhook get/update/delete. These can be wired into UI when needed.

## 4. Summary

All **67** endpoints from the cURL reference have a corresponding method in `lib/api.js`. Auth, users, products, categories, analytics, orders, organizations, logs, notifications, alert rules, reports, settings, API keys, webhooks, and bulk import are used by existing pages or hooks. The rest are available in the API layer for future UI (e.g. “Mark read” on notifications, “Export CSV” on reports, revoke API key, edit/delete webhook).
