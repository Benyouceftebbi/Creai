"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export default function Component() {
  const [shippingProviders, setShippingProviders] = useState([
    { provider: "DHD", apiKey: "abc123", apiSecret: "def456", webhookUrl: "https://example.com/webhook" },
  ])
  const [partNameMessage, setPartNameMessage] = useState("")
  const [keywords, setKeywords] = useState("")
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const addShippingProvider = () => {
    setShippingProviders([...shippingProviders, { provider: "", apiKey: "", apiSecret: "", webhookUrl: "" }])
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

  const updatePartNameMessage = (value) => {
    setPartNameMessage(value)
  }

  const updateKeywords = (value) => {
    setKeywords(value)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto space-y-8">
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="grid gap-8">
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
                      onChange={(e) => updateKeywords(e.target.value)}
                      placeholder="Enter keywords"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Updated video section with new layout */}
            <div className="w-full mb-6 sm:mb-8">
              <div className="bg-[#faf5ff] p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-full sm:w-2/5">
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
                  <div className="w-full sm:w-3/5 space-y-3">
                    <div className="flex justify-between items-start">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-800">Ready to streamline your delivery updates?</h2>
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Our delivery update system keeps your customers informed in real-time. Track packages across multiple carriers, automate notifications, and improve customer satisfaction with timely updates about their deliveries.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Integration</CardTitle>
                <CardDescription>Configure your shipping provider settings.</CardDescription>
                <div className="ml-auto">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/80"
                    onClick={addShippingProvider}
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span className="sr-only">Add Shipping Provider</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form className="grid gap-6">
                  {shippingProviders.map((provider, index) => (
                    <div key={index} className="grid gap-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto bg-primary text-primary-foreground hover:bg-primary/80"
                        onClick={() => removeShippingProvider(index)}
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Remove Shipping Provider</span>
                      </Button>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="grid gap-2">
                          <Label htmlFor={`provider-${index}`}>Shipping Provider</Label>
                          <Select
                            id={`provider-${index}`}
                            defaultValue={provider.provider}
                            onValueChange={(value) => updateShippingProvider(index, "provider", value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DHD">DHD</SelectItem>
                              <SelectItem value="Yalidin Express">Yalidin Express</SelectItem>
                              <SelectItem value="UPS">UPS</SelectItem>
                              <SelectItem value="Go livri">Go livri</SelectItem>
                              <SelectItem value="maystero delivery">maystero delivery</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`api-key-${index}`}>API Key</Label>
                          <Input
                            id={`api-key-${index}`}
                            defaultValue={provider.apiKey}
                            onChange={(e) => updateShippingProvider(index, "apiKey", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="grid gap-2">
                          <Label htmlFor={`api-secret-${index}`}>API Secret</Label>
                          <Input
                            id={`api-secret-${index}`}
                            defaultValue={provider.apiSecret}
                            onChange={(e) => updateShippingProvider(index, "apiSecret", e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`webhook-url-${index}`}>Webhook URL</Label>
                          <Input
                            id={`webhook-url-${index}`}
                            defaultValue={provider.webhookUrl}
                            onChange={(e) => updateShippingProvider(index, "webhookUrl", e.target.value)}
                          />
                        </div>
                      </div>
                      {index < shippingProviders.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </form>
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
                  <div className="grid gap-2">
                    <Label htmlFor="part-name-message">Part Name Message</Label>
                    <Input
                      id="part-name-message"
                      value={partNameMessage}
                      onChange={(e) => updatePartNameMessage(e.target.value)}
                      placeholder="Enter the message to get the part name"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
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

