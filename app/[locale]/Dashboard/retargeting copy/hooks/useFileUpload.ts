import { useRef, type ChangeEvent } from 'react';
import * as XLSX from 'xlsx';

export function useFileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      return jsonData[0] as string[];
    }
    return [];
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return {
    fileInputRef,
    handleFileChange,
    handleUploadClick
  };
}