import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { SentMessage } from '../types';
import { useTranslations } from 'next-intl';

type MessageHistoryProps = {
  sentMessages: SentMessage[];
  exportToExcel: (message: SentMessage) => void;
};

export function MessageHistory({ sentMessages, exportToExcel }: MessageHistoryProps) {
  const t = useTranslations('retargeting');

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('date')}</TableHead>
          <TableHead>{t('recipients')}</TableHead>
          <TableHead>{t('messageCount')}</TableHead>
          <TableHead>{t('totalCost')}</TableHead>
          <TableHead>{t('content')}</TableHead>
          <TableHead>{t('actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sentMessages.map((msg) => (
          <TableRow key={msg.id} className="hover:bg-muted/50 transition-colors">
            <TableCell>{msg.date.toLocaleString()}</TableCell>
            <TableCell>{msg.recipients}</TableCell>
            <TableCell>{msg.messageCount}</TableCell>
            <TableCell>{msg.totalCost.toLocaleString()}</TableCell>
            <TableCell className="max-w-xs truncate">{msg.content}</TableCell>
            <TableCell>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => exportToExcel(msg)}
                className="neon-hover"
              >
                <Download className="h-4 w-4 mr-2" />
                {t('export')}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
