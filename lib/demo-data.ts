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
      { key: "customers", icon: "users", href: "/demo/customers" },
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
