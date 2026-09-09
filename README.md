# Corporate Travel Booking Tool — Prototype

A working prototype of a corporate travel platform: employee travel
requests → policy validation → rule-deviation handling → approval matrix →
budget control → payment → reporting/MIS → admin configuration.

Backend: **Django 5 + Django REST Framework + SimpleJWT**, MySQL (or SQLite
for a zero-setup demo). Frontend: **Next.js 14 (App Router) + TypeScript +
Tailwind CSS + Formik/Yup**. All data is mock/demo data seeded by a
management command — there is no real GDS/flight/hotel API integration
(the assignment explicitly allows this).

---

## 1. Architecture at a glance

```
┌─────────────────────┐        JSON over HTTPS         ┌──────────────────────┐
│   Next.js frontend   │  ───────────────────────────▶  │   Django REST API     │
│  (browser, JWT auth) │  ◀───────────────────────────  │  (apps/*, JWT auth)   │
└─────────────────────┘        Bearer <access_token>     └──────────┬───────────┘
                                                                     │
                                                          ┌──────────▼───────────┐
                                                          │  MySQL / SQLite       │
                                                          └───────────────────────┘
```

- The frontend is a pure SPA (client components) — it never talks to a
  database directly. Every screen goes through one file,
  `frontend/src/lib/api.ts`, which is the **global API client**.
- The backend is a standard Django project split into one app per module
  (see the table below). Business rules (policy check, approval-chain
  construction, budget debit/credit) live in small `services.py` files so
  they're testable independently of HTTP.
- Auth is stateless JWT (SimpleJWT): login returns an `access` + `refresh`
  token; the frontend stores them and sends `Authorization: Bearer <token>`
  on every request. RBAC is enforced **only** on the server
  (`core/permissions.py`) — the frontend's role-based nav/section hiding is
  a UX convenience, not a security boundary.

## 2. The 9 required modules, and where they live

| # | Module | Backend app | Frontend page(s) |
|---|--------|-------------|-------------------|
| 1 | Employee Mapping & Profile Management | `apps/accounts` (User + role + manager) and `apps/employees` (EmployeeProfile: grade, cost centre, documents) | `/admin/employees` |
| 2 | Travel Booking | `apps/bookings` (Booking, BookingItem) | `/bookings`, `/bookings/new`, `/bookings/[id]` |
| 3 | Budget Management | `apps/budget` (DepartmentBudget) | `/budget` |
| 4 | Travel Policy Configuration | `apps/policy` (TravelPolicy, per grade × trip type) | `/policy` |
| 5 | Rule Deviation / Out-of-Policy Management | Fields on `Booking` (`is_policy_violation`, `policy_violation_details`, `deviation_justification`) + `apps/bookings/services.check_policy_violation` | Shown inline on `/bookings/[id]`; register at `/reports` |
| 6 | Approval Matrix | `apps/approvals` (ApprovalMatrixRule, Approval) | `/approvals`, `/admin/approval-matrix` |
| 7 | Payment Methods | `apps/payments` (PaymentMethod, Payment) | `/payments` |
| 8 | Reporting & MIS | `apps/reports` (read-only aggregation views, no models of its own) | `/reports` |
| 9 | Admin/Configuration | Admin-only endpoints across `accounts`, `policy`, `budget`, `approvals`, `payments` (all gated by `IsAdmin` / `IsAdminOrFinanceOrReadOnly`) + Django admin at `/admin/` | `/admin/employees`, `/admin/approval-matrix`, plus admin-only write access on `/budget`, `/policy`, `/payments` |

## 3. Repository layout, file by file

```
corporate-travel-booking/
├── backend/
│   ├── manage.py                  Django CLI entry point
│   ├── requirements.txt           Python dependencies (Django, DRF, SimpleJWT, mysqlclient, ...)
│   ├── .env.example                All backend environment variables — copy to .env
│   ├── config/
│   │   ├── settings.py            Apps, DRF/JWT config, DB (MySQL/SQLite switch), CORS, security headers
│   │   ├── urls.py                Mounts every app's router under /api/...
│   │   ├── wsgi.py / asgi.py       Standard Django entry points
│   ├── core/
│   │   └── permissions.py         Shared RBAC classes used by every app (IsAdmin, IsFinance, IsApprover, ...)
│   └── apps/
│       ├── accounts/              Custom User model (role, employee_code, manager FK), JWT login/refresh/me,
│       │                          admin-only user CRUD, and the `seed_demo_data` management command
│       ├── employees/             EmployeeProfile (grade, cost centre, travel documents) — 1:1 with User
│       ├── policy/                TravelPolicy: entitlement caps per (grade, trip type)
│       ├── budget/                DepartmentBudget: allocated vs used amount per department/fiscal year
│       ├── bookings/               Booking + BookingItem models, services.py (policy check + budget debit/credit),
│       │                          views.py (submit/cancel actions that drive the whole workflow)
│       ├── approvals/              ApprovalMatrixRule (admin-configured chain), Approval (per-booking step),
│       │                          services.py (builds the chain on submit, resolves it on each decision)
│       ├── payments/               PaymentMethod, Payment — recording a payment marks the booking BOOKED
│       └── reports/                No models — four read-only aggregation endpoints (spend, funnel, violations, turnaround)
│
└── frontend/
    ├── package.json               next, react, formik, yup, tailwindcss — no heavier deps than that
    ├── tailwind.config.ts         Design tokens (colors, fonts) used across every page
    ├── .env.local.example         NEXT_PUBLIC_API_URL — copy to .env.local
    └── src/
        ├── lib/
        │   ├── api.ts             THE global API client. Every page calls apiGet/apiPost/apiPut/apiPatch/apiDelete
        │   │                      from here — nothing calls fetch() directly. Handles base URL, JSON headers,
        │   │                      GET retry+backoff, request timeout, and 401 → refresh-token → retry-once.
        │   ├── auth-tokens.ts     localStorage token storage + the refresh-token network call (kept separate
        │   │                      from api.ts to avoid a circular import between the two)
        │   ├── auth.tsx           AuthProvider/useAuth (login, logout, current user), RoleGuard component,
        │   │                      useRequireAuth() route guard hook
        │   └── format.ts          Currency/date formatting, status-pill colour map, role labels
        ├── types/index.ts         TypeScript interfaces mirroring every DRF serializer's JSON shape
        ├── components/
        │   ├── Sidebar.tsx        Left nav — items filtered per the signed-in user's role
        │   ├── Topbar.tsx         Page title + signed-in user + sign out
        │   └── StatusPill.tsx     Small coloured badge for booking status
        └── app/
            ├── layout.tsx / globals.css   Root layout, Tailwind base styles, design tokens
            ├── page.tsx                   "/" — redirects to /login or /dashboard
            ├── login/page.tsx             Formik+Yup login form, with one-click demo-account buttons
            └── (app)/                     Route group behind auth (layout.tsx renders Sidebar + guards the route)
                ├── layout.tsx             Auth guard + sidebar shell shared by every page below
                ├── dashboard/page.tsx     Role-aware summary (counts, pending approvals, recent trips)
                ├── bookings/page.tsx      All bookings the user can see, with a status filter
                ├── bookings/new/page.tsx  Formik+Yup booking form with a dynamic (FieldArray) item list
                ├── bookings/[id]/page.tsx Booking detail: items, policy-violation banner, approval timeline,
                │                          submit-for-approval (with justification), cancel
                ├── approvals/page.tsx     Approver inbox — approve/reject with a comment
                ├── budget/page.tsx        Department budgets with utilization bars + add/update form
                ├── policy/page.tsx        Travel policy table + add-rule form
                ├── payments/page.tsx      Payment history + record-a-payment form (approved bookings only)
                ├── reports/page.tsx       Spend by department, booking funnel, approval turnaround, violation register
                └── admin/
                    ├── employees/page.tsx         Employee directory + create-employee form (role, manager, grade)
                    └── approval-matrix/page.tsx   Configure the approver chain per amount band
```

## 4. RBAC — how roles actually gate access

Four roles: **EMPLOYEE, MANAGER, FINANCE, ADMIN** (`apps/accounts/models.py`).

- Every DRF view declares `permission_classes` from `core/permissions.py`
  (`IsAdmin`, `IsFinance`, `IsApprover`, `IsAdminOrFinanceOrReadOnly`,
  `IsOwnerOrApproverOrAdmin`). This is the **real** access control — it runs
  on every request regardless of what the frontend shows.
- Querysets are additionally scoped per role inside `get_queryset()` (e.g.
  `BookingViewSet` — an EMPLOYEE only ever sees their own bookings, a
  MANAGER sees their own + their direct reports', FINANCE/ADMIN see all).
- The frontend's `Sidebar.tsx` and `RoleGuard` component hide nav items and
  page sections per role purely for a clean UX — removing or bypassing them
  client-side cannot grant access to anything the backend wouldn't already
  allow, since the backend re-checks the role on every call.
- JWT tokens carry `role`, `name`, `employee_code` as custom claims
  (`RoleAwareTokenObtainPairSerializer`) so the frontend can render
  immediately after login without an extra round trip, but the frontend
  never trusts the claim for authorization — it only reads `/api/auth/me/`
  and lets every subsequent API call be independently authorized.

## 5. Business logic worth explaining in the interview

- **Policy check** (`apps/bookings/services.check_policy_violation`): looks
  up the `TravelPolicy` row matching the employee's grade + trip type, then
  compares each `BookingItem` against it (flight class rank, flight fare
  cap, hotel rate cap). Returns a human-readable reason string that's
  stored on the booking and shown to the employee, the approver, and in the
  MIS violations report.
- **Rule Deviation handling**: if `submit` detects a violation and the
  employee hasn't supplied `deviation_justification`, the API rejects the
  submit with a 400 and the violation detail — the frontend surfaces that
  as a required textbox before the employee can proceed. This mirrors how
  real travel tools force a documented reason for any out-of-policy spend.
- **Approval Matrix** (`apps/approvals.services.build_approval_chain`):
  Admin configures rows of `(level, min_amount, max_amount, approver_role,
  applies_to_violation_only)`. On submit, every matching rule becomes an
  `Approval` row; if the booking has no matching rule, it falls back to a
  single manager approval so nothing is silently unreviewed. An extra
  Finance level can be configured to fire **only** when the booking is
  flagged out-of-policy, regardless of amount — that's how "high-amount OR
  policy violation needs Finance" is expressed without special-casing it in
  code.
- **Approval resolution** (`apps/approvals.services.act_on_approval`): a
  rejection immediately closes the booking and marks any remaining pending
  steps `SKIPPED`; the last approval clears the booking to `APPROVED` and
  calls `apply_budget_delta(+1)` to consume department budget at that
  moment (not at booking-creation time, so a rejected/cancelled booking
  never touches budget).
- **Budget Management**: one `DepartmentBudget` row per
  `(department, fiscal_year)`; `used_amount` moves up on approval and back
  down on cancellation of a previously-approved booking
  (`apply_budget_delta(sign=-1)`), so the dashboard's remaining-budget
  number is always live, not a nightly batch job.
- **Payments**: only Finance/Admin can record a `Payment` against an
  `APPROVED` booking; doing so flips the booking to `BOOKED`. Card data is
  never stored — `PaymentMethod.masked_identifier` holds a display-only
  masked string, matching how a real implementation would keep PAN data
  out of scope entirely (tokenised via a PCI-compliant processor instead).

## 6. Running it locally

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                   # defaults to SQLite, no MySQL needed to demo
python manage.py migrate
python manage.py seed_demo_data                         # creates demo users + sample bookings
python manage.py runserver                              # http://localhost:8000
```

To point at MySQL instead of the bundled SQLite demo mode, create the
database and set in `.env`:

```
USE_SQLITE=False
DB_NAME=corporate_travel
DB_USER=travel_admin
DB_PASSWORD=...
DB_HOST=127.0.0.1
DB_PORT=3306
```

then re-run `migrate` and `seed_demo_data`.

**Demo accounts** (password for all: `Passw0rd!123`):

| Username | Role | Notes |
|---|---|---|
| `admin` | Admin | superuser, also has Django admin access at `/admin/` |
| `finance` | Finance | approves high-value/violation bookings, records payments |
| `karthik.mgr` | Manager | approves for the Engineering team |
| `divya.mgr` | Manager | approves for the Sales team |
| `vimal.emp` | Employee | Engineering, reports to `karthik.mgr` |
| `anitha.emp` | Employee | Engineering, has a pre-seeded out-of-policy booking pending approval |
| `rahul.emp` | Employee | Sales, has a pre-seeded booking already through its manager approval |

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local     # NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run dev                          # http://localhost:3000
```

Sign in with any demo account above (the login screen has one-click buttons
for each role).

## 7. Security notes

- Passwords are hashed with Django's PBKDF2 (default) — never stored in
  plaintext, never returned by any serializer.
- JWT access tokens are short-lived (30 min default) with rotating,
  blacklist-on-rotation refresh tokens (`rest_framework_simplejwt.token_blacklist`).
- Every write endpoint re-validates the acting user's role server-side
  (see §4) — the UI hiding a button is not the security boundary.
- CORS is locked to `CORS_ALLOWED_ORIGINS` (defaults to the local frontend
  origin only).
- `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, and
  HSTS are switched on automatically whenever `DJANGO_DEBUG=False`.
- DRF throttling is enabled by default (`anon: 20/min`, `user: 240/min`) to
  blunt brute-force/credential-stuffing attempts against `/api/auth/login/`.
- No real payment card data is ever persisted — see §5, Payments.

## 8. Key assumptions made

- One `TravelPolicy` row per `(grade, trip_type)` — a real system might
  layer city/region-specific caps on top; the model is intentionally simple
  to keep the demo legible.
- Fiscal year is computed as Apr–Mar (Indian FY convention) — trivial to
  change in `apps/bookings/services._current_fiscal_year`.
- "Advance booking days required" is captured on the policy but not yet
  enforced as a hard submit-time block (flagged as a natural production
  enhancement, see §9).
- A booking's estimated cost is the sum of its item costs × quantity,
  recomputed server-side on every save so the number shown can't drift from
  the underlying items.

## 9. Possible production enhancements

- Real GDS/OTA integration (flight/hotel search and live pricing) behind
  the same `BookingItem` shape, replacing the free-text `provider`/`details`
  fields with structured, provider-specific data.
- Enforce `advance_booking_days_required` and other soft policy fields as
  hard submit-time validations, not just informational caps.
- Move from JWT-in-localStorage to httpOnly cookies + short-lived access
  tokens for stronger XSS resistance.
- Async/queued email or Slack notifications on submit/approve/reject
  instead of relying on the approver to check the inbox page.
- Multi-currency support for international travel (the model currently
  assumes INR throughout).
- Audit log of every state transition (who changed what, when) as its own
  table, for a full MIS trail beyond the current status/timestamp fields.
- Real payment gateway/card-tokenisation integration instead of the
  masked-identifier placeholder.

---

*This is an interview take-home prototype built with mock data end-to-end,
per the assignment's own instructions. No real travel, payment, or
personal data is used anywhere in the seed data.*
