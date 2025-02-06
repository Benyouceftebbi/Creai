"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { Upload, X, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { parseExcelFile } from "../../../utils/excel"
import type { RetargetingCampaignHook } from "../types"

type ExcelFileUploaderProps = {
  campaign: RetargetingCampaignHook
}

export function ExcelFileUploader({ campaign }: ExcelFileUploaderProps) {
  const [uploadPressed, setUploadPressed] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (uploadPressed) {
      resetUpload()
    }
  }, [uploadPressed]) // Removed unnecessary dependency: campaign

  const resetUpload = () => {
    campaign.setExcelData(null)
    campaign.setTotalRecipients(0)
    setFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setUploadPressed(false)
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const { headers, data } = await parseExcelFile(file)
      campaign.setExcelData({
        headers,
        phoneColumn: "",
        nameColumn: "",
        data,
      })
      console.log("Excel file parsed:", { headers, dataLength: data.length })
    }
  }

  const handleColumnSelect = (columnType: "phoneColumn" | "nameColumn", value: string) => {
    campaign.setExcelData({
      ...campaign.excelData!,
      [columnType]: value,
    })

    if (campaign.excelData?.phoneColumn && campaign.excelData?.nameColumn) {
      const processedData = campaign.excelData.data.map((row) => ({
        phone: row[campaign.excelData!.phoneColumn],
        name: row[campaign.excelData!.nameColumn],
      }))
      campaign.setTotalRecipients(processedData.length)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          id="excel-file"
        />
        {!fileName ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setUploadPressed(true)
              fileInputRef.current?.click()
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose Excel File
          </Button>
        ) : (
          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="h-5 w-5 text-green-500" />
              <span className="font-medium">{fileName}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={resetUpload} className="text-destructive">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {campaign.excelData && (
        <div className="space-y-4">
          
          <div className="space-y-2">
            <Label>Select Phone Number Column</Label>
            <Select
              value={campaign.excelData.phoneColumn}
              onValueChange={(value) => handleColumnSelect("phoneColumn", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {campaign.excelData.headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Select Name Column</Label>
            <Select
              value={campaign.excelData.nameColumn}
              onValueChange={(value) => handleColumnSelect("nameColumn", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {campaign.excelData.headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}

