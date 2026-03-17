# Atomic Design Structure

- **atoms/** – Smallest UI elements (Button, Input, Label, Card, etc.). See `ui/` for implementations.
- **molecules/** – Combinations of atoms (FormInput, SearchBar, Pagination, etc.). See `shared/` for implementations.
- **organisms/** – Larger sections: auth views (LoginView, SignupView), and other full-screen or section-level components.
- **templates/** – Page-level layout shells (AuthTemplate, etc.).
- **layout/** – App layout pieces (Sidebar, Header, Breadcrumb, DashboardLayout).
- **ui/** – Primitive atoms (Radix-based components).
- **shared/** – Shared molecules and small composites.

**Page rule:** Route pages (e.g. `app/(auth)/login/page.js`) should only import and render a single component; all logic and UI live inside that component (e.g. `LoginView`).
