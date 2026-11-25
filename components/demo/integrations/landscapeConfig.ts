export const CATEGORY_ORDER = ["erp", "crm", "accounting", "warehouse", "payments", "ecommerce", "email", "internal"] as const;
export const MODULE_ORDER = ["operations", "finance", "inventory", "customers", "automations"] as const;

export const CATEGORY_ICONS = {
  erp: "server",
  crm: "users",
  accounting: "calculator",
  warehouse: "warehouse",
  payments: "card",
  ecommerce: "cart",
  email: "mail",
  internal: "tools",
} as const;

export const MODULE_ICONS = {
  operations: "activity",
  finance: "coins",
  inventory: "box",
  customers: "users",
  automations: "bolt",
} as const;

export const LAYER_FEATURES = [
  { key: "synchronization", icon: "sync" },
  { key: "orchestration", icon: "workflow" },
  { key: "businessRules", icon: "rules" },
  { key: "automation", icon: "bolt" },
] as const;
