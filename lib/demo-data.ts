export const DEMO_USER = {
  name: "Alex Morgan",
  firstName: "Alex",
  initials: "AM",
} as const;

export const NAV_SECTIONS = [
  {
    key: "operate",
    items: [
      { key: "operations", icon: "activity", href: "/demo/operations", badge: "3" },
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
