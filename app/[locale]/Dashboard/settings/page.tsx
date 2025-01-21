"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Steps } from "./components/steps"
import { PlusCircle, Trash2, X } from 'lucide-react'
import { useShop } from "@/app/context/ShopContext"
export default function Component() {
  const {shopData}= useShop()
  console.log('shop',shopData);
  
  const [shippingProviders, setShippingProviders] = useState([
    { provider: "DHD", apiKey: "abc123", apiSecret: "def456", webhookUrl: "https://example.com/webhook" },
  ])
  const [keywords, setKeywords] = useState("")
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState("")
  const [showSetupModal, setShowSetupModal] = useState(false)

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

  const handleSetupComplete = (provider, apiKey, apiSecret, webhookUrl) => {
    setShippingProviders([...shippingProviders, { provider, apiKey, apiSecret, webhookUrl }])
    setShowSetupModal(false)
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
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Other Settings</CardTitle>
                <CardDescription>Manage your account and preferences.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="notifications">Notifications</Label>
                      <Switch id="notifications" defaultChecked />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <Switch id="dark-mode" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Change Password</Label>
                    <div className="grid grid-cols-2 gap-6">
                      <Input id="password" type="password" placeholder="New password" />
                      <Input id="confirm-password" type="password" placeholder="Confirm password" />
                    </div>
                  </div>
                  <div className="w-1/6 grid gap-2">
                    <Label htmlFor="delete-account">Delete Account</Label>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      type="button"
                      className="bg-red-500 text-white hover:bg-red-600 text-xs px-2 py-1"
                      onClick={() => setShowDeleteConfirmation(true)}
                    >
                      Delete Account
                    </Button>
                  </div>
                  {showDeleteConfirmation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Are you sure you want to delete your account?</h2>
                        <div className="flex justify-end space-x-4">
                          <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
                          <Button variant="destructive" onClick={() => {
                            // Add account deletion logic here
                            setShowDeleteConfirmation(false)
                          }}>Delete</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
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
          {["DHD", "Yalidin Express", "UPS", "Go livri", "maystero delivery"].map((provider) => (
            <Button
              key={provider}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setSelectedProvider(provider)}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <img
                  src={`/placeholder.svg?height=24&width=24`}
                  alt={provider}
                  className="w-6 h-6"
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
        >
          
          <span className="sr-only">Close</span>
        </Button>
        <Steps shopData = {shopData} provider={selectedProvider} onComplete={handleSetupComplete} />
      </>
    )}
  </DialogContent>
</Dialog>
    </div>
  )
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}

