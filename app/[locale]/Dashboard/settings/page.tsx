"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Steps } from "./components/steps"
import { PlusCircle, Trash2 } from "lucide-react"
import { useShop } from "@/app/context/ShopContext"
import { toast } from "@/components/ui/use-toast"

export default function Component() {
  const { shopData } = useShop()
  console.log("shop", shopData)

  const [shippingProviders, setShippingProviders] = useState([])
  const [keywords, setKeywords] = useState("")
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState("")
  const [showSetupModal, setShowSetupModal] = useState(false)
  const [dhdSetupComplete, setDhdSetupComplete] = useState(false)

  const providerImages = {
    DHD: "https://dhd-dz.com/assets/img/logo.png",
    "Yalidin Express": "https://yalidine.com/assets/img/yalidine-logo.png",
    UPS: "https://www.ups.com/assets/resources/webcontent/images/ups-logo.svg",
    "Go livri": "https://www.golivri.dz/assets/img/logo.png",
    "Maystero Delivery": "https://maystro-delivery.com/img/logo.svg",
  }

  const addShippingProvider = () => {
    setSelectedProvider("")
    setShowSetupModal(true)
  }

  const updateShippingProvider = (index, field, value) => {
    const updatedProviders = [...shippingProviders]
    updatedProviders[index][field] = value
    setShippingProviders(updatedProviders)
  }

  const removeShippingProvider = (index) => {
    const updatedProviders = [...shippingProviders]
    updatedProviders.splice(index, 1)
    setShippingProviders(updatedProviders)
  }

  const handleSetupComplete = (provider, data) => {
    if (provider === "DHD") {
      setDhdSetupComplete(true)
    } else {
      setShippingProviders([...shippingProviders, { ...data, provider, apiToken: "" }])
    }
    setShowSetupModal(false)
  }

  const handleApiTokenSubmit = (index) => {
    // Here you would typically send the API token to your backend
    // For now, we'll just show a success message
    toast({
      title: "API Token Updated",
      description: "Your DHD API token has been successfully saved.",
    })
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto space-y-8">
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="grid gap-8">
            <h1 className="text-4xl font-bold">Billing-subscriptions</h1>
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
                  <h3 className="text-lg font-semibold mb-2">billing-subscriptions</h3>
                  <p className="text-sm text-gray-600">billing-subscriptions-description</p>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue="John Doe" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john@example.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" defaultValue="Acme Inc." />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue="+1 (555) 555-5555" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="language">Language</Label>
                    <Select id="language" defaultValue="en">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="Enter keywords"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Integration</CardTitle>
                <CardDescription>Configure your shipping provider settings.</CardDescription>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={addShippingProvider}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Shipping Provider
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {shippingProviders.map((provider, index) => (
                    <div key={index} className="bg-muted p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold">{provider.provider}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/90"
                          onClick={() => removeShippingProvider(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-4">
                        {provider.provider === "DHD" && dhdSetupComplete ? (
                          <div className="grid gap-2">
                            <Label htmlFor={`api-token-${index}`}>API Token</Label>
                            <div className="flex gap-2">
                              <Input
                                id={`api-token-${index}`}
                                value={provider.apiToken}
                                onChange={(e) => updateShippingProvider(index, "apiToken", e.target.value)}
                                placeholder="Enter your DHD API Token"
                              />
                              <Button onClick={() => handleApiTokenSubmit(index)}>Submit</Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="grid gap-2">
                              <Label htmlFor={`api-key-${index}`}>API Key</Label>
                              <Input
                                id={`api-key-${index}`}
                                value={provider.apiKey}
                                onChange={(e) => updateShippingProvider(index, "apiKey", e.target.value)}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor={`api-secret-${index}`}>API Secret</Label>
                              <Input
                                id={`api-secret-${index}`}
                                value={provider.apiSecret}
                                onChange={(e) => updateShippingProvider(index, "apiSecret", e.target.value)}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor={`webhook-url-${index}`}>Webhook URL</Label>
                              <Input
                                id={`webhook-url-${index}`}
                                value={provider.webhookUrl}
                                onChange={(e) => updateShippingProvider(index, "webhookUrl", e.target.value)}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {dhdSetupComplete && !shippingProviders.some((p) => p.provider === "DHD") && (
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold">DHD</h4>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dhd-api-token">API Token</Label>
                        <div className="flex gap-2">
                          <Input
                            id="dhd-api-token"
                            placeholder="Enter your DHD API Token"
                            onChange={(e) =>
                              updateShippingProvider(shippingProviders.length, "apiToken", e.target.value)
                            }
                          />
                          <Button onClick={() => handleApiTokenSubmit(shippingProviders.length)}>Submit</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <Dialog open={showSetupModal} onOpenChange={setShowSetupModal}>
        <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
          {!selectedProvider ? (
            <div className="p-6 space-y-6">
              <DialogHeader>
                <DialogTitle className="text-2xl">Choose a Shipping Provider</DialogTitle>
                <DialogDescription>
                  Select your preferred shipping provider to begin the integration setup process.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                {["DHD", "Yalidin Express", "UPS", "Go livri", "Maystero Delivery"].map((provider) => (
                  <Button
                    key={provider}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => setSelectedProvider(provider)}
                  >
                    <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
                      <img
                        src={providerImages[provider] || `/placeholder.svg?height=64&width=64`}
                        alt={provider}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <span>{provider}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 z-10"
                onClick={() => setShowSetupModal(false)}
              ></Button>
              <Steps shopData={shopData} provider={selectedProvider} onComplete={handleSetupComplete} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

