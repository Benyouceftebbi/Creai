"use client"

import Image from "next/image"
import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Check, ArrowRight, ArrowLeft, Copy, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { updateShippingInfo } from "@/lib/hooks/settings"
import { providerConfigs, type ProviderConfig } from "../config/providerConfigs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormData {
  [key: string]: string
}

export function Steps({
  provider,
  onComplete,
  shopData
}: { provider: string; onComplete: (provider: string, data: FormData) => void; shopData: string }) {
  console.log('ok',shopData);
  
  const [currentStep, setCurrentStep] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)
  const [copiedName, setCopiedName] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [language, setLanguage] = useState("fr")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const config: ProviderConfig = providerConfigs[provider] || providerConfigs["Yalidin Express"]
  const steps = config.steps

  // This would typically come from your backend or configuration
  const name = "ColiTrack"
  const webhookEmail = "your-webhook@example.com"
  const webhookLink = "https://your-app.com/api/yalidine-webhook"

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setImageLoading(true)
      setCopiedName(false)
      setCopiedEmail(false)
      setCopiedLink(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setImageLoading(true)
      setCopiedName(false)
      setCopiedEmail(false)
      setCopiedLink(false)
    }
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await updateShippingInfo('8hlH0zIJbfNaCDfibG8K', { ...data, provider, lng: language })
      onComplete(provider, { ...data, lng: language })
      toast({
        title: "Setup completed",
        description: "Your shipping information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your shipping information. Please try again.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string, setCopiedState: (value: boolean) => void) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedState(true)
      toast({
        title: "Copied to clipboard",
        description: "The information has been copied to your clipboard.",
      })
      setTimeout(() => setCopiedState(false), 3000)
    })
  }

  return (
    <SidebarProvider>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="flex h-[600px] w-[850px] mx-auto bg-background rounded-lg shadow-lg overflow-hidden">
            <Sidebar className="w-64 border-r bg-muted/50 flex flex-col">
              <SidebarContent className="flex-1 overflow-y-auto py-6">
                <SidebarMenu className="relative">
                  <div
                    className="absolute left-8 top-[1.75rem] bottom-[1.75rem] w-[2px] bg-gray-300"
                    aria-hidden="true"
                  />
                  {steps.map((step, index) => (
                    <SidebarMenuItem key={index} className="relative z-10">
                      <SidebarMenuButton
                        onClick={() => setCurrentStep(index)}
                        isActive={currentStep === index}
                        className={`py-3 px-4 w-full text-left hover:bg-muted transition-colors duration-200 ${
                          index < currentStep ? "text-green-600" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium shrink-0 ${
                              currentStep === index
                                ? "bg-primary border-primary text-primary-foreground"
                                : index < currentStep
                                  ? "bg-green-100 border-green-500 text-green-600"
                                  : "bg-background border-gray-300"
                            }`}
                          >
                            {index < currentStep ? <Check className="h-5 w-5" /> : index + 1}
                          </span>
                          <span className="text-sm font-medium">{step.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
            <div className="flex-1 flex flex-col">
              <Progress value={((currentStep + 1) / steps.length) * 100} className="rounded-none" />
              <div className="flex-1 flex flex-col items-center justify-center p-10 space-y-8">
                <div className="text-center max-w-md">
                  <h3 className="text-2xl font-semibold mb-3">{steps[currentStep]?.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{steps[currentStep]?.description}</p>
                </div>
                {currentStep === steps.length - 3 ? (
                  <div className="w-full max-w-sm space-y-3">
                    <div className="flex items-center space-x-2">
                      <Input value={name} readOnly className="bg-muted flex-grow" />
                      <Button
                        onClick={() => copyToClipboard(name, setCopiedName)}
                        className="flex items-center justify-center"
                        size="icon"
                        type="button"
                      >
                        {copiedName ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input value={webhookEmail} readOnly className="bg-muted flex-grow" />
                      <Button
                        onClick={() => copyToClipboard(webhookEmail, setCopiedEmail)}
                        className="flex items-center justify-center"
                        size="icon"
                        type="button"
                      >
                        {copiedEmail ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input value={webhookLink} readOnly className="bg-muted flex-grow" />
                      <Button
                        onClick={() => copyToClipboard(webhookLink, setCopiedLink)}
                        className="flex items-center justify-center"
                        size="icon"
                        type="button"
                      >
                        {copiedLink ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ) : currentStep === steps.length - 2 ? (
                  <div className="w-full max-w-sm space-y-3">
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                      </label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          {config.languageOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {Object.entries(config.fields).map(([key, field]) => (
                      <div key={key}>
                        <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                        </label>
                        <Input
                          id={key}
                          type={field.type}
                          placeholder={field.placeholder}
                          {...register(key, { required: true })}
                          className={errors[key] ? "border-red-500" : ""}
                        />
                        {errors[key] && <p className="mt-1 text-xs text-red-500">This field is required</p>}
                      </div>
                    ))}
                  </div>
                ) : steps[currentStep]?.image ? (
                  <div className="relative w-full max-w-sm aspect-video bg-muted rounded-lg overflow-hidden">
                    {imageLoading && <Skeleton className="absolute inset-0 z-10" />}
                    <Image
                      src={steps[currentStep].image || "/placeholder.svg"}
                      alt={`Step ${currentStep + 1} - ${steps[currentStep].title}`}
                      fill
                      className="object-cover"
                      priority
                      onLoad={() => setImageLoading(false)}
                    />
                  </div>
                ) : null}
                <div className="flex justify-between w-full max-w-sm pt-4">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="flex items-center gap-2"
                    type="button"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  {currentStep < steps.length - 1 ? (
                    <Button onClick={handleNext} className="flex items-center gap-2" type="button">
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" className="bg-black hover:bg-black/90">
                      Finish Setup
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </SidebarProvider>
  )
}

