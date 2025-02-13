"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
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
import { Check, ArrowRight, ArrowLeft, ZoomIn, ZoomOut } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { updateShippingInfo } from "@/lib/hooks/settings"
import { providerConfigs, type ProviderConfig } from "../config/providerConfigs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface FormData {
  apiToken: string
  language: string
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768)
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
}

export function Steps({
  provider,
  onComplete,
  shopData,
}: {
  provider: string
  onComplete: (provider: string, data: FormData) => void
  shopData: string
}) {
  const isMobile = useIsMobile()
  const [currentStep, setCurrentStep] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)
  const [isZoomed, setIsZoomed] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const config: ProviderConfig = providerConfigs[provider] || providerConfigs["DHD"]
  const steps = config.steps

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setImageLoading(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setImageLoading(true)
    }
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const submissionData = { ...data, provider }
      await updateShippingInfo("8hlH0zIJbfNaCDfibG8K", submissionData)
      onComplete(provider, submissionData)

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

  return (
    <SidebarProvider>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="flex flex-col md:flex-row h-full md:h-[700px] w-full md:w-[900px] mx-auto bg-background rounded-lg shadow-lg overflow-hidden">
            {!isMobile && (
              <Sidebar className="w-full md:w-72 border-b md:border-r border-r-0 bg-muted/50 flex flex-col">
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
                            index < currentStep ? "text-primary" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium shrink-0 ${
                                currentStep === index
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : index < currentStep
                                    ? "bg-primary/20 border-primary text-primary"
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
            )}
            <div className="flex-1 flex flex-col w-full">
              {isMobile && (
                <div className="w-full bg-muted/50 p-4">
                  <Select
                    value={currentStep.toString()}
                    onValueChange={(value) => setCurrentStep(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a step" />
                    </SelectTrigger>
                    <SelectContent>
                      {steps.map((step, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {step.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Progress value={((currentStep + 1) / steps.length) * 100} className="rounded-none bg-primary/20" />
              <div className="flex-1 flex flex-col items-center justify-center p-10 space-y-8">
                <div className="text-center max-w-lg">
                  <h3 className="text-3xl font-bold mb-4">{steps[currentStep]?.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{steps[currentStep]?.description}</p>
                </div>
                {currentStep === steps.length - 1 ? (
                  <div className="w-full max-w-md space-y-4 px-4 md:px-0">
                    <div>
                      <label htmlFor="apiToken" className="block text-lg font-medium text-gray-700 mb-2">
                        API Token
                      </label>
                      <Input
                        id="apiToken"
                        type="text"
                        placeholder={`Enter your ${provider} API Token`}
                        {...register("apiToken", { required: true })}
                        className={`text-lg ${errors.apiToken ? "border-red-500" : ""}`}
                      />
                      {errors.apiToken && <p className="mt-1 text-sm text-red-500">This field is required</p>}
                    </div>
                    <div>
                      <label htmlFor="language" className="block text-lg font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <Select {...register("language", { required: true })}>
                        <SelectTrigger className="w-full text-lg">
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
                      {errors.language && <p className="mt-1 text-sm text-red-500">This field is required</p>}
                    </div>
                  </div>
                ) : steps[currentStep]?.image ? (
                  <div className="relative w-full max-w-2xl aspect-[16/9] bg-muted rounded-lg overflow-hidden group">
                    {imageLoading && <Skeleton className="absolute inset-0 z-10" />}
                    <Image
                      src={steps[currentStep].image || "/placeholder.svg"}
                      alt={`Step ${currentStep + 1} - ${steps[currentStep].title}`}
                      fill
                      className={`object-contain transition-transform duration-300 ${
                        isZoomed ? "scale-150" : "scale-100"
                      }`}
                      priority
                      onLoad={() => setImageLoading(false)}
                    />
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          size="icon"
                          variant="secondary"
                        >
                          <ZoomIn className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <div className="relative aspect-[16/9]">
                          <Image
                            src={steps[currentStep].image || "/placeholder.svg"}
                            alt={`Step ${currentStep + 1} - ${steps[currentStep].title}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      size="icon"
                      variant="secondary"
                      onClick={() => setIsZoomed(!isZoomed)}
                    >
                      {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
                    </Button>
                  </div>
                ) : null}
                <div className="flex justify-between w-full max-w-md pt-6 px-4 md:px-0">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="flex items-center gap-2 text-lg"
                    type="button"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Previous
                  </Button>
                  {currentStep < steps.length - 1 ? (
                    <Button onClick={handleNext} className="flex items-center gap-2 text-lg" type="button">
                      Next
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-lg">
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

