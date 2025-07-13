"use client"

import { useState, useCallback, useEffect } from "react" // Import useCallback and useMemo
import { OutputPanel } from "./components/panels/output-panel"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import type { CreativeMode, HistoryItem, CreationDetail } from "./components/types"
import { GenerationWizardModal } from "./components/modals/generation-wizard-modal"
import { WelcomeScreen } from "./components/core/welcome-screen"
import { CreationDetailModal } from "./components/modals/creation-detail-modal"
import { useShop } from "@/app/context/ShopContext"
import { doc, onSnapshot ,collection} from "firebase/firestore"
import { db, functions } from "@/firebase/firebase"
import { httpsCallable } from "firebase/functions"
import { PricingModal } from "@/components/ui/pricingModal"
// Add this import at the top of the file if it's missing
import { ImageViewerModal } from "./components/modals/image-viewer-modal"
// Declare the getDefaultImageSettings and getDefaultReelSettings functions
import { useTranslations } from "next-intl"
import { Play, X } from "lucide-react"
import { ConversionModal } from "@/app/components/Conversion-modal"
import { RatingModal } from "./components/ui/rating-modal"
import { GenerationTypeModal } from "./components/modals/generation-type-modal" // New import
import { PhoneNumberModal } from "./components/modals/phone-number-modal"
import { DownloadModal } from "./components/modals/download-modal"
import PaymentSuccessModal from "./components/modals/paymentSuccess."

// Declare the getDefaultImageSettings and getDefaultReelSettings functions

// Declare the getDefaultImageSettings and getDefaultReelSettings function

// Declare the getDefaultImageSettings and getDefaultReelSettings functions

// Declare the getDefaultImageSettings and getDefaultReelSettings functions

// Declare the getDefaultImageSettings and getDefaultReelSettings functions


const getDefaultImageSettings = (): any => {
  return {
    model: "DreamShaper XL",
    aspectRatio: "1024x1024",
    creativity: 8,
    quality: "Ultra",
    language: "en",
    outputs: 1,
    includeText: false,
  }
}

const getDefaultReelSettings = (): any => {
  return { reelModel: "expert", quality: "Pro", creativity: 9, outputs: 1, model: "expert", aspectRatio: "9:16" }
}

export interface Settings {
  aspectRatio: string
  creativity: number[]
  outputs: number
  model: string
  language: string
  includeText?: boolean
}

export interface ReelSettings {
  quality: string
  creativity: number[]
  outputs: number
  model: "normal" | "expert" | ""
  aspectRatio: string
}

const sampleInspirationItems: CreationDetail[] = [
  {
    id: "101",
    image: "/placeholder.svg?height=400&width=300",
    beforeImage: "/placeholder.svg?height=400&width=300",
    user: "ArtisanAI",
    avatar: "/placeholder.svg?height=32&width=32&text=AI",
    prompt: "A majestic fantasy landscape with floating islands and glowing waterfalls, digital painting style.",
    likes: 1250,
    type: "image",
    settings: { model: "DreamShaper XL", aspectRatio: "3:4", creativity: 8, quality: "Ultra" },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 5),
  },
  {
    id: "102",
    image: "/placeholder.svg?height=300&width=400",
    user: "TechDreamer",
    avatar: "/placeholder.svg?height=32&width=32&text=TD",
    prompt: "Close-up portrait of a futuristic robot with intricate details and glowing blue eyes, cinematic lighting.",
    likes: 980,
    type: "image",
    settings: { model: "Stable Diffusion 2.1", aspectRatio: "4:3", creativity: 7, quality: "HD" },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 3),
  },
  {
    id: "103",
    image: "/placeholder.svg?height=400&width=300",
    beforeImage: "/placeholder.svg?height=400&width=300",
    user: "MotionMagic",
    avatar: "/placeholder.svg?height=32&width=32&text=MM",
    prompt: "A character running through a forest, smooth animation, dynamic camera angle.",
    likes: 750,
    type: "reel",
    settings: { reelModel: "expert", quality: "Pro", creativity: 9 },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2),
  },
  {
    id: "104",
    image: "/placeholder.svg?height=300&width=400",
    user: "ColorBurst",
    avatar: "/placeholder.svg?height=32&width=32&text=CB",
    prompt: "An abstract explosion of vibrant colors, high energy, dynamic particles.",
    likes: 600,
    type: "image",
    settings: { model: "Kandinsky 2.2", aspectRatio: "16:9", creativity: 9, quality: "4K" },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 1),
  },
]

export default function AICreativePage() {
  const { creativeAiItems, creativeAiLoading, setShopData, shopData } = useShop() // Ensure shopData is destructured
  const [showModal, setShowModal] = useState(true)
  const [currentView, setCurrentView] = useState<"welcome" | "output">("welcome")
  const [activeMode, setActiveMode] = useState<CreativeMode>("image")
  const [currentGenerationType, setCurrentGenerationType] = useState<"image" | "reel" | null>(null)
  const [pendingImageId, setPendingImageId] = useState<string | null>(null)
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)

  const [isGenerationTypeModalOpen, setIsGenerationTypeModalOpen] = useState(false)

  const [isPhoneNumberModalOpen, setIsPhoneNumberModalOpen] = useState(false)
  const [isUpdatingPhoneNumber, setIsUpdatingPhoneNumber] = useState(false)
  // Updated pendingResults to store objects with url and id
  const [pendingResults, setPendingResults] = useState<{ url: string; url2: string | null; id: string }[]>([])

  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isVideoButtonAnimating, setIsVideoButtonAnimating] = useState(false)

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const [downloadModalData, setDownloadModalData] = useState<{
    imageUrl: string // Standard quality for preview/free download
    highQualityImageUrl: string // High quality for paid download
    imageIndex: number
    totalImages: number
    imageId: string // Added imageId
  } | null>(null)

  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  // Updated generatedOutputs to store objects with url and id
  const [generatedOutputs, setGeneratedOutputs] = useState<{ url: string; url2: string | null; id: string }[]>([])
  const [currentPromptForOutput, setCurrentPromptForOutput] = useState("")
  const [currentBatchTimestamp, setCurrentBatchTimestamp] = useState<Date | undefined>(undefined)
  const [currentProductUrlForOutput, setCurrentProductUrlForOutput] = useState<string | undefined>(undefined)

  const { toast } = useToast()
  const [userHistory, setUserHistory] = useState<HistoryItem[]>([])
  const t = useTranslations("creativeAi")

  const videoId = "1igoCOn1TvALIcksn9nthVLbbdWk7lGiS"
  const videoUrl = `https://www.youtube.com/embed/MoUSV-pg7ow`

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVideoButtonAnimating(true)
      setTimeout(() => setIsVideoButtonAnimating(false), 2000)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isVideoOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isVideoOpen])

  // Updated generatedItemViewerData to store objects with url, id, and index
  const [generatedItemViewerData, setGeneratedItemViewerData] = useState<{
    url: string
    url2: string | null
    id: string
    index: number
  } | null>(null)
  const [historyViewerData, setHistoryViewerData] = useState<{
    images: string[]
    images2?: string[]
    prompt: string
    createdAt: Date | undefined
    type: "image" | "reel"
    productUrl?: string
    id: string // Added id for history items
  } | null>(null)
  const [historyViewerIndex, setHistoryViewerIndex] = useState<number>(0)

  useEffect(() => {
    if (generatedItemViewerData || historyViewerData) {
      const timer = setTimeout(() => {
        setIsRatingModalOpen(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [generatedItemViewerData, historyViewerData])

  useEffect(() => {
    if (shopData.imageAi) {
      const transformedHistory = shopData.imageAi.map((item: any) => ({
        id: item.id || String(Date.now() + Math.random()),
        type: item.type || "image",
        prompt: item.prompt || "",
        results: Array.isArray(item.imagesUrl) ? item.imagesUrl : Array.isArray(item.results) ? item.results : [],
        results2: Array.isArray(item.imagesUrl2) ? item.imagesUrl2 : [],
        settings: typeof item.settings === "object" && item.settings !== null ? item.settings : {},
        createdAt: item.createdAt?.toDate ? item.createdAt.toDate() : new Date(item.createdAt || Date.now()),
        status: item.status || "completed",
        productUrl: item.productUrl,
      }))
      setUserHistory(transformedHistory as HistoryItem[])
    }
  }, [shopData.imageAi])

  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [wizardInitialPrompt, setWizardInitialPrompt] = useState("")
  const [wizardInitialImageSettings, setWizardInitialImageSettings] = useState<Partial<Settings>>(() =>
    getDefaultImageSettings(),
  )
  const [wizardInitialReelSettings, setWizardInitialReelSettings] = useState<Partial<ReelSettings>>(() =>
    getDefaultReelSettings(),
  )

  const [selectedInspiration, setSelectedInspiration] = useState<CreationDetail | null>(null)

  const handleStartCreation = useCallback((type: "image" | "reel") => {
    setCurrentGenerationType(type)
    setActiveMode(type)
    setGeneratedOutputs([]) // Clear outputs
    setIsGenerating(false)
    setCurrentView("output")
    setWizardInitialPrompt("")
    if (type === "image") setWizardInitialImageSettings(getDefaultImageSettings())
    else if (type === "reel") setWizardInitialReelSettings(getDefaultReelSettings())
  }, [])

  const handleOpenGenerationTypeModal = useCallback(() => {
    setIsGenerationTypeModalOpen(true)
  }, [])

  const handleGenerationTypeSelect = useCallback((type: "image" | "reel") => {
    setCurrentGenerationType(type)
    setActiveMode(type)
    setGeneratedOutputs([]) // Clear outputs
    setIsGenerating(false)
    setCurrentView("output")
    setWizardInitialPrompt("")
  }, [])

  const handleInitiateNewGenerationWizard = useCallback(() => {
    const typeToUse = currentGenerationType || activeMode || "image"
    setCurrentGenerationType(typeToUse as "image" | "reel")
    setWizardInitialPrompt("")
    if (typeToUse === "image") setWizardInitialImageSettings(getDefaultImageSettings())
    else setWizardInitialReelSettings(getDefaultReelSettings())
    setIsWizardOpen(true)
  }, [currentGenerationType, activeMode])

  function fileToDataUrlObject(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve({ name: file.name, type: file.type, base64: reader.result })
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const downloadFile = useCallback(
    async (imageUrl: string, fileName = "image.png") => {
      try {
        const downloadImage = httpsCallable(functions, "downloadImage")

        const result = await downloadImage({ url: imageUrl })
        const { base64, mimeType } = result.data

        const response = await fetch(`data:${mimeType};base64,${base64}`)
        const blob = await response.blob()

        const blobUrl = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = blobUrl
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        a.remove()

        URL.revokeObjectURL(blobUrl)

        toast({
          title: t("downloadStarted"),
          description: t("downloadInProgress"),
        })
      } catch (error) {
        console.error("Error downloading image via Firebase function:", error)
        toast({
          title: t("error"),
          description: t("cannotDownloadImage"),
          variant: "destructive",
        })
      }
    },
    [toast, t],
  )

  const handleWizardSubmit = useCallback(
    async (data: any) => {
      const typeToUse =
        currentGenerationType || (activeMode === "image" || activeMode === "reel" ? activeMode : "image")
      if (!typeToUse) return

      setIsWizardOpen(false)
      setIsGenerating(true)
      setGeneratedOutputs([]) // Clear outputs
      setGenerationProgress(0)
      setCurrentPromptForOutput(data.prompt)

      // Handle multiple product images - use the first one for preview URL
      const firstProductImage = data.productImages?.[0]
      setCurrentProductUrlForOutput(firstProductImage ? URL.createObjectURL(firstProductImage) : undefined)

      setActiveMode(typeToUse)
      setCurrentView("output")
      setCurrentBatchTimestamp(new Date())

      let currentProgress = 0
      let progressInterval: NodeJS.Timeout
      const isReelGeneration = typeToUse === "reel"
      const TARGET_DURATION = isReelGeneration ? 90000 : 15000
      const TOTAL_TICKS = 100
      const INTERVAL_MS = TARGET_DURATION / TOTAL_TICKS

      progressInterval = setInterval(() => {
        currentProgress += 1
        if (currentProgress >= 95 && !pendingImageId) setGenerationProgress(95)
        else if (currentProgress < 100) setGenerationProgress(currentProgress)
      }, INTERVAL_MS)

      try {
        const generateImageAd = httpsCallable(functions, "generateImageAd")

        // Convert all product images to data objects
        const productDataArray = data.productImages
          ? await Promise.all(data.productImages.map((file: File) => fileToDataUrlObject(file)))
          : []

        // Convert single inspiration image to data object (for image generation)
        const inspirationData = data.inspirationImage ? await fileToDataUrlObject(data.inspirationImage) : null

        const settingsForGeneration = typeToUse === "image" ? data.settings : { ...data.settings }

        const result = await generateImageAd({
          productFile: productDataArray, // Array of product images
          adInsiprationFile: inspirationData, // Single inspiration image
          prompt: data.prompt,
          shopId: shopData.id,
          n: settingsForGeneration.outputs || 1,
          size: settingsForGeneration.aspectRatio || (typeToUse === "image" ? "1024x1024" : "1024x576"),
          type: typeToUse === "image" ? "image" : "video",
          language: settingsForGeneration.language || "en",
          includeText: typeToUse === "image" ? settingsForGeneration.includeText : undefined,
        })

        if (result.data?.reason === "tokens") {
          setIsGenerating(false)
          setGenerationProgress(0)
          setIsPricingModalOpen(true)
          toast({
            title: t("generationFailed"),
            description: t("notEnoughTokens"),
            variant: "destructive",
          })
          return
        }
        if (result.data && result.data.imageId) {
          setPendingImageId(result.data.imageId)

          if (result.data.tokens !== undefined) {
            setShopData((prev) => ({
              ...prev,
              tokens: result.data.tokens,
            }))
          }
        } else throw new Error("Image ID not returned from function")
      } catch (error) {
        console.error("Error during generation submission:", error)
        toast({
          title: t("generationFailed"),
          description: (error as Error).message || t("couldNotSubmitRequest"),
          variant: "destructive",
        })
        setIsGenerating(false)
        setGenerationProgress(0)
        clearInterval(progressInterval)
      }
      setTimeout(() => clearInterval(progressInterval), TARGET_DURATION + 10000)
    },
    [currentGenerationType, activeMode, toast, shopData.id, pendingImageId, t, setShopData],
  )

  const handlePhoneNumberSubmit = useCallback(
    async (phoneNumber: string) => {
      setIsUpdatingPhoneNumber(true)
      try {
        const updatePhoneNumber = httpsCallable(functions, "updatePhoneNumber")
        const result = await updatePhoneNumber({
          shopId: shopData.id,
          phoneNumber: phoneNumber,
        })

        if (result.data?.success) {
          setShopData((prev) => ({
            ...prev,
            phoneNumber: phoneNumber,
          }))

          // When phone number is saved, set the generated outputs
          setGeneratedOutputs(pendingResults)
          setPendingResults([])
          setIsPhoneNumberModalOpen(false)

          toast({
            title: t("phoneNumberUpdated"),
            description: t("phoneNumberSaved"),
          })
        } else {
          throw new Error(result.data?.error || "Failed to update phone number")
        }
      } catch (error) {
        console.error("Error updating phone number:", error)
        toast({
          title: t("error"),
          description: t("failedToUpdatePhone"),
          variant: "destructive",
        })
      } finally {
        setIsUpdatingPhoneNumber(false)
      }
    },
    [shopData.id, pendingResults, setShopData, toast, t],
  )

  useEffect(() => {
    const typeToUse = currentGenerationType || (activeMode === "image" || activeMode === "reel" ? activeMode : "image")
    if (!pendingImageId || !shopData.id || !typeToUse) return

    const collectionRef = collection(db, "Shops", shopData.id, "ImageAi")
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.doc.id === pendingImageId) {
            const data = change.doc.data()
            // Always store both imagesUrl and imagesUrl2 if they exist
            if (data.imagesUrl?.length) {
              const outputsWithIds = data.imagesUrl.map((url: string, idx: number) => ({
                url: url, // Standard quality
                url2: data.imagesUrl2?.[idx] || null, // High quality, if available
                id: pendingImageId!,
              }))

              if (!shopData.phoneNumber || shopData.phoneNumber === "") {
                setPendingResults(outputsWithIds) // Store objects with id and url2
                setIsPhoneNumberModalOpen(true)
                setGenerationProgress(100)
                setIsGenerating(false)
              } else {
                setGeneratedOutputs(outputsWithIds) // Store objects with id and url2
                setGenerationProgress(100)
                setIsGenerating(false)
              }

              setCurrentBatchTimestamp(data.createdAt?.toDate ? data.createdAt.toDate() : new Date())
              setCurrentProductUrlForOutput(data.productUrl)

              const newHistoryItem: HistoryItem = {
                id: pendingImageId,
                type: typeToUse,
                prompt: data.prompt || currentPromptForOutput,
                results: Array.isArray(data.imagesUrl) ? data.imagesUrl : [],
                results2: Array.isArray(data.imagesUrl2) ? data.imagesUrl2 : [], // Ensure results2 is stored
                settings: typeof data.settings === "object" && data.settings !== null ? data.settings : {},
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
                status: "completed",
                productUrl: data.productUrl,
              }
              setUserHistory((prev) => [newHistoryItem, ...prev.filter((item) => item.id !== newHistoryItem.id)])

              if (shopData.phoneNumber && shopData.phoneNumber !== "") {
                toast({ title: t("success"), description: t("generationCompleted") })
              }

              setPendingImageId(null) // Mark as completed/processed
            }
          }
        })
      },
      (error) => {
        console.error("Error in Firestore snapshot listener:", error)
        toast({
          title: t("realtimeUpdateError"),
          description: t("couldNotListenUpdates"),
          variant: "destructive",
        })
        setIsGenerating(false)
        setGenerationProgress(0)
        setPendingImageId(null)
      },
    )


    return () => {
      unsubscribe()
    }
  }, [
    pendingImageId,
    shopData.id,
    shopData.phoneNumber,
    currentGenerationType,
    activeMode,
    toast,
    currentPromptForOutput,
    t,
    setShopData,
  ])

  const handleImageAction = useCallback(
    (action: string, imageIndex: number) => {
      const item = generatedOutputs[imageIndex]
      if (!item) return

      if (action === "download") {
        setDownloadModalData({
          imageUrl: item.url, // Standard quality for preview/free download
          highQualityImageUrl: item.url2 || item.url, // High quality for paid download, fallback to standard
          imageIndex: imageIndex,
          totalImages: generatedOutputs.length,
          imageId: item.id,
        })
        setIsDownloadModalOpen(true)
      } else if (action === "view") {
        // For viewer, display high quality if premium, otherwise standard
        const urlToView = shopData.isPremium && item.url2 ? item.url2 : item.url
        setGeneratedItemViewerData({ url: urlToView, url2: item.url2, id: item.id, index: imageIndex })
      }
    },
    [generatedOutputs, shopData.isPremium],
  )

  const handleDownloadAllGenerated = useCallback(() => {
    if (generatedOutputs.length === 0) {
      toast({ title: t("nothingToDownload"), description: t("noItemsGenerated") })
      return
    }
    const typeForAction = currentGenerationType || activeMode
    generatedOutputs.forEach((item, index) => {
      if (item.url) {
        let extension = typeForAction === "reel" ? ".mp4" : ".png"
        if (item.url.includes(".svg")) extension = ".svg"
        else if (item.url.includes(".jpg") || item.url.includes(".jpeg")) extension = ".jpg"
        else if (item.url.includes(".mp4")) extension = ".mp4"
        const filename = `${typeForAction}_batch_${Date.now()}_${index + 1}${extension}`
        setTimeout(() => downloadFile(item.url, filename), index * 500)
      }
    })
  }, [generatedOutputs, currentGenerationType, activeMode, downloadFile, toast, t])

  const handleOpenHistoryItemDetail = useCallback(
    (item: HistoryItem) => {
      // For history viewer, display high-quality if premium, otherwise standard
      const imagesToView = shopData.isPremium && item.results2?.length ? item.results2 : item.results

      setHistoryViewerData({
        images: imagesToView, // This is the array of images to display (could be HQ if premium)
        images2: item.results2, // This is the array of high-quality images (if available)
        prompt: item.prompt,
        createdAt: item.createdAt,
        type: item.type,
        productUrl: item.productUrl,
        id: item.id, // Pass the history item's ID
      })
      setHistoryViewerIndex(0)
    },
    [shopData.isPremium],
  )

  const handleNextHistoryImage = useCallback(() => {
    if (historyViewerData) {
      setHistoryViewerIndex((prev) => Math.min(prev + 1, historyViewerData.images.length - 1))
    }
  }, [historyViewerData])

  const handlePreviousHistoryImage = useCallback(() => {
    if (historyViewerData) {
      setHistoryViewerIndex((prev) => Math.max(prev - 1, 0))
    }
  }, [historyViewerData])

  const handleCloseHistoryViewer = useCallback(() => {
    setHistoryViewerData(null)
    setHistoryViewerIndex(0)
  }, [])

  const handleNextGeneratedItem = useCallback(() => {
    if (generatedItemViewerData && generatedItemViewerData.index < generatedOutputs.length - 1) {
      const nextIndex = generatedItemViewerData.index + 1
      const nextItem = generatedOutputs[nextIndex]
      const urlToView = shopData.isPremium && nextItem.url2 ? nextItem.url2 : nextItem.url
      setGeneratedItemViewerData({ url: urlToView, url2: nextItem.url2, id: nextItem.id, index: nextIndex })
    }
  }, [generatedItemViewerData, generatedOutputs, shopData.isPremium])

  const handlePreviousGeneratedItem = useCallback(() => {
    if (generatedItemViewerData && generatedItemViewerData.index > 0) {
      const prevIndex = generatedItemViewerData.index - 1
      const prevItem = generatedOutputs[prevIndex]
      const urlToView = shopData.isPremium && prevItem.url2 ? prevItem.url2 : prevItem.url
      setGeneratedItemViewerData({ url: urlToView, url2: prevItem.url2, id: prevItem.id, index: prevIndex })
    }
  }, [generatedItemViewerData, generatedOutputs, shopData.isPremium])

  const handleCloseGeneratedItemViewer = useCallback(() => {
    setGeneratedItemViewerData(null)
  }, [])

  const handleDeleteHistoryItem = useCallback(
    (id: string) => {
      setUserHistory((prev) => prev.filter((item) => item.id !== id))
      toast({ title: t("itemDeleted"), description: t("itemRemovedFromHistory") })
    },
    [toast, t],
  )

  const handleRegenerateFromHistory = useCallback((item: HistoryItem) => {
    if (item.type === "image" || item.type === "reel") {
      setCurrentGenerationType(item.type)
      setActiveMode(item.type)
      const adConceptLines = item.prompt.split("\n")
      const shortPromptGuess =
        adConceptLines
          .find((line) => line.startsWith("**Core Message/Theme:**"))
          ?.replace("**Core Message/Theme:**", "")
          .trim() ||
        adConceptLines
          .find((line) => line.startsWith("**Generated Prompt Guidance (for AI):**"))
          ?.split("focusing on:")[1]
          ?.split(".")[0]
          ?.trim() ||
        item.prompt
      setWizardInitialPrompt(shortPromptGuess)
      if (item.type === "image") {
        setWizardInitialImageSettings({ ...getDefaultImageSettings(), ...(item.settings as Settings) })
      } else if (item.type === "reel") {
        setWizardInitialReelSettings({ ...getDefaultReelSettings(), ...(item.settings as ReelSettings) })
      }
      setIsWizardOpen(true)
    }
  }, [])

  const handleRegenerateVariation = useCallback(
    (imageIndex: number) => {
      const typeForVariation = currentGenerationType || activeMode
      console.log(`Regenerate variation for ${typeForVariation} ${imageIndex}`)
      toast({ title: t("variationRequested") })
    },
    [currentGenerationType, activeMode, toast, t],
  )

  const navigateToWelcome = useCallback(() => {
    setCurrentView("welcome")
    setGeneratedOutputs([]) // Clear outputs
    setIsGenerating(false)
  }, [])

  const handleInspirationClick = useCallback((creation: CreationDetail) => {
    setSelectedInspiration(creation)
  }, [])

  const handleOpenDownloadModalFromViewer = useCallback(
    (imageUrl: string, highQualityImageUrl: string, imageIndex: number, imageId: string) => {
      setDownloadModalData({
        imageUrl,
        highQualityImageUrl,
        imageIndex,
        totalImages: generatedOutputs.length, // Or historyViewerData.images.length if from history
        imageId,
      })
      setIsDownloadModalOpen(true)
    },
    [generatedOutputs],
  )

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex flex-col relative overflow-hidden border-t border-border/50">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentView === "welcome" ? (
            <WelcomeScreen
              onStartCreation={handleStartCreation}
              inspirationItems={creativeAiItems || sampleInspirationItems}
              onInspirationClick={handleInspirationClick}
              isLoadingInspirations={creativeAiLoading}
              onOpenGenerationTypeModal={handleOpenGenerationTypeModal}
            />
          ) : (
            <OutputPanel
              generatedImages={generatedOutputs} // Now passes objects
              isGenerating={isGenerating}
              onImageAction={handleImageAction}
              onRegenerateVariation={handleRegenerateVariation}
              generationProgress={generationProgress}
              mode={activeMode}
              originalPrompt={currentPromptForOutput}
              userHistory={userHistory}
              onOpenHistoryItem={handleOpenHistoryItemDetail}
              onDeleteHistoryItem={handleDeleteHistoryItem}
              onRegenerateFromHistory={handleRegenerateFromHistory}
              onInitiateNewGeneration={handleInitiateNewGenerationWizard}
              onNavigateBack={navigateToWelcome}
              onDownloadAll={handleDownloadAllGenerated}
              currentBatchTimestamp={currentBatchTimestamp}
            />
          )}
        </div>
      </div>

      {/* Generation Type Modal */}
      <GenerationTypeModal
        isOpen={isGenerationTypeModalOpen}
        onClose={() => setIsGenerationTypeModalOpen(false)}
        onSelectType={handleGenerationTypeSelect}
      />

      {isWizardOpen && (
        <GenerationWizardModal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          generationType={
            currentGenerationType || (activeMode === "image" || activeMode === "reel" ? activeMode : "image")
          }
          onSubmit={handleWizardSubmit}
          initialPrompt={wizardInitialPrompt}
          initialImageSettings={
            (currentGenerationType || activeMode) === "image" ? wizardInitialImageSettings : undefined
          }
          initialReelSettings={(currentGenerationType || activeMode) === "reel" ? wizardInitialReelSettings : undefined}
        />
      )}

      {selectedInspiration && (
        <CreationDetailModal creation={selectedInspiration} onClose={() => setSelectedInspiration(null)} />
      )}

      {historyViewerData && historyViewerData.images && historyViewerData.images.length > 0 && (
        <ImageViewerModal
          image={historyViewerData.images[historyViewerIndex]}
          imageIndex={historyViewerIndex}
          images={historyViewerData.images}
          images2={historyViewerData.images2} // Pass high-quality images from history
          onClose={handleCloseHistoryViewer}
          onNext={handleNextHistoryImage}
          onPrevious={handlePreviousHistoryImage}
          originalPrompt={historyViewerData.prompt}
          createdAt={historyViewerData.createdAt}
          isReel={historyViewerData.type === "reel"}
          productUrl={historyViewerData.productUrl}
          imageId={historyViewerData.id} // Pass the imageId
          onOpenDownloadModal={handleOpenDownloadModalFromViewer} // Use the new handler
        />
      )}

      {generatedItemViewerData && (
        <ImageViewerModal
          image={generatedItemViewerData.url} // Use .url
          imageIndex={generatedItemViewerData.index}
          images={generatedOutputs.map((item) => item.url)} // Pass only standard URLs to images prop
          images2={generatedOutputs.map((item) => item.url2 || item.url)} // Pass high-quality URLs to images2 prop
          onClose={handleCloseGeneratedItemViewer}
          onNext={handleNextGeneratedItem}
          onPrevious={handlePreviousGeneratedItem}
          originalPrompt={currentPromptForOutput}
          createdAt={currentBatchTimestamp}
          isReel={activeMode === "reel"}
          productUrl={currentProductUrlForOutput}
          imageId={generatedItemViewerData.id} // Pass the imageId
          onOpenDownloadModal={handleOpenDownloadModalFromViewer} // Use the new handler
        />
      )}

      {isPricingModalOpen && <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />}

      {isDownloadModalOpen && downloadModalData && (
        <DownloadModal
          isOpen={isDownloadModalOpen}
          onClose={() => {
            setIsDownloadModalOpen(false)
            setDownloadModalData(null)
          }}
          imageUrl={downloadModalData.imageUrl}
          highQualityImageUrl={downloadModalData.highQualityImageUrl} // Pass high quality URL
          imageIndex={downloadModalData.imageIndex}
          totalImages={downloadModalData.totalImages}
          onDownloadWithWatermark={downloadFile}
          imageId={downloadModalData.imageId} // Pass the imageId
        />
      )}

      {isPhoneNumberModalOpen && (
        <PhoneNumberModal
          isOpen={isPhoneNumberModalOpen}
          onClose={() => setIsPhoneNumberModalOpen(false)}
          onSubmit={handlePhoneNumberSubmit}
          isLoading={isUpdatingPhoneNumber}
        />
      )}
      <PaymentSuccessModal />

      <Toaster />
    </div>
  )
}
