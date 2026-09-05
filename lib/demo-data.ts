export const DEMO_USER = {
  name: "Alex Morgan",
  firstName: "Alex",
  initials: "AM",
} as const;

export const NAV_SECTIONS = [
  {
    key: "operate",
    items: [
      { key: "operations", icon: "activity", href: "/demo/operations", badge: "3", available: true },
      { key: "customers", icon: "users", href: "/demo/customers", available: true },
      { key: "inventory", icon: "box", href: "/demo/inventory", badge: "12" },
      { key: "finance", icon: "coins", href: "/demo/finance", badge: "4" },
    ],
  },
  {
    key: "automate",
    items: [
      { key: "automations", icon: "bolt", href: "/demo/automations" },
      { key: "integrations", icon: "plug", href: "/demo/integrations" },
    ],
  },
  {
    key: "manage",
    items: [
      { key: "reports", icon: "chart", href: "/demo/reports" },
      { key: "teamApprovals", icon: "users", href: "/demo/team" },
    ],
  },
] as const;

export const KPI_ITEMS = [
  { key: "revenue", value: "CHF 124,830", deltaKind: "percent", deltaValue: "+12.4%", tone: "success", icon: "chart" },
  { key: "openOperations", value: "248", deltaKind: "percent", deltaValue: "+8.1%", tone: "success", icon: "activity" },
  { key: "cashDue", value: "CHF 24,500", deltaKind: "overdue", deltaCount: 4, tone: "error", icon: "receipt" },
  { key: "automatedToday", value: "186", deltaKind: "saved", deltaHours: "14.2h", tone: "accent", icon: "bolt" },
] as const;

export const NEEDS_ATTENTION = [
  {
    key: "overdueInvoices",
    count: 4,
    amount: "CHF 18,400",
    deptKey: "finance",
    ownerKey: "financeTeam",
    noteKey: "reminderSentAutomatically",
    severity: "critical",
  },
  {
    key: "lowStockItems",
    count: 12,
    categories: 4,
    ownerKey: "procurement",
    noteKey: "purchaseRequired",
    severity: "warning",
  },
  {
    key: "operationDelayed",
    operationId: "#10342",
    days: 2,
    ownerName: "Sarah M.",
    noteKey: "supplierDelayDetected",
    severity: "warning",
  },
  {
    key: "automationRunsFailed",
    count: 2,
    ownerKey: "operations",
    noteKey: "reviewRequired",
    severity: "critical",
  },
] as const;

export const LIVE_OPERATIONS = [
  {
    time: "10:42",
    titleKey: "operationReceived",
    titleParams: { id: "#10348" },
    steps: [{ key: "inventoryReserved" }, { key: "invoiceGenerated" }, { key: "customerNotified" }],
  },
  {
    time: "10:38",
    titleKey: "paymentReceived",
    titleParams: { amount: "CHF 8,450", company: "Northstar Systems" },
    steps: [{ key: "invoiceMarkedPaid", params: { id: "#849" } }],
  },
  {
    time: "10:31",
    titleKey: "stockBelowThreshold",
    titleParams: { product: "Industrial Sensor A" },
    steps: [{ key: "purchaseRequestCreated" }, { key: "procurementNotified" }],
  },
  {
    time: "10:28",
    titleKey: "customerOnboarded",
    titleParams: { company: "BluePeak Industries" },
    steps: [{ key: "accountCreated" }, { key: "welcomeWorkflowCompleted" }],
  },
] as const;

export const APPROVALS = [
  { key: "purchaseRequest", amount: "CHF 18,400", requesterName: "Sarah M.", deptKey: "procurement" },
  { key: "discountRequest", amount: "12%", deptKey: "salesTeam" },
  { key: "supplierPayment", amount: "CHF 24,800", deptKey: "finance" },
] as const;

export const CHART_DATES = ["1 Nov", "5 Nov", "10 Nov", "15 Nov", "20 Nov", "25 Nov", "30 Nov"] as const;

export const CHART_SERIES = {
  revenue: "50,110 155,95 260,99 365,73 470,58 575,35 680,16",
  operations: "50,129 155,121 260,125 365,110 470,103 575,91 680,73",
  profit: "50,155 155,151 260,153 365,144 470,140 575,133 680,118",
} as const;

export const CHART_TOOLTIP = {
  date: "25 Nov",
  value: "CHF 72K",
} as const;

export const OPERATIONS_SUMMARY = {
  active: "248",
  needsAttention: "12",
  completedToday: "34",
  totalValue: "CHF 482,300",
} as const;

/** Canonical order-to-fulfillment sequence used by the Operations detail panel's workflow view. */
export const WORKFLOW_STEP_KEYS = [
  "orderReceived",
  "supplierConfirmed",
  "inventoryReserved",
  "invoiceIssued",
  "paymentReceived",
  "preparingShipment",
  "customerNotified",
] as const;

export type OperationActivityEntry = {
  time: string;
  key: string;
  params?: Record<string, string>;
};

export type OperationStatus = "inProgress" | "waiting" | "attention" | "completed";

export type OperationRow = {
  id: string;
  /** Stable relational key into CUSTOMERS_ROWS — see getOperationsForCustomer. */
  customerId: string;
  customer: string;
  status: OperationStatus;
  stage: (typeof WORKFLOW_STEP_KEYS)[number] | "awaitingApproval" | "readyToShip";
  owner: string;
  value: string;
  updated: string;
  created: string;
  invoice: string | null;
  paymentStatus: "paid" | "pending" | "overdue";
  inventoryStatus: "reserved" | "available" | "backordered";
  /** Index into WORKFLOW_STEP_KEYS marking the operation's current/blocking step. */
  workflowStepIndex: number;
  activity: OperationActivityEntry[];
};

export const OPERATIONS_ROWS: OperationRow[] = [
  {
    id: "#10348",
    customerId: "CUS-1048",
    customer: "Northstar Systems",
    status: "inProgress",
    stage: "inventoryReserved",
    owner: "Sarah M.",
    value: "CHF 8,450",
    updated: "10:42",
    created: "09:58",
    invoice: null,
    paymentStatus: "pending",
    inventoryStatus: "reserved",
    workflowStepIndex: 2,
    activity: [
      { time: "09:58", key: "received" },
      { time: "10:15", key: "supplierConfirmed" },
      { time: "10:42", key: "inventoryReserved" },
    ],
  },
  {
    id: "#10347",
    customerId: "CUS-1047",
    customer: "BluePeak Industries",
    status: "completed",
    stage: "readyToShip",
    owner: "Marc T.",
    value: "CHF 12,900",
    updated: "09:58",
    created: "08:40",
    invoice: "#1042",
    paymentStatus: "paid",
    inventoryStatus: "reserved",
    workflowStepIndex: 6,
    activity: [
      { time: "08:40", key: "received" },
      { time: "09:20", key: "inventoryReserved" },
      { time: "09:50", key: "paymentConfirmed" },
      { time: "09:58", key: "customerNotified" },
    ],
  },
  {
    id: "#10346",
    customerId: "CUS-1046",
    customer: "Alpine Works",
    status: "waiting",
    stage: "awaitingApproval",
    owner: "Sarah M.",
    value: "CHF 4,200",
    updated: "09:40",
    created: "08:50",
    invoice: "#1043",
    paymentStatus: "pending",
    inventoryStatus: "reserved",
    workflowStepIndex: 4,
    activity: [
      { time: "08:50", key: "received" },
      { time: "09:05", key: "inventoryReserved" },
      { time: "09:20", key: "invoiceGenerated", params: { invoice: "#1043" } },
      { time: "09:40", key: "awaitingCustomer" },
    ],
  },
  {
    id: "#10345",
    customerId: "CUS-1045",
    customer: "Meridian Labs",
    status: "attention",
    stage: "supplierConfirmed",
    owner: "Jonas R.",
    value: "CHF 21,600",
    updated: "09:15",
    created: "08:20",
    invoice: null,
    paymentStatus: "pending",
    inventoryStatus: "backordered",
    workflowStepIndex: 1,
    activity: [
      { time: "08:20", key: "received" },
      { time: "09:15", key: "supplierDelay" },
    ],
  },
  {
    id: "#10344",
    customerId: "CUS-1048",
    customer: "Northstar Systems",
    status: "inProgress",
    stage: "invoiceIssued",
    owner: "Marc T.",
    value: "CHF 6,750",
    updated: "08:52",
    created: "07:50",
    invoice: "#1044",
    paymentStatus: "pending",
    inventoryStatus: "reserved",
    workflowStepIndex: 3,
    activity: [
      { time: "07:50", key: "received" },
      { time: "08:10", key: "inventoryReserved" },
      { time: "08:30", key: "supplierConfirmed" },
      { time: "08:52", key: "invoiceGenerated", params: { invoice: "#1044" } },
    ],
  },
  {
    id: "#10343",
    customerId: "CUS-1044",
    customer: "Solterra Group",
    status: "completed",
    stage: "readyToShip",
    owner: "Sarah M.",
    value: "CHF 15,300",
    updated: "08:30",
    created: "07:00",
    invoice: "#1045",
    paymentStatus: "paid",
    inventoryStatus: "reserved",
    workflowStepIndex: 6,
    activity: [
      { time: "07:00", key: "received" },
      { time: "07:40", key: "inventoryReserved" },
      { time: "08:00", key: "paymentConfirmed" },
      { time: "08:30", key: "customerNotified" },
    ],
  },
  {
    id: "#10342",
    customerId: "CUS-1047",
    customer: "BluePeak Industries",
    status: "attention",
    stage: "supplierConfirmed",
    owner: "Jonas R.",
    value: "CHF 9,100",
    updated: "08:05",
    created: "07:15",
    invoice: null,
    paymentStatus: "pending",
    inventoryStatus: "backordered",
    workflowStepIndex: 1,
    activity: [
      { time: "07:15", key: "received" },
      { time: "07:45", key: "inventoryReserved" },
      { time: "08:05", key: "supplierDelay" },
    ],
  },
  {
    id: "#10341",
    customerId: "CUS-1046",
    customer: "Alpine Works",
    status: "waiting",
    stage: "customerNotified",
    owner: "Marc T.",
    value: "CHF 3,480",
    updated: "07:44",
    created: "07:00",
    invoice: "#1046",
    paymentStatus: "paid",
    inventoryStatus: "reserved",
    workflowStepIndex: 6,
    activity: [
      { time: "07:00", key: "received" },
      { time: "07:20", key: "inventoryReserved" },
      { time: "07:44", key: "awaitingCustomer" },
    ],
  },
  {
    id: "#10340",
    customerId: "CUS-1045",
    customer: "Meridian Labs",
    status: "inProgress",
    stage: "orderReceived",
    owner: "Sarah M.",
    value: "CHF 18,900",
    updated: "07:20",
    created: "07:20",
    invoice: null,
    paymentStatus: "pending",
    inventoryStatus: "available",
    workflowStepIndex: 0,
    activity: [{ time: "07:20", key: "received" }],
  },
];

/** Unique owners represented in OPERATIONS_ROWS, in first-appearance order — feeds the Operations owner filter. */
export const OPERATION_OWNERS = Array.from(new Set(OPERATIONS_ROWS.map((row) => row.owner)));

/**
 * Operations belonging to a customer, linked via the stable customerId (not name matching).
 * Open (non-completed) operations are surfaced first; sort is stable so relative order within
 * each group matches OPERATIONS_ROWS.
 */
export function getOperationsForCustomer(customerId: string): OperationRow[] {
  const rows = OPERATIONS_ROWS.filter((row) => row.customerId === customerId);
  return [...rows].sort((a, b) => {
    const aOpen = a.status !== "completed" ? 0 : 1;
    const bOpen = b.status !== "completed" ? 0 : 1;
    return aOpen - bOpen;
  });
}

export type CustomerActivityEntry = OperationActivityEntry & { operationId: string };

/**
 * Recent account activity for a customer, derived from its linked operations' own activity
 * logs (single-source reuse — no separate customer-activity dataset). Merged across
 * operations and sorted most-recent-first by the shared "HH:MM" time convention.
 */
export function getCustomerActivity(customerId: string, limit = 5): CustomerActivityEntry[] {
  const entries: CustomerActivityEntry[] = getOperationsForCustomer(customerId).flatMap((operation) =>
    operation.activity.map((entry) => ({ ...entry, operationId: operation.id })),
  );
  return entries.sort((a, b) => (a.time < b.time ? 1 : a.time > b.time ? -1 : 0)).slice(0, limit);
}

export const CUSTOMERS_SUMMARY = {
  totalCustomers: "128",
  activeAccounts: "94",
  needsAttention: "7",
  outstanding: "CHF 86,400",
} as const;

export type CustomerSegment = "keyAccount" | "standard" | "new";
export type CustomerHealth = "healthy" | "watch" | "atRisk";

/**
 * "today"/"yesterday" carry only a time and are localized via Dashboard.Customers.relativeTime;
 * "date" carries a fixed, untranslated day/month label (same convention as CHART_DATES) plus a time.
 */
export type CustomerLastActivity =
  | { kind: "today" | "yesterday"; time: string }
  | { kind: "date"; date: string; time: string };

export type CustomerRow = {
  id: string;
  name: string;
  segment: CustomerSegment;
  health: CustomerHealth;
  /** Count of that customer's OPERATIONS_ROWS entries with status !== "completed". */
  openOperations: number;
  revenue: string;
  outstanding: string;
  owner: string;
  lastActivity: CustomerLastActivity;
};

/**
 * Representative sample of the fictional Customers universe sized by CUSTOMERS_SUMMARY
 * (128 total customers) — mirrors how OPERATIONS_ROWS is a sample of OPERATIONS_SUMMARY's
 * totals. Where a customer also appears in OPERATIONS_ROWS, openOperations matches that
 * customer's count of non-completed operations there, and owner reflects whoever owns
 * their current open operation (or their most recent operation if none are open).
 */
export const CUSTOMERS_ROWS: CustomerRow[] = [
  {
    id: "CUS-1048",
    name: "Northstar Systems",
    segment: "keyAccount",
    health: "healthy",
    openOperations: 2,
    revenue: "CHF 184,200",
    outstanding: "CHF 0",
    owner: "Sarah M.",
    lastActivity: { kind: "today", time: "10:42" },
  },
  {
    id: "CUS-1047",
    name: "BluePeak Industries",
    segment: "keyAccount",
    health: "watch",
    openOperations: 1,
    revenue: "CHF 142,800",
    outstanding: "CHF 9,100",
    owner: "Jonas R.",
    lastActivity: { kind: "today", time: "08:05" },
  },
  {
    id: "CUS-1046",
    name: "Alpine Works",
    segment: "standard",
    health: "watch",
    openOperations: 2,
    revenue: "CHF 42,500",
    outstanding: "CHF 4,200",
    owner: "Sarah M.",
    lastActivity: { kind: "today", time: "09:40" },
  },
  {
    id: "CUS-1045",
    name: "Meridian Labs",
    segment: "standard",
    health: "atRisk",
    openOperations: 2,
    revenue: "CHF 96,800",
    outstanding: "CHF 21,600",
    owner: "Jonas R.",
    lastActivity: { kind: "today", time: "09:15" },
  },
  {
    id: "CUS-1044",
    name: "Solterra Group",
    segment: "standard",
    health: "healthy",
    openOperations: 0,
    revenue: "CHF 78,300",
    outstanding: "CHF 0",
    owner: "Sarah M.",
    lastActivity: { kind: "yesterday", time: "16:20" },
  },
  {
    id: "CUS-1043",
    name: "Vantage Freight Co.",
    segment: "keyAccount",
    health: "healthy",
    openOperations: 0,
    revenue: "CHF 156,400",
    outstanding: "CHF 0",
    owner: "Marc T.",
    lastActivity: { kind: "yesterday", time: "11:15" },
  },
  {
    id: "CUS-1042",
    name: "Cobalt Materials",
    segment: "standard",
    health: "watch",
    openOperations: 0,
    revenue: "CHF 58,900",
    outstanding: "CHF 12,300",
    owner: "Marc T.",
    lastActivity: { kind: "date", date: "2 Sep", time: "09:30" },
  },
  {
    id: "CUS-1041",
    name: "Harborline Logistics",
    segment: "standard",
    health: "healthy",
    openOperations: 0,
    revenue: "CHF 34,600",
    outstanding: "CHF 0",
    owner: "Sarah M.",
    lastActivity: { kind: "date", date: "1 Sep", time: "15:50" },
  },
  {
    id: "CUS-1040",
    name: "Fjordlight Energy",
    segment: "new",
    health: "healthy",
    openOperations: 0,
    revenue: "CHF 18,000",
    outstanding: "CHF 0",
    owner: "Marc T.",
    lastActivity: { kind: "yesterday", time: "09:05" },
  },
  {
    id: "CUS-1039",
    name: "Crestwood Manufacturing",
    segment: "new",
    health: "atRisk",
    openOperations: 0,
    revenue: "CHF 9,600",
    outstanding: "CHF 6,400",
    owner: "Jonas R.",
    lastActivity: { kind: "date", date: "28 Aug", time: "13:20" },
  },
];

/** All CustomerSegment values represented in CUSTOMERS_ROWS — feeds the Customers segment filter. */
export const CUSTOMER_SEGMENTS: CustomerSegment[] = ["keyAccount", "standard", "new"];

/** All CustomerHealth values represented in CUSTOMERS_ROWS — feeds the Customers health filter. */
export const CUSTOMER_HEALTH_OPTIONS: CustomerHealth[] = ["healthy", "watch", "atRisk"];
