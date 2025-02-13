export const CLIENT_GROUPS = [
    { value: "last_week", label: "Last Week Clients", recipients: 100 },
    { value: "last_15_days", label: "Last 15 Days Clients", recipients: 250 },
    { value: "last_month", label: "Last Month Clients", recipients: 500 },
    { value: "last_3_months", label: "Last 3 Months Clients", recipients: 1000 },
    { value: "last_6_months", label: "Last 6 Months Clients", recipients: 2000 },
    { value: "last_12_months", label: "Last 12 Months Clients", recipients: 5000 },
  ] as const;
  
  export const CHARACTER_LIMIT = 160;
  export const STEPS = ["Select Audience", "Craft Message", "Preview & Test", "Send Campaign"];
  export const COST_PER_MESSAGE = 15; // in DZD