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
      { key: "inventory", icon: "box", href: "/demo/inventory", badge: "12", available: true },
      { key: "finance", icon: "coins", href: "/demo/finance", badge: "4", available: true },
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
    amount: "CHF 24,500",
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

export type InventoryStatus = "healthy" | "low" | "critical" | "outOfStock";

/**
 * "today"/"yesterday" carry only a time and are localized via Dashboard.Inventory.relativeTime;
 * "date" carries a fixed, untranslated day/month label (same convention as CustomerLastActivity)
 * plus a time. Kept as Inventory's own type (rather than reusing CustomerLastActivity) so this
 * module stays independent of Customers' internals.
 */
export type InventoryUpdated =
  | { kind: "today" | "yesterday"; time: string }
  | { kind: "date"; date: string; time: string };

export type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  category: string;
  status: InventoryStatus;
  onHand: number;
  reserved: number;
  reorderPoint: number;
  location: string;
  /** CHF per unit — the table derives its Value column as onHand × unitValue, never a stored total. */
  unitValue: number;
  updated: InventoryUpdated;
};

/**
 * Units free to promise, derived from onHand/reserved rather than stored — guarantees the
 * invariant (available = onHand - reserved, never negative) can't drift out of sync with a
 * hand-authored row. Reserved is constructed to never exceed onHand in INVENTORY_ROWS below.
 */
export function getAvailableUnits(item: InventoryItem): number {
  return Math.max(0, item.onHand - item.reserved);
}

/**
 * Representative sample of the fictional Inventory universe sized by INVENTORY_SUMMARY
 * (142 total items) — mirrors how CUSTOMERS_ROWS/OPERATIONS_ROWS sample their own larger
 * totals. Status is derived from how available (onHand - reserved) compares to reorderPoint,
 * not chosen arbitrarily:
 *   - outOfStock: available is 0
 *   - critical: available is well below reorderPoint
 *   - low: available is at or just below reorderPoint
 *   - healthy: available comfortably clears reorderPoint
 * "Industrial Sensor A" deliberately echoes the Command Center's existing "Stock below
 * threshold" activity entry (10:31) — same fictional item, same moment, consistent story.
 */
export const INVENTORY_ROWS: InventoryItem[] = [
  {
    id: "INV-2048",
    sku: "INV-2048",
    name: "Industrial Sensor A",
    category: "Sensors",
    status: "critical",
    onHand: 10,
    reserved: 2,
    reorderPoint: 20,
    location: "Warehouse A",
    unitValue: 46,
    updated: { kind: "today", time: "10:31" },
  },
  {
    id: "INV-2047",
    sku: "INV-2047",
    name: "Control Module X2",
    category: "Controls",
    status: "healthy",
    onHand: 54,
    reserved: 10,
    reorderPoint: 15,
    location: "Warehouse A",
    unitValue: 128,
    updated: { kind: "today", time: "09:50" },
  },
  {
    id: "INV-2046",
    sku: "INV-2046",
    name: "Precision Valve 40mm",
    category: "Valves",
    status: "low",
    onHand: 22,
    reserved: 6,
    reorderPoint: 18,
    location: "Zone A-03",
    unitValue: 64,
    updated: { kind: "today", time: "09:12" },
  },
  {
    id: "INV-2045",
    sku: "INV-2045",
    name: "Drive Motor M8",
    category: "Motors",
    status: "outOfStock",
    onHand: 8,
    reserved: 8,
    reorderPoint: 10,
    location: "Warehouse B",
    unitValue: 310,
    updated: { kind: "yesterday", time: "16:40" },
  },
  {
    id: "INV-2044",
    sku: "INV-2044",
    name: "Safety Relay S4",
    category: "Safety",
    status: "healthy",
    onHand: 96,
    reserved: 20,
    reorderPoint: 25,
    location: "Zone B-12",
    unitValue: 18,
    updated: { kind: "today", time: "08:15" },
  },
  {
    id: "INV-2043",
    sku: "INV-2043",
    name: "Steel Housing H12",
    category: "Fabrication",
    status: "low",
    onHand: 34,
    reserved: 6,
    reorderPoint: 30,
    location: "Zone A-03",
    unitValue: 54,
    updated: { kind: "yesterday", time: "14:05" },
  },
  {
    id: "INV-2042",
    sku: "INV-2042",
    name: "Power Supply 24V",
    category: "Electrical",
    status: "healthy",
    onHand: 120,
    reserved: 18,
    reorderPoint: 25,
    location: "Warehouse A",
    unitValue: 22,
    updated: { kind: "today", time: "07:55" },
  },
  {
    id: "INV-2041",
    sku: "INV-2041",
    name: "Conveyor Belt Kit",
    category: "Material handling",
    status: "healthy",
    onHand: 14,
    reserved: 2,
    reorderPoint: 8,
    location: "Warehouse B",
    unitValue: 240,
    updated: { kind: "date", date: "2 Sep", time: "11:20" },
  },
  {
    id: "INV-2040",
    sku: "INV-2040",
    name: "Thermal Probe T8",
    category: "Sensors",
    status: "healthy",
    onHand: 30,
    // Deliberately the one zero-reservation item (Stage 2D.2) — every other row already has an
    // active reservation, and Inventory Detail must demonstrably handle the "no current demand"
    // case cleanly rather than only ever showing populated reservation lists.
    reserved: 0,
    reorderPoint: 12,
    location: "Zone B-12",
    unitValue: 38,
    updated: { kind: "yesterday", time: "10:05" },
  },
  {
    id: "INV-2039",
    sku: "INV-2039",
    name: "Packaging Unit P6",
    category: "Packaging",
    status: "healthy",
    onHand: 60,
    reserved: 10,
    reorderPoint: 20,
    location: "Warehouse A",
    unitValue: 9,
    updated: { kind: "date", date: "1 Sep", time: "09:40" },
  },
];

/** All InventoryStatus values — feeds the Inventory status filter (Stage 2D.3). */
export const INVENTORY_STATUSES: InventoryStatus[] = ["healthy", "low", "critical", "outOfStock"];

/**
 * Unique locations represented in INVENTORY_ROWS, in first-appearance order — feeds the
 * Inventory location filter (Stage 2D.3). Mirrors OPERATION_OWNERS' derivation: never
 * hardcoded, so a future data change can't silently drift out of sync with the filter options.
 */
export const INVENTORY_LOCATIONS = Array.from(new Set(INVENTORY_ROWS.map((item) => item.location)));

/**
 * Page-level Inventory KPIs — represent the wider ~142-item company inventory, not a sum of
 * INVENTORY_ROWS' own 10-row sample (same relationship as CUSTOMERS_SUMMARY to CUSTOMERS_ROWS).
 * lowStock (12) deliberately matches the Command Center's existing "12 low-stock items" —
 * same fictional fact, told consistently in both places.
 */
export const INVENTORY_SUMMARY = {
  totalItems: "142",
  lowStock: "12",
  reservedUnits: "216",
  inventoryValue: "CHF 248,600",
} as const;

export type ReservationStatus = "active" | "released";

/**
 * A dedicated many-to-many relation between InventoryItem and OperationRow (Stage 2D.2) — one
 * operation can reserve several inventory items, and one inventory item can be reserved across
 * several operations, so this can't be a single inventoryItemId field on OperationRow. Deliberately
 * carries only the relation's own facts (id, which item, which operation, how many units, whether
 * the reservation is still active); everything else (customer, operation status/stage/value, item
 * name) is always resolved live from CUSTOMERS_ROWS/OPERATIONS_ROWS/INVENTORY_ROWS via
 * getReservationsForItem below, never duplicated onto the reservation record itself.
 *
 * `status` has room for "released" (e.g. a completed operation whose reservation was fulfilled
 * and no longer holds stock) even though every record below is currently "active" — none of the
 * operations linked here are done yet, so there is nothing to release in this sample.
 */
export type InventoryReservation = {
  id: string;
  inventoryItemId: string;
  operationId: string;
  quantity: number;
  status: ReservationStatus;
};

/**
 * Active reservations, constructed so that for every INVENTORY_ROWS item with reserved > 0, the
 * sum of its active reservation quantities equals that item's `reserved` field exactly (verified
 * programmatically — see the Stage 2D.2 QA report). Only non-completed OPERATIONS_ROWS entries
 * are used as active reservations' operationId, since a completed operation has already shipped
 * rather than still holding reserved stock.
 *
 * Industrial Sensor A → #10348 is the anchor relation: it's the same fictional moment already
 * referenced by the Command Center's "Stock below threshold — Industrial Sensor A" activity entry
 * and by #10348's own "inventoryReserved" stage/activity step — one fact, told consistently
 * across three places instead of three unrelated ones.
 */
export const INVENTORY_RESERVATIONS: InventoryReservation[] = [
  { id: "RES-1", inventoryItemId: "INV-2048", operationId: "#10348", quantity: 2, status: "active" },
  { id: "RES-2", inventoryItemId: "INV-2047", operationId: "#10346", quantity: 6, status: "active" },
  { id: "RES-3", inventoryItemId: "INV-2047", operationId: "#10345", quantity: 4, status: "active" },
  { id: "RES-4", inventoryItemId: "INV-2046", operationId: "#10344", quantity: 6, status: "active" },
  { id: "RES-5", inventoryItemId: "INV-2045", operationId: "#10342", quantity: 8, status: "active" },
  { id: "RES-6", inventoryItemId: "INV-2044", operationId: "#10340", quantity: 12, status: "active" },
  { id: "RES-7", inventoryItemId: "INV-2044", operationId: "#10341", quantity: 8, status: "active" },
  { id: "RES-8", inventoryItemId: "INV-2043", operationId: "#10346", quantity: 6, status: "active" },
  { id: "RES-9", inventoryItemId: "INV-2042", operationId: "#10348", quantity: 10, status: "active" },
  { id: "RES-10", inventoryItemId: "INV-2042", operationId: "#10344", quantity: 8, status: "active" },
  { id: "RES-11", inventoryItemId: "INV-2041", operationId: "#10345", quantity: 2, status: "active" },
  { id: "RES-12", inventoryItemId: "INV-2039", operationId: "#10340", quantity: 10, status: "active" },
];

/**
 * Active reservations for one inventory item, each paired with its real linked Operation
 * (resolved from OPERATIONS_ROWS by id — never a duplicated copy). A reservation whose
 * operationId doesn't resolve is dropped rather than rendered with missing data; every id in
 * INVENTORY_RESERVATIONS above resolves in practice.
 */
export function getReservationsForItem(
  inventoryItemId: string,
): Array<{ reservation: InventoryReservation; operation: OperationRow }> {
  return INVENTORY_RESERVATIONS.filter((r) => r.inventoryItemId === inventoryItemId && r.status === "active")
    .map((reservation) => ({ reservation, operation: OPERATIONS_ROWS.find((op) => op.id === reservation.operationId) }))
    .filter((entry): entry is { reservation: InventoryReservation; operation: OperationRow } => Boolean(entry.operation));
}

/** Sum of active reservation quantities for one inventory item — must equal InventoryItem.reserved. */
export function getActiveReservedQuantity(inventoryItemId: string): number {
  return INVENTORY_RESERVATIONS.filter((r) => r.inventoryItemId === inventoryItemId && r.status === "active").reduce(
    (sum, r) => sum + r.quantity,
    0,
  );
}

export type FinanceInvoiceStatus = "draft" | "sent" | "overdue" | "paid";

/**
 * "today"/"yesterday" carry only a time and are localized via Dashboard.Finance.relativeTime;
 * "date" carries a fixed, untranslated day/month label plus a time. Mirrors
 * InventoryUpdated/CustomerLastActivity's shape but kept as Finance's own type (not imported)
 * so this module stays independent of the others' internals — same reasoning Inventory used
 * for its own InventoryUpdated rather than reusing Customers'.
 */
export type FinanceUpdated =
  | { kind: "today" | "yesterday"; time: string }
  | { kind: "date"; date: string; time: string };

/**
 * A Finance invoice (Stage 2E.1 foundation). Deliberately carries only the invoice's own facts
 * (identity, status, dates, money) plus stable relational keys — customerId into CUSTOMERS_ROWS
 * and operationId into OPERATIONS_ROWS (or null when an invoice isn't tied to one sampled
 * operation, e.g. a standalone service invoice). Customer name, operation status/stage/value are
 * never duplicated here — always resolved live via getFinanceCustomer/getFinanceOperation below.
 *
 * `total` and `paidAmount` are stored (a paid invoice's paidAmount is a historical fact, not
 * something to re-derive); `outstanding` is NOT stored — always getInvoiceOutstanding(invoice) —
 * so it can never drift out of sync with total/paidAmount. subtotal/vatAmount are stored as a
 * matched pair constructed so subtotal + vatAmount === total exactly (see FINANCE_INVOICES
 * below) — vatRate is carried per invoice rather than assumed globally, leaving room for a
 * future invoice using a different Swiss rate without a model change.
 */
export type FinanceInvoice = {
  id: string;
  customerId: string;
  /** Stable relational key into OPERATIONS_ROWS — null when not tied to one sampled operation. */
  operationId: string | null;
  status: FinanceInvoiceStatus;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  paidAmount: number;
  updated: FinanceUpdated;
};

/**
 * Representative sample of the fictional Finance universe (Stage 2E.1) — unlike
 * CUSTOMERS_SUMMARY/INVENTORY_SUMMARY (company-wide figures larger than their 10-row samples),
 * this sample is deliberately constructed so its own totals ARE the page-level KPIs exactly:
 *
 *   - sum(outstanding) across "sent"/"overdue" invoices = CHF 86,400 — matches Customers'
 *     existing CUSTOMERS_SUMMARY.outstanding exactly (same fictional fact, told consistently).
 *   - sum(outstanding) across "overdue" invoices = CHF 24,500, count = 4 — matches Command
 *     Center's existing KPI_ITEMS.cashDue ("CHF 24,500", 4 overdue) exactly.
 *
 * "draft" is excluded from both sums — an unsent invoice isn't a receivable yet — and "paid"
 * naturally contributes zero (outstanding = 0 once paidAmount === total).
 *
 * Every subtotal/vatAmount pair is constructed as subtotal = round(total / 1.081), vatAmount =
 * total - subtotal, so subtotal + vatAmount === total exactly (no floating-point drift) while
 * vatAmount still closely matches subtotal × 8.1% (Switzerland's current standard VAT rate,
 * appropriate for this industrial B2B demo — see the Stage 2E.1 report for the per-invoice
 * numbers this was verified against).
 *
 * Operation links reuse OPERATIONS_ROWS' real, existing operations (verified against the file,
 * not invented) — #10342/#10346/#10345 (all "pending" payment status, i.e. not yet paid — fits
 * "overdue"/"sent"), #10348/#10344/#10340 ("pending", fits "sent"), and #10347/#10343 ("paid",
 * matching those two invoices' own "paid" status so the operation and its invoice never
 * disagree). Cobalt Materials/Vantage Freight Co./Harborline Logistics/Fjordlight Energy don't
 * have a sampled OPERATIONS_ROWS entry, so their invoices use operationId: null rather than
 * inventing one.
 */
export const FINANCE_INVOICES: FinanceInvoice[] = [
  // Overdue — sum(total) = 24,500
  {
    id: "INV-2026-2001",
    customerId: "CUS-1047", // BluePeak Industries
    operationId: "#10342",
    status: "overdue",
    issueDate: "15 Jul",
    dueDate: "14 Aug",
    subtotal: 8418,
    vatRate: 8.1,
    vatAmount: 682,
    total: 9100,
    paidAmount: 0,
    updated: { kind: "date", date: "14 Aug", time: "09:00" },
  },
  {
    id: "INV-2026-2002",
    customerId: "CUS-1046", // Alpine Works
    operationId: "#10346",
    status: "overdue",
    issueDate: "20 Jul",
    dueDate: "19 Aug",
    subtotal: 3885,
    vatRate: 8.1,
    vatAmount: 315,
    total: 4200,
    paidAmount: 0,
    updated: { kind: "date", date: "19 Aug", time: "10:00" },
  },
  {
    id: "INV-2026-2003",
    customerId: "CUS-1045", // Meridian Labs
    operationId: "#10345",
    status: "overdue",
    issueDate: "22 Jul",
    dueDate: "21 Aug",
    subtotal: 5920,
    vatRate: 8.1,
    vatAmount: 480,
    total: 6400,
    paidAmount: 0,
    updated: { kind: "date", date: "21 Aug", time: "11:00" },
  },
  {
    id: "INV-2026-2004",
    customerId: "CUS-1042", // Cobalt Materials
    operationId: null,
    status: "overdue",
    issueDate: "25 Jul",
    dueDate: "24 Aug",
    subtotal: 4440,
    vatRate: 8.1,
    vatAmount: 360,
    total: 4800,
    paidAmount: 0,
    updated: { kind: "date", date: "24 Aug", time: "14:00" },
  },
  // Sent (open, not yet overdue) — sum(total) = 61,900
  {
    id: "INV-2026-2005",
    customerId: "CUS-1048", // Northstar Systems
    operationId: "#10348",
    status: "sent",
    issueDate: "6 Sep",
    dueDate: "6 Oct",
    subtotal: 7817,
    vatRate: 8.1,
    vatAmount: 633,
    total: 8450,
    paidAmount: 0,
    updated: { kind: "today", time: "10:42" },
  },
  {
    id: "INV-2026-2006",
    customerId: "CUS-1048", // Northstar Systems
    operationId: "#10344",
    status: "sent",
    issueDate: "29 Aug",
    dueDate: "28 Sep",
    subtotal: 6244,
    vatRate: 8.1,
    vatAmount: 506,
    total: 6750,
    paidAmount: 0,
    updated: { kind: "today", time: "08:52" },
  },
  {
    id: "INV-2026-2007",
    customerId: "CUS-1045", // Meridian Labs
    operationId: "#10340",
    status: "sent",
    issueDate: "30 Aug",
    dueDate: "29 Sep",
    subtotal: 17484,
    vatRate: 8.1,
    vatAmount: 1416,
    total: 18900,
    paidAmount: 0,
    updated: { kind: "today", time: "07:20" },
  },
  {
    id: "INV-2026-2008",
    customerId: "CUS-1043", // Vantage Freight Co.
    operationId: null,
    status: "sent",
    issueDate: "28 Aug",
    dueDate: "27 Sep",
    subtotal: 13876,
    vatRate: 8.1,
    vatAmount: 1124,
    total: 15000,
    paidAmount: 0,
    updated: { kind: "yesterday", time: "11:15" },
  },
  // Partial payment (Stage 2E.2): total raised from 12,800 to 16,800 and paidAmount set to
  // 4,000 so outstanding stays exactly 12,800 (total - paidAmount) — the CHF 86,400/24,500
  // aggregates above are computed from outstanding, not total, so this redistribution is
  // invisible to them. Harborline has no operationId, so there's no operation.value to keep in
  // sync either — chosen deliberately per Stage 2E.2's own guidance to prefer a
  // non-operation-linked invoice for the partial-payment scenario.
  {
    id: "INV-2026-2009",
    customerId: "CUS-1041", // Harborline Logistics
    operationId: null,
    status: "sent",
    issueDate: "20 Aug",
    dueDate: "19 Sep",
    subtotal: 15541,
    vatRate: 8.1,
    vatAmount: 1259,
    total: 16800,
    paidAmount: 4000,
    updated: { kind: "date", date: "1 Sep", time: "15:50" },
  },
  // Paid — outstanding = 0
  {
    id: "INV-2026-2010",
    customerId: "CUS-1047", // BluePeak Industries
    operationId: "#10347",
    status: "paid",
    issueDate: "10 Jul",
    dueDate: "9 Aug",
    subtotal: 11933,
    vatRate: 8.1,
    vatAmount: 967,
    total: 12900,
    paidAmount: 12900,
    updated: { kind: "today", time: "09:58" },
  },
  {
    id: "INV-2026-2011",
    customerId: "CUS-1044", // Solterra Group
    operationId: "#10343",
    status: "paid",
    issueDate: "5 Jul",
    dueDate: "4 Aug",
    subtotal: 14154,
    vatRate: 8.1,
    vatAmount: 1146,
    total: 15300,
    paidAmount: 15300,
    updated: { kind: "today", time: "08:30" },
  },
  // Draft — not yet sent, excluded from outstanding/overdue aggregates
  {
    id: "INV-2026-2012",
    customerId: "CUS-1040", // Fjordlight Energy
    operationId: null,
    status: "draft",
    issueDate: "6 Sep",
    dueDate: "6 Oct",
    subtotal: 2405,
    vatRate: 8.1,
    vatAmount: 195,
    total: 2600,
    paidAmount: 0,
    updated: { kind: "today", time: "09:00" },
  },
];

/** Invoice statuses counted as real, issued receivables — excludes "draft" (not yet sent, so
 * not a receivable yet) and naturally excludes "paid" (its own outstanding is always 0). */
const RECEIVABLE_STATUSES: FinanceInvoiceStatus[] = ["sent", "overdue"];

/** Fixed, hand-ordered option list for the Finance status filter (Stage 2E.3) — mirrors
 * INVENTORY_STATUSES' pattern (a manually-ordered enumeration of the known union) rather than
 * INVENTORY_LOCATIONS' derive-from-data pattern, since FinanceInvoiceStatus is already a closed
 * set, not an open one discovered from the sample. */
export const FINANCE_INVOICE_STATUSES: FinanceInvoiceStatus[] = ["overdue", "sent", "paid", "draft"];

/** Distinct customerIds represented in FINANCE_INVOICES, in first-appearance order — the
 * customer filter's option set. Mirrors INVENTORY_LOCATIONS' derive-from-data pattern (never a
 * hardcoded second customer list, and never includes a customer with no Finance invoice). */
export const FINANCE_INVOICE_CUSTOMER_IDS = Array.from(new Set(FINANCE_INVOICES.map((invoice) => invoice.customerId)));

/** outstanding = max(0, total - paidAmount) — never stored, always derived. */
export function getInvoiceOutstanding(invoice: FinanceInvoice): number {
  return Math.max(0, invoice.total - invoice.paidAmount);
}

/** The invoice's customer, resolved live from CUSTOMERS_ROWS — never duplicated onto the invoice. */
export function getFinanceCustomer(customerId: string): CustomerRow | undefined {
  return CUSTOMERS_ROWS.find((customer) => customer.id === customerId);
}

/** The invoice's connected operation (if any), resolved live from OPERATIONS_ROWS. */
export function getFinanceOperation(operationId: string | null): OperationRow | undefined {
  if (!operationId) return undefined;
  return OPERATIONS_ROWS.find((operation) => operation.id === operationId);
}

/** Sum of outstanding across all real receivables (sent + overdue) — must equal CHF 86,400. */
export function getTotalOutstanding(): number {
  return FINANCE_INVOICES.filter((invoice) => RECEIVABLE_STATUSES.includes(invoice.status)).reduce(
    (sum, invoice) => sum + getInvoiceOutstanding(invoice),
    0,
  );
}

/** Sum of outstanding across overdue invoices only — must equal CHF 24,500. */
export function getOverdueOutstanding(): number {
  return FINANCE_INVOICES.filter((invoice) => invoice.status === "overdue").reduce(
    (sum, invoice) => sum + getInvoiceOutstanding(invoice),
    0,
  );
}

/** Count of overdue invoices — must equal 4. */
export function getOverdueCount(): number {
  return FINANCE_INVOICES.filter((invoice) => invoice.status === "overdue").length;
}

/** Count of currently active (sent + overdue) invoices. */
export function getOpenInvoiceCount(): number {
  return FINANCE_INVOICES.filter((invoice) => RECEIVABLE_STATUSES.includes(invoice.status)).length;
}

/** Total collected across paid invoices. */
export function getTotalPaid(): number {
  return FINANCE_INVOICES.filter((invoice) => invoice.status === "paid").reduce(
    (sum, invoice) => sum + invoice.paidAmount,
    0,
  );
}

/**
 * A payment record (Stage 2E.2). References its invoice by id only — customer/invoice number
 * are never duplicated here, always resolved live via getInvoicePayments + FINANCE_INVOICES.
 *
 * "received"/"matched" are counted as credited to the invoice (see getInvoicePaidAmount);
 * "unmatched" is money that has arrived but couldn't be confidently applied yet (e.g. an
 * ambiguous bank reference) — it is deliberately EXCLUDED from paidAmount until reviewed, which
 * is what makes it a useful "AT flags this for you" demo moment. "reversed" is likewise excluded
 * (no example currently uses it, but getInvoiceReconciliationState below already accounts for it).
 */
export type FinancePaymentStatus = "received" | "matched" | "unmatched" | "reversed";

export type FinancePayment = {
  id: string;
  /** Stable relational key into FINANCE_INVOICES. */
  invoiceId: string;
  amount: number;
  receivedDate: string;
  status: FinancePaymentStatus;
  /** Bank/remittance reference as captured on the payment — not necessarily the invoice id. */
  reference?: string;
};

/**
 * Payment records for the 4 invoices with a real payment story (Stage 2E.2):
 *   - INV-2026-2010 / INV-2026-2011: full "matched" payments backing their existing paidAmount.
 *   - INV-2026-2009 (Harborline): the CHF 4,000 partial payment backing its updated paidAmount.
 *   - INV-2026-2008 (Vantage Freight Co.): CHF 15,000 arrived but "unmatched" — its reference
 *     ("REF-88213") doesn't map cleanly to the invoice, so it is NOT counted toward paidAmount
 *     (invoice.paidAmount stays 0, matching FINANCE_INVOICES) and surfaces as a reconciliation
 *     exception needing review. This is the deliberate "needs review" scenario — every other
 *     invoice is left with no payment records at all rather than an invented one.
 */
export const FINANCE_PAYMENTS: FinancePayment[] = [
  {
    id: "PAY-2026-3001",
    invoiceId: "INV-2026-2010",
    amount: 12900,
    receivedDate: "9 Aug",
    status: "matched",
    reference: "INV-2026-2010",
  },
  {
    id: "PAY-2026-3002",
    invoiceId: "INV-2026-2011",
    amount: 15300,
    receivedDate: "4 Aug",
    status: "matched",
    reference: "INV-2026-2011",
  },
  {
    id: "PAY-2026-3003",
    invoiceId: "INV-2026-2009",
    amount: 4000,
    receivedDate: "1 Sep",
    status: "matched",
    reference: "INV-2026-2009",
  },
  {
    id: "PAY-2026-3004",
    invoiceId: "INV-2026-2008",
    amount: 15000,
    receivedDate: "3 Sep",
    status: "unmatched",
    reference: "REF-88213",
  },
];

/** Payment statuses counted as credited to the invoice — excludes "unmatched"/"reversed". */
const CREDITED_PAYMENT_STATUSES: FinancePaymentStatus[] = ["received", "matched"];

/** All payment records for one invoice, oldest first — resolved live, never duplicated. */
export function getInvoicePayments(invoiceId: string): FinancePayment[] {
  return FINANCE_PAYMENTS.filter((payment) => payment.invoiceId === invoiceId);
}

/** Sum of credited (received/matched) payments for one invoice — should equal invoice.paidAmount. */
export function getInvoicePaidAmount(invoiceId: string): number {
  return getInvoicePayments(invoiceId)
    .filter((payment) => CREDITED_PAYMENT_STATUSES.includes(payment.status))
    .reduce((sum, payment) => sum + payment.amount, 0);
}

export type FinanceReconciliationState = "reconciled" | "pending" | "exception";

/** Fixed, hand-ordered option list for the Finance reconciliation filter (Stage 2E.3) — mirrors
 * FINANCE_INVOICE_STATUSES' pattern (FinanceReconciliationState is a closed set, not derived
 * from data). Draft invoices are excluded from this filter entirely at the call site rather than
 * here — getInvoiceReconciliationState's "pending" fallback for Draft is an internal default,
 * not a real reconciliation fact, so a Draft must never surface as a "Pending" filter match. */
export const FINANCE_RECONCILIATION_STATES: FinanceReconciliationState[] = ["reconciled", "pending", "exception"];

/**
 * Invoice-level reconciliation state, derived (never stored) from the invoice's own payments:
 *   - "exception" if any payment for this invoice is unmatched/reversed and needs review —
 *     takes priority since it's actionable regardless of outstanding balance.
 *   - "reconciled" only once outstanding is 0 (a draft is never "reconciled" — it isn't a
 *     receivable yet, see getInvoiceReconciliationState's draft handling in the UI layer).
 *   - "pending" otherwise (no payments yet, or a matched partial payment still awaiting the rest).
 */
export function getInvoiceReconciliationState(invoiceId: string): FinanceReconciliationState {
  const invoice = FINANCE_INVOICES.find((candidate) => candidate.id === invoiceId);
  const payments = getInvoicePayments(invoiceId);
  const hasException = payments.some((payment) => payment.status === "unmatched" || payment.status === "reversed");
  if (hasException) return "exception";
  if (invoice && invoice.status !== "draft" && getInvoiceOutstanding(invoice) === 0) return "reconciled";
  return "pending";
}

export type FinanceActivityEntry = {
  key:
    | "invoiceIssued"
    | "paymentReceived"
    | "paymentMatched"
    | "paymentNeedsReview"
    | "invoiceOverdue";
  date: string;
  params?: Record<string, string>;
};

/**
 * A small, fully deterministic activity timeline for one invoice — built from the invoice's own
 * issueDate/status and its real FINANCE_PAYMENTS records only, never fabricated or time-computed.
 * A draft invoice hasn't been issued yet, so it gets an empty timeline (handled in the UI as "not
 * yet issued" rather than an empty activity list).
 */
export function getInvoiceActivity(invoiceId: string): FinanceActivityEntry[] {
  const invoice = FINANCE_INVOICES.find((candidate) => candidate.id === invoiceId);
  if (!invoice || invoice.status === "draft") return [];

  const entries: FinanceActivityEntry[] = [
    { key: "invoiceIssued", date: invoice.issueDate },
  ];

  for (const payment of getInvoicePayments(invoiceId)) {
    entries.push({
      key: payment.status === "unmatched" ? "paymentNeedsReview" : "paymentMatched",
      date: payment.receivedDate,
      params: { amount: `CHF ${payment.amount.toLocaleString("en-US")}` },
    });
  }

  if (invoice.status === "overdue") {
    entries.push({ key: "invoiceOverdue", date: invoice.dueDate });
  }

  return entries;
}
