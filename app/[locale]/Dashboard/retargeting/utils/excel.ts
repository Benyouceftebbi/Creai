import * as XLSX from "xlsx"

export async function parseExcelFile(file: File): Promise<{ headers: string[]; data: any[][] }> {
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data)
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
  const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })

  const headers = jsonData[0] as string[]
  const rows = jsonData.slice(1) as any[][]

  return { headers, data: rows }
}

