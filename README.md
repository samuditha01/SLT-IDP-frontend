# SLT-IDP — Developer Portal Frontend (Member 5)

A React app with 4 pages that talk to your backend (`developer-portal.zip`).

## Pages

| Page | Route | What it does |
|---|---|---|
| Portal Dashboard | `/` | Lists all your registered apps as cards |
| Create App Wizard | `/create` | Registers a new OAuth app, shows credentials once |
| App Details | `/apps/:id` | View/edit an app, rotate secret, delete |
| Analytics | `/apps/:id/analytics` | Basic token metrics for the app |

## How to Run It

1. Make sure the **backend** (`developer-portal.zip`) is already running on
   `http://localhost:4000` — this frontend calls it directly.

2. Copy the env file:
   ```
   cp .env.example .env
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the dev server:
   ```
   npm start
   ```
   This opens `http://localhost:3000` in your browser.

5. Since login isn't built yet, put a test token in your browser console so
   API calls are authenticated:
   ```js
   localStorage.setItem('devToken', 'PASTE_YOUR_TEST_JWT_HERE')
   ```
   (Generate the JWT the same way described in the backend's README.)

## How It's Wired Together

```
CreateAppWizard.jsx ──► services/developerService.js ──► Backend API (:4000)
AppDetails.jsx      ──►            (axios)             ──► MongoDB
PortalDashboard.jsx ──►
```

All the API calls live in one file: `src/services/developerService.js`.
If an endpoint URL ever changes on the backend, you only need to update it
in that one place.

## What's Left for You to Build

- [ ] Replace the manual `localStorage.setItem('devToken', ...)` step with
      a real login flow once the Auth module (Project Lead) is ready
- [ ] Add a logo upload field to Create App Wizard (`logoUri`)
- [ ] Add charts to the Analytics page (recommend `recharts`) once the
      backend analytics endpoint returns real data
- [ ] Add form validation messages that match the backend's Joi errors
      more precisely (currently shows the raw error string)

## Notes for a Beginner

- This uses **React Router v6** — `<Outlet />` in `Sidebar.jsx` is where
  each page renders inside the shared sidebar layout.
- All styling is plain CSS in `src/styles/global.css` — no framework, so
  it's easy to read and tweak color values at the top (`:root` variables).
- The client secret is only ever shown right after creation or rotation —
  don't try to "fetch" it again later, the backend never sends it back.
