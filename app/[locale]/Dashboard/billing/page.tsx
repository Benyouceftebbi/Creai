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

export default function BillingPage() {
  const [balance, setBalance] = useState(24000) // Assuming 24000 tokens
  const [usagePercentage, setUsagePercentage] = useState(60)

  return (
    <div className="container mx-auto py-10 px-4 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Billing & Subscriptions</h1>
        <Button variant="outline" size="icon">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
       
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <CardHeader>
                <CardTitle className="text-3xl">Account Balance</CardTitle>
                <CardDescription className="text-green-100">Your current prepaid balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <p className="text-4xl font-bold">{balance.toLocaleString()} Tokens</p>
                    <p className="text-green-100 mt-2">Estimated to last: 7 days</p>
                  </div>
                  <Button variant="secondary" className="bg-white text-green-600 hover:bg-green-100">
                    Top Up
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  Usage Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Usage</span>
                    <span>{usagePercentage}%</span>
                  </div>
                  <Progress value={usagePercentage} className="w-full" />
                </div>
                <Button className="w-full justify-start" variant="outline">
                  <AlertCircle className="mr-2 h-4 w-4" /> View Details
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

