import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const topUpOptions = [
  { tokens: "2,400", price: 10 },
  { tokens: "12,000", price: 45 },
  { tokens: "24,000", price: 85 },
  { tokens: "50,000", price: 160 },
]

export function TopUpForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Up Your Account</CardTitle>
        <CardDescription>Purchase additional tokens for your SMS communications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup defaultValue="24000" className="grid grid-cols-2 gap-4">
          {topUpOptions.map((option) => (
            <Label
              key={option.tokens}
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value={option.tokens} className="sr-only" />
              <span className="text-2xl font-bold">{option.tokens}</span>
              <span className="text-sm text-muted-foreground">Tokens</span>
              <span className="mt-2 font-semibold">${option.price}</span>
            </Label>
          ))}
        </RadioGroup>

        <div className="space-y-2">
          <Label htmlFor="custom-amount">Or enter custom amount</Label>
          <Input id="custom-amount" type="number" placeholder="Enter number of tokens" />
        </div>

        <Button className="w-full">Proceed to Payment</Button>
      </CardContent>
    </Card>
  )
}

