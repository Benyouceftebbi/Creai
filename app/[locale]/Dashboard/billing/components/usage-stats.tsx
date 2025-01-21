import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { date: '2023-11-25', amount: 150 },
  { date: '2023-11-26', amount: 230 },
  { date: '2023-11-27', amount: 180 },
  { date: '2023-11-28', amount: 290 },
  { date: '2023-11-29', amount: 320 },
  { date: '2023-11-30', amount: 250 },
  { date: '2023-12-01', amount: 280 },
]

export function UsageStats() {
  const t = useTranslations('billing')

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('usage-statistics')}</CardTitle>
            <CardDescription>{t('track-token-consumption')}</CardDescription>
          </div>
          <Select defaultValue="7days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('select-period')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">{t('last-7-days')}</SelectItem>
              <SelectItem value="30days">{t('last-30-days')}</SelectItem>
              <SelectItem value="3months">{t('last-3-months')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

