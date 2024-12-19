import { Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from 'react'

const plans = [
  {
    name: "Sender ID",
    price: 50,
    features: [
      "Custom Sender ID (11 characters max)",
      "Improved brand recognition",
      "Higher open rates",
      "Priority support",
    ],
    customInput: true,
    special: true,
  },
  {
    name: "Starter",
    price: 10,
    tokens: "2,400",
    bonus: "",
    features: [
      "Basic SMS notifications",
      "Standard delivery tracking",
      "Email support",
      "API access",
    ],
  },
  {
    name: "Enterprise",
    price: 100,
    tokens: "24,000",
    bonus: "+15% Bonus Tokens FREE",
    features: [
      "Enterprise SMS automation",
      "Premium delivery tracking",
      "24/7 priority support",
      "Advanced API access",
      "Custom analytics",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
    ],
    popular: true,
  },
  {
    name: "Business",
    price: 80,
    tokens: "19,200",
    bonus: "+5% Bonus Tokens FREE",
    features: [
      "Advanced SMS automation",
      "Priority delivery tracking",
      "Priority email & chat support",
      "Advanced API access",
      "Analytics dashboard",
      "Custom integrations",
    ],
  },
]

export function PricingPlans() {
  const [senderID, setSenderID] = useState('')

  const handleSenderIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenderID(e.target.value.slice(0, 11))
  }

  return (
    <div className="py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Charge Your Tokens</h2>
        <p className="text-muted-foreground mt-2">
          Get the tokens you need to power your SMS communications
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
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className={plan.special ? 'text-white' : ''}>{plan.name}</CardTitle>
              <CardDescription className={plan.special ? 'text-white/80' : ''}>
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className={plan.special ? 'text-white/80' : 'text-muted-foreground'}>/one-time</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!plan.special && (
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <div className="text-lg font-semibold">{plan.tokens} Tokens</div>
                  {plan.bonus && (
                    <div className="text-sm text-primary">{plan.bonus}</div>
                  )}
                </div>
              )}
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className={`h-4 w-4 ${plan.special ? 'text-white' : 'text-primary'}`} />
                    <span className={`text-sm ${plan.special ? 'text-white/90' : ''}`}>{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.customInput && (
                <div className="mt-4">
                  <Input
                    type="text"
                    placeholder="Enter Sender ID"
                    value={senderID}
                    onChange={handleSenderIDChange}
                    maxLength={11}
                    className="w-full bg-white/20 text-white placeholder-white/50 border-white/30"
                  />
                  <p className="text-xs text-white/80 mt-1">
                    {11 - senderID.length} characters remaining
                  </p>
                </div>
              )}
              <Button 
                className={`w-full mt-6 ${plan.special ? 'bg-white text-blue-600 hover:bg-white/90' : ''}`} 
                variant={plan.popular ? "default" : plan.special ? "secondary" : "outline"}
              >
                {plan.special ? 'Get Custom Sender ID' : 'Proceed'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

