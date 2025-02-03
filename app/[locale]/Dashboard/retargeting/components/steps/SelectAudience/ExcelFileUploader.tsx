import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { parseExcelFile } from "../../../utils/excel"
import type { RetargetingCampaignHook } from '../types';

type ExcelFileUploaderProps = {
  campaign: RetargetingCampaignHook;
};

export function ExcelFileUploader({ campaign }: ExcelFileUploaderProps) {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const { headers, data } = await parseExcelFile(file);
      campaign.setExcelData({
        headers,
        phoneColumn: '',
        nameColumn: '',
        data
      });
      console.log("Excel file parsed:", { headers, dataLength: data.length });
    }
  };

  const handleColumnSelect = (columnType: 'phoneColumn' | 'nameColumn', value: string) => {
    campaign.setExcelData({
      ...campaign.excelData!,
      [columnType]: value
    });
    
    // Log the processed data after column selection
    setTimeout(() => {
      campaign.logProcessedData();
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          id="excel-file"
        />
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => document.getElementById('excel-file')?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose Excel File
        </Button>
      </div>

      {campaign.excelData && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Phone Number Column</Label>
            <Select 
              value={campaign.excelData.phoneColumn}
              onValueChange={(value) => handleColumnSelect('phoneColumn', value)}
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
              onValueChange={(value) => handleColumnSelect('nameColumn', value)}
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
  );
}
