"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, HelpCircle, Zap } from 'lucide-react'
import { PricingPlans } from "./components/pricing-plans"
import { TopUpForm } from "./components/top-up-form"
import { SenderIdSubscription } from "./components/sender-id-subscription"
import { UsageStats } from "./components/usage-stats"
import { useTranslations } from 'next-intl';

export default function BillingPage() {
  const [balance, setBalance] = useState(24000) // Assuming 24000 tokens
  const [usagePercentage, setUsagePercentage] = useState(60)
  const t = useTranslations("billing");

  return (
    <div className="container mx-auto py-10 px-4 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{t('billing-subscriptions')}</h1>
        <Button variant="outline" size="icon">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="usage">{t('usage')}</TabsTrigger>
        </TabsList>

        <div className="bg-[#faf5ff] p-4 rounded-lg">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-1/6">
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/jNQXAC9IVRw"
                    title="Delivery Update Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
              <div className="w-full sm:w-5/6">
                <h3 className="text-lg font-semibold mb-2">{t('billing-subscriptions')}</h3>
                <p className="text-sm text-gray-600">{t('billing-subscriptions-description')}</p>
              </div>
            </div>
          </div>
        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <CardHeader>
                <CardTitle className="text-3xl">{t('account-balance')}</CardTitle>
                <CardDescription className="text-green-100">{t('current-prepaid-balance')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <p className="text-4xl font-bold">{balance.toLocaleString()} {t('tokens')}</p>
                    <p className="text-green-100 mt-2">{t('estimated-to-last', { days: 7 })}</p>
                  </div>
                  <Button variant="secondary" className="bg-white text-green-600 hover:bg-green-100">
                    {t('top-up')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  {t('usage-overview')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('current-usage')}</span>
                    <span>{usagePercentage}%</span>
                  </div>
                  <Progress value={usagePercentage} className="w-full" />
                </div>
                <Button className="w-full justify-start" variant="outline">
                  <AlertCircle className="mr-2 h-4 w-4" /> {t('view-details')}
                </Button>
              </CardContent>
            </Card>
          </div>

        

          <PricingPlans />
        </TabsContent>

        <TabsContent value="usage">
          <UsageStats />
        </TabsContent>
      </Tabs>
    </div>
  )
}

