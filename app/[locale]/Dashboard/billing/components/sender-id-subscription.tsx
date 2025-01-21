'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { useTranslations } from 'next-intl'

export function SenderIdSubscription() {
  const [senderId, setSenderId] = useState('')
  const [subscriptionPeriod, setSubscriptionPeriod] = useState('monthly')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const t = useTranslations('billing')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted')
    setIsSubmitting(true)

    toast({
      title: t('request-sent-successfully'),
      description: t('sender-id-review-message'),
      duration: 5000,
    })

    try {
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Reset form
      setSenderId('')
      setSubscriptionPeriod('monthly')
    } catch (error) {
      toast({
        title: t('error'),
        description: t('request-error-message'),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('sender-id-subscription')}</CardTitle>
        <CardDescription>{t('sender-id-description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sender-id">{t('sender-id')}</Label>
            <Input 
              id="sender-id" 
              placeholder={t('enter-desired-sender-id')} 
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              {t('sender-id-explanation')}
            </p>
          </div>

          <div className="space-y-4">
            <Label>{t('subscription-period')}</Label>
            <RadioGroup 
              value={subscriptionPeriod} 
              onValueChange={setSubscriptionPeriod} 
              className="grid gap-4"
            >
              <Label
                className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <div className="space-y-1">
                  <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
                  <span className="font-semibold">{t('monthly')}</span>
                  <p className="text-sm text-muted-foreground">{t('monthly-price')}</p>
                </div>
              </Label>
              <Label
                className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <div className="space-y-1">
                  <RadioGroupItem value="yearly" id="yearly" className="sr-only" />
                  <span className="font-semibold">{t('yearly')}</span>
                  <p className="text-sm text-muted-foreground">{t('yearly-price')}</p>
                </div>
              </Label>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('submitting') : t('subscribe')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

