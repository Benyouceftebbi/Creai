export type AlertAction = "test" | "campaign";

export type SentMessage = {
  id: string;
  date: Date;
  recipients: number;
  messageCount: number;
  totalCost: number;
  content: string;
};

export type ClientGroup = {
  value: string;
  label: string;
  recipients: number;
};

export type RetargetingCampaignHook = {
  message: string
  messageCount: number
  totalRecipients: number
  CHARACTER_LIMIT: number
}


export type ExcelData = {
  headers: string[]
  phoneColumn: string
  nameColumn: string
  data: Record<string, string>[]
}

export type RetargetingCampaignHook = {
  message: string
  setMessage: (message: string) => void
  excelData: ExcelData | null
  setExcelData: (data: ExcelData | null) => void
  totalRecipients: number
  setTotalRecipients: (total: number) => void
  CHARACTER_LIMIT: number
  audienceSource?: "excel" | "group"
  selectedGroup?: { recipients: { name: string; phone: string }[] }
  totalCost?: number
}



export type RetargetingCampaignHook = ReturnType<typeof import('./hooks/useRetargetingCampaign').useRetargetingCampaign>;