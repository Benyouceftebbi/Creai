import { Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import { useTranslations } from 'next-intl'

const plans = [
  {
    name: "sender-id",
    price: 50,
    features: [
      "custom-sender-id",
      "improved-brand-recognition",
      "higher-open-rates",
      "priority-support",
    ],
    customInput: true,
    special: true,
  },
  {
    name: "starter",
    price: 10,
    tokens: "2,400",
    bonus: "",
    features: [
      "basic-sms-notifications",
      "standard-delivery-tracking",
      "email-support",
      "api-access",
    ],
  },
  {
    name: "enterprise",
    price: 100,
    tokens: "24,000",
    bonus: "enterprise-bonus",
    features: [
      "enterprise-sms-automation",
      "premium-delivery-tracking",
      "24-7-priority-support",
      "advanced-api-access",
      "custom-analytics",
      "dedicated-account-manager",
      "custom-integrations",
      "sla-guarantee",
    ],
    popular: true,
  },
  {
    name: "business",
    price: 80,
    tokens: "19,200",
    bonus: "business-bonus",
    features: [
      "advanced-sms-automation",
      "priority-delivery-tracking",
      "priority-email-chat-support",
      "advanced-api-access",
      "analytics-dashboard",
      "custom-integrations",
    ],
  },
]

export function PricingPlans() {
  const [senderID, setSenderID] = useState('')
  const t = useTranslations('billing')

  const handleSenderIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenderID(e.target.value.slice(0, 11))
  }

  return (
    <div className="py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">{t('charge-your-tokens')}</h2>
        <p className="text-muted-foreground mt-2">
          {t('get-tokens-description')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''} ${plan.special ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : ''}`}
          >
            {plan.popular && (
              <Badge className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3">
                {t('most-popular')}
              </Badge>
            )}
            <CardHeader>
              <CardTitle className={plan.special ? 'text-white' : ''}>{t(`plan-${plan.name}`)}</CardTitle>
              <CardDescription className={plan.special ? 'text-white/80' : ''}>
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className={plan.special ? 'text-white/80' : 'text-muted-foreground'}>{t('one-time')}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!plan.special && (
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <div className="text-lg font-semibold">{t('tokens-amount', { amount: plan.tokens })}</div>
                  {plan.bonus && (
                    <div className="text-sm text-primary">{t(plan.bonus)}</div>
                  )}
                </div>
              )}
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className={`h-4 w-4 ${plan.special ? 'text-white' : 'text-primary'}`} />
                    <span className={`text-sm ${plan.special ? 'text-white/90' : ''}`}>{t(feature)}</span>
                  </li>
                ))}
              </ul>
              {plan.customInput && (
                <div className="mt-4">
                  <Input
                    type="text"
                    placeholder={t('enter-sender-id')}
                    value={senderID}
                    onChange={handleSenderIDChange}
                    maxLength={11}
                    className="w-full bg-white/20 text-white placeholder-white/50 border-white/30"
                  />
                  <p className="text-xs text-white/80 mt-1">
                    {t('characters-remaining', { count: 11 - senderID.length })}
                  </p>
                </div>
              )}
              <Button 
                className={`w-full mt-6 ${plan.special ? 'bg-white text-blue-600 hover:bg-white/90' : ''}`} 
                variant={plan.popular ? "default" : plan.special ? "secondary" : "outline"}
              >
                {plan.special ? t('get-custom-sender-id') : t('proceed')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

