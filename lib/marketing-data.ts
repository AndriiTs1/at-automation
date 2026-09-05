/** Ordered category keys for the "What AT can automate" capability map — each resolves to
 * Capabilities.categories.{key}.{title,description,examples} in the message catalog. */
export const CAPABILITY_CATEGORY_KEYS = [
  "salesCustomers",
  "operations",
  "inventorySupply",
  "finance",
  "documents",
  "communication",
  "managementReporting",
  "aiAutomation",
] as const;

/**
 * A named, real product (kept untranslated everywhere) or a translated generic phrase
 * (e.g. "other accounting systems") resolved via Integrations.generic.{genericKey}.
 */
export type IntegrationExample = { brand: string } | { genericKey: string };

/** Integration categories for the "systems AT can connect with" layer. Category display
 * labels live at Integrations.categories.{key}; brand names are fictional-free real product
 * names and stay untranslated per locale conventions. */
export const INTEGRATION_CATEGORIES: { key: string; examples: IntegrationExample[] }[] = [
  {
    key: "erp",
    examples: [{ brand: "SAP" }, { brand: "Microsoft Dynamics" }, { brand: "Odoo" }],
  },
  {
    key: "crm",
    examples: [{ brand: "Salesforce" }, { brand: "HubSpot" }, { brand: "Pipedrive" }],
  },
  {
    key: "accounting",
    examples: [{ brand: "Xero" }, { brand: "QuickBooks" }, { genericKey: "otherAccountingSystems" }],
  },
  {
    key: "commerce",
    examples: [{ brand: "Shopify" }, { brand: "WooCommerce" }],
  },
  {
    key: "communication",
    examples: [{ brand: "Microsoft Outlook" }, { brand: "Gmail" }, { brand: "Slack" }, { brand: "Microsoft Teams" }],
  },
  {
    key: "data",
    examples: [{ brand: "PostgreSQL" }, { brand: "Excel" }, { brand: "Google Sheets" }],
  },
  {
    key: "payments",
    examples: [{ brand: "Stripe" }, { genericKey: "otherPaymentProviders" }],
  },
  {
    key: "customSystems",
    examples: [{ brand: "REST APIs" }, { brand: "Webhooks" }, { genericKey: "internalLegacySystems" }],
  },
];
