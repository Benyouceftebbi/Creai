import { useState, useEffect } from "react"
import confetti from "canvas-confetti"
import { utils, writeFile } from "xlsx"
import type { SentMessage, ClientGroup, ExcelData } from "../types"
import { CLIENT_GROUPS, CHARACTER_LIMIT, COST_PER_MESSAGE } from "../components/constants"

export function useRetargetingCampaign() {
  const [selectedGroup, setSelectedGroup] = useState<ClientGroup>(CLIENT_GROUPS[0])
  const [message, setMessage] = useState("")
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertAction, setAlertAction] = useState<"test" | "campaign">("campaign")
  const [currentStep, setCurrentStep] = useState(0)
  const [isPersonalized, setIsPersonalized] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sentMessages, setSentMessages] = useState<SentMessage[]>([])
  const [audienceSource, setAudienceSource] = useState("group")
  const [deliveryStatus, setDeliveryStatus] = useState("all")
  const [excelData, setExcelData] = useState<ExcelData | null>(null)
  const [processedData, setProcessedData] = useState<Array<{ name: string, number: string }>>([])
  const [totalRecipients, setTotalRecipients] = useState(0)

  const characterCount = message.length
  const messageCount = Math.ceil(characterCount / CHARACTER_LIMIT)
  const remainingCharacters = CHARACTER_LIMIT - (characterCount % CHARACTER_LIMIT)
  const totalCost = messageCount * totalRecipients * COST_PER_MESSAGE

  useEffect(() => {
    if (excelData && excelData.phoneColumn && excelData.nameColumn) {
      const phoneIndex = excelData.headers.indexOf(excelData.phoneColumn)
      const nameIndex = excelData.headers.indexOf(excelData.nameColumn)

      const processed = excelData.data.map(row => ({
        name: row[nameIndex] as string,
        number: row[phoneIndex] as string
      }))

      setProcessedData(processed)
      setTotalRecipients(processed.length)

      // Log the processed data
      console.log("Processed Excel Data:", processed)
      console.log("Total Recipients:", processed.length)
    }
  }, [excelData])

  const handleSendCampaign = async () => {
    setIsSending(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newMessage: SentMessage = {
      id: Date.now().toString(),
      date: new Date(),
      recipients: totalRecipients,
      messageCount,
      totalCost,
      content: message,
    }

    setSentMessages((prev) => [newMessage, ...prev])

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    setIsSending(false)
    setIsAlertOpen(false)
  }

  const exportToExcel = (message: SentMessage) => {
    const worksheet = utils.json_to_sheet([
      {
        Date: message.date.toLocaleString(),
        Recipients: message.recipients,
        "Message Count": message.messageCount,
        "Total Cost": message.totalCost,
        Content: message.content,
      },
    ])
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, "Campaign")
    writeFile(workbook, `campaign_${message.id}.xlsx`)
  }

  const logProcessedData = () => {
    console.log("Current Processed Data:", processedData)
    console.log("Current Total Recipients:", totalRecipients)
  }

  return {
    selectedGroup,
    setSelectedGroup,
    message,
    setMessage,
    isAlertOpen,
    setIsAlertOpen,
    alertAction,
    setAlertAction,
    currentStep,
    setCurrentStep,
    isPersonalized,
    setIsPersonalized,
    isSending,
    sentMessages,
    characterCount,
    messageCount,
    remainingCharacters,
    totalCost,
    handleSendCampaign,
    exportToExcel,
    CLIENT_GROUPS,
    CHARACTER_LIMIT,
    audienceSource,
    setAudienceSource,
    deliveryStatus,
    setDeliveryStatus,
    excelData,
    setExcelData,
    processedData,
    totalRecipients,
    setTotalRecipients,
    logProcessedData,
  }
}
