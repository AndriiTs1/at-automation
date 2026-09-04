# AT Automation

AT Automation is a modern B2B business operations platform designed to connect a company's workflows, data, approvals, automation, and management visibility in one unified system.

The platform is being built around a simple principle:

> **Your business. One system.**

AT Automation is intended to become the operational layer between employees, management, business processes, and the systems a company already uses.

---

## Product Vision

Companies often operate across multiple disconnected systems:

- CRM
- ERP
- accounting
- inventory and warehouse software
- email
- payments
- spreadsheets
- internal tools
- third-party services

AT Automation is designed to connect these systems and provide a unified operational workspace.

The platform is planned around the following areas:

- Command Center
- Operations
- Customers
- Inventory
- Finance
- Automations
- Integrations
- Reports
- Team & Approvals
- Ask AT

The long-term goal is a role-based B2B platform where employees work in dedicated operational workspaces while management receives a consolidated real-time view of the business.

---

## Current Status

The current version includes:

- Marketing landing page
- Executive Command Center
- Responsive desktop experience
- Multilingual interface
- Real locale routing
- Localized metadata
- Shared demo-data architecture
- Business KPI cards
- Needs Attention workflow
- Business Performance visualization
- Live Operations activity
- Approval queue
- Role-oriented navigation structure
- Functional language switcher

A dedicated tablet Command Center is currently in development.

A dedicated mobile Command Center, interactive demo application, operational modules, and backend functionality are planned for subsequent stages.

---

## Supported Languages

AT Automation currently supports six languages:

- English
- German
- Italian
- French
- Russian
- Ukrainian

English is the default locale.

Locale routing:

```text
/
 /de
 /it
 /fr
 /ru
 /uk
```

Localization is implemented using `next-intl`.

---

## Tech Stack

Current frontend stack:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- next-intl
- App Router
- Turbopack
- ESLint

Deployment target:

- Vercel

Package manager:

- npm

---

## Project Structure

```text
app/
  [locale]/
    layout.tsx
    page.tsx

components/
  Header.tsx

  dashboard/
    DemoDashboard.tsx
    DashboardSidebar.tsx
    DashboardTopbar.tsx
    KpiCard.tsx
    BusinessPerformance.tsx
    NeedsAttention.tsx
    LiveOperations.tsx
    ApprovalsPanel.tsx
    TabletFrame.tsx

i18n/
  navigation.ts
  request.ts
  routing.ts

lib/
  demo-data.ts

messages/
  en.json
  de.json
  it.json
  fr.json
  ru.json
  uk.json

public/

proxy.ts
next.config.ts
```

The structure will evolve as the interactive application and operational modules are introduced.

---

# Command Center

The Command Center is the executive management layer of AT Automation.

It is designed to answer four important questions quickly:

1. How is the business performing?
2. What currently requires attention?
3. What has the system already handled automatically?
4. Where is human approval or intervention required?

The Command Center is not intended to contain every operational detail.

Detailed work belongs inside dedicated AT modules, while the Command Center provides management with the most important business signals.

---

## Business KPIs

The current Command Center includes:

- Revenue
- Open Operations
- Cash Due
- Automated Today

Automation is presented as measurable business value, including estimated working time saved.

---

## Needs Attention

The Needs Attention section surfaces operational exceptions requiring awareness or action.

Examples include:

- overdue invoices
- low-stock items
- delayed operations
- failed automation runs

The goal is to surface problems instead of forcing managers to search for them manually.

---

## Business Performance

Business Performance provides a visual overview of important business indicators.

Current demo metrics include:

- Revenue
- Operations
- Profit

The visualization is implemented without an additional chart dependency.

---

## Live Operations

Live Operations demonstrates how AT Automation connects business events with system actions.

Example:

```text
Operation received
→ Inventory reserved
→ Invoice generated
→ Customer notified
```

Another example:

```text
Payment received
→ Invoice marked as paid
→ Finance status updated
```

This represents a core AT principle:

> Business events should trigger connected operational actions automatically.

---

## Approvals

Not every business action should be fully automated.

AT keeps humans in control where decisions require authorization.

Current approval examples include:

- purchase requests
- discount requests
- supplier payments

Future versions will connect approvals with roles, permissions, workflow rules, and audit history.

---

# Responsive Architecture

AT Automation does not treat tablet and mobile interfaces as simply scaled-down desktop layouts.

The product uses the same underlying:

- business data
- translations
- components
- business logic

while allowing different presentation layouts for different device categories.

---

## Desktop

Desktop provides the full Command Center workspace with permanent navigation and high information density.

The approved desktop experience is treated as the primary large-screen interface.

---

## Tablet

Tablet receives its own workspace composition optimized for available screen width and touch interaction.

The tablet interface is designed to prioritize:

1. Current business state
2. Problems requiring attention
3. Business performance
4. Current operational activity
5. Human approvals

The tablet experience is currently under development.

---

## Mobile

Mobile will receive a dedicated action-first Command Center.

The mobile experience will prioritize:

1. Business status
2. KPIs
3. Needs Attention
4. Approvals
5. Live Operations
6. Business Performance

Mobile will not simply reproduce the desktop sidebar and desktop card layout at a smaller size.

---

# Localization Architecture

Localization is implemented using `next-intl`.

Core localization files:

```text
i18n/routing.ts
i18n/navigation.ts
i18n/request.ts
messages/*.json
proxy.ts
```

The locale configuration uses:

```text
localePrefix: "as-needed"
```

English therefore remains available at:

```text
/
```

Other languages use locale-prefixed routes:

```text
/de
/it
/fr
/ru
/uk
```

Presentation text is localized while shared business identifiers and demo data remain consistent between languages.

Examples of intentionally shared data:

- AT Automation
- Alex Morgan
- Northstar Systems
- BluePeak Industries
- Sarah M.
- operation IDs
- invoice IDs
- CHF values
- KPI numbers

This prevents the application from maintaining separate business datasets for every language.

---

# Development

## Requirements

Install a current Node.js version compatible with Next.js 16.

Install project dependencies:

```bash
npm install
```

---

## Start Development Server

Run:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

The application will automatically reload during development.

---

## Available Commands

Development:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

TypeScript verification:

```bash
npx tsc --noEmit
```

Production build:

```bash
npm run build
```

Start the production build:

```bash
npm run start
```

---

# Quality Verification

Before production deployment or important Git commits, run:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

The application should also be checked for:

- horizontal overflow
- text clipping
- localization regressions
- missing translation messages
- hydration errors
- runtime errors
- React warnings
- missing assets

---

## Primary Viewport Testing

Desktop:

```text
1440 × 900
1280 × 800
```

Tablet:

```text
1024 × 768
834 × 1194
820 × 1180
810 × 1080
768 × 1024
```

Mobile:

```text
390 × 844
375 × 812
360 × 800
```

Long translations, particularly German, French, and Italian, should be included in responsive testing.

---

# Planned Application Architecture

The future AT application is planned around connected operational modules.

```text
AT Automation

├── Command Center
├── Operations
├── Customers
├── Inventory
├── Finance
├── Automations
├── Integrations
├── Reports
├── Team & Approvals
└── Ask AT
```

These modules are not intended to operate as isolated pages.

They will share business data and workflows.

---

# Connected Business Workflows

A core goal of AT Automation is to connect actions across business functions.

For example:

```text
Employee creates operation
        ↓
Inventory is reserved
        ↓
Invoice is generated
        ↓
Automation runs
        ↓
Customer is notified
        ↓
Management KPIs update
        ↓
Approval appears if required
```

Employees should not need to manually prepare reports for management.

Their normal work inside AT — or actions synchronized from connected external systems — should automatically update the management Command Center.

---

# Role-Based Workspaces

AT Automation is planned around role-based access and workspaces.

Different employees use the same platform but see the information and tools relevant to their responsibilities.

## Director / Management

```text
Command Center
KPIs
Business Performance
Exceptions
Approvals
Reports
```

## Sales

```text
Customers
Operations
Orders
Tasks
Customer activity
```

## Warehouse

```text
Inventory
Stock
Receiving
Shipments
Shortages
```

## Finance

```text
Invoices
Payments
Receivables
Cash flow
Financial exceptions
```

## Procurement

```text
Purchase requests
Suppliers
Purchase orders
Stock requirements
Approvals
```

This creates one platform with multiple role-based workspaces rather than separate disconnected applications.

---

# Integration Direction

AT Automation is not intended to recreate every ERP, CRM, accounting, warehouse, or payment system.

The stronger product direction is to act as an operational and automation layer connecting systems a company already uses.

Conceptually:

```text
Existing Business Systems

CRM
ERP
Accounting
Warehouse
E-commerce
Email
Payments
Internal Tools
Third-party Services

        ↓

AT Integration Layer

        ↓

Unified Business Data

        ↓

Workflow & Automation Engine

        ↓

Rules & Approvals

        ↓

Alerts & Exceptions

        ↓

Command Center
Role-Based Workspaces
Ask AT
```

External systems can eventually connect through:

- APIs
- webhooks
- integrations
- scheduled synchronization
- workflow triggers
- business rules

This allows existing systems to remain systems of record while AT provides a unified operational layer above them.

---

# Automation Direction

Automation is a core part of AT Automation.

Future workflows will follow a structure similar to:

```text
Trigger
→ Condition
→ Action
→ Result
```

Example:

```text
Invoice becomes overdue
→ Check payment status
→ Send reminder
→ Update Finance
→ Record automation run
→ Notify responsible employee if necessary
```

Automation history should provide visibility into:

- what happened
- when it happened
- what triggered it
- what AT did
- whether it succeeded
- whether human intervention is required

---

# Ask AT

Ask AT is planned as the AI layer of the platform.

The goal is not to build a disconnected chatbot.

Ask AT should understand operational data available inside the platform.

Example questions:

```text
Why did Cash Due increase?

Which operations are delayed?

Which invoices are overdue?

What requires my approval?

Which automations failed today?

Where are the largest operational risks?
```

Future versions may allow Ask AT to propose actions while respecting user permissions and approval policies.

---

# White-Label Direction

AT Automation is being designed with future white-label B2B deployment in mind.

A company may eventually receive its own:

- branding
- logo
- colors
- domain
- users
- roles
- modules
- workflows
- integrations
- approval policies

The objective is to maintain one AT core platform rather than creating separate codebases for every customer.

---

# Future Backend Direction

The future production architecture is expected to introduce:

- authentication
- organizations / tenants
- PostgreSQL
- role-based access control
- tenant isolation
- workflow state
- automation execution
- API layer
- webhooks
- integrations
- audit logs
- approval policies
- observability
- secure secrets management
- backups
- data retention controls

The exact backend architecture will be selected when development moves from the interactive product demo to the first production B2B implementation.

---

# Roadmap

Current development direction:

```text
Stage 1
Desktop foundation

Stage 2
Command Center

Stage 3
Localization
EN / DE / IT / FR / RU / UK

Stage 4
Tablet Command Center

Stage 5
Mobile Command Center

Stage 6
Final responsive and localization QA

Stage 7
Interactive /demo application

Stage 8
Operational modules

Stage 9
Role-based workspaces

Stage 10
Connected business workflows

Stage 11
Automation engine

Stage 12
Integrations

Stage 13
RBAC / Approvals / Audit Log

Stage 14
Ask AT AI layer

Stage 15
White-label architecture

Stage 16
Multi-tenant production backend
```

The roadmap may evolve as the product is validated with real B2B use cases.

---

# Deployment

The application is designed for deployment on Vercel.

Before deploying:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

All checks should complete successfully.

---

# Repository

GitHub repository:

```text
AndriiTs1/at-automation
```

Main branch:

```text
main
```

---

# Development Principles

The project follows several core principles:

1. Build and verify one stage at a time.
2. Keep approved layouts stable unless a concrete regression is discovered.
3. Share business data between responsive presentations.
4. Avoid unnecessary dependencies.
5. Keep localization architecture centralized.
6. Avoid per-customer code forks.
7. Prefer configuration-driven product architecture.
8. Keep automation observable.
9. Keep humans in control of sensitive business decisions.
10. Build AT as one connected operational system rather than a collection of unrelated dashboards.

---

# License

No public open-source license has been defined for this project.

All rights reserved.

© AT Automation
