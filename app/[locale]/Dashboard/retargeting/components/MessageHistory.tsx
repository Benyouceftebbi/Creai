import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { SentMessage } from "../types"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"

type MessageHistoryProps = {
  sentMessages: SentMessage[]
  exportToExcel: (message: SentMessage) => void
}

export function MessageHistory({ sentMessages, exportToExcel }: MessageHistoryProps) {
  const t = useTranslations("retargeting")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
            {t("pending")}
          </Badge>
        )
      case "sent":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            {t("sent")}
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            {t("failed")}
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("campaignName")}</TableHead>
          <TableHead>{t("date")}</TableHead>
          <TableHead>{t("recipients")}</TableHead>
          <TableHead>{t("messageCount")}</TableHead>
          <TableHead>{t("totalCost")}</TableHead>
          <TableHead>{t("content")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead>{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sentMessages.map((msg) => (
          <TableRow key={msg.id} className="hover:bg-muted/50 transition-colors">
            <TableCell>{msg.campaignName}</TableCell>
            <TableCell>{msg.date.toLocaleString()}</TableCell>
            <TableCell>{msg.recipients}</TableCell>
            <TableCell>{msg.messageCount}</TableCell>
            <TableCell>{msg.totalCost.toLocaleString()}</TableCell>
            <TableCell className="max-w-xs truncate">{msg.content}</TableCell>
            <TableCell>{getStatusBadge(msg.status)}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => exportToExcel(msg)} className="neon-hover">
                <Download className="h-4 w-4 mr-2" />
                {t("export")}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

