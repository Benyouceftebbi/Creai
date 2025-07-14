"use client"

import { ArrowUpRight, Sparkles, Zap, Wand2, Palette, Brain, Stars } from "lucide-react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { doc, getDocs, collection, onSnapshot, query, where, Timestamp, orderBy, limit } from "firebase/firestore"
import { db } from "@/firebase/firebase"
import type { DateRange } from "react-day-picker"

interface ShopData {
  isPremium: string | null
  phoneNumber: unknown
  id?: string
  senderId?: string
  smsToken?: string
  tokens?: number
  smsReminder?: string[]
  senderIdRequest?: {
    status: string
    requestDate: Date
    expectedDeliveryDate: Date
    senderId: string
  }
  deliveryCompany?: string
  orders?: any[] // Add orders array to store retrieved orders
  sms?: any[]
  tracking?: any[]
  smsCampaign?: any[]
}

interface ShopContextProps {
  shopData: ShopData
  setShopData: (shopData: ShopData | ((prev: ShopData) => ShopData)) => void
  loading: boolean
  error: string | null
  shops: any[]
  setShops: (shops: any[]) => void
  dateRange: DateRange | undefined
  setDateRange: (dateRange: DateRange) => void
  // updateOrderStatus: (orderId: string, status: string) => Promise<boolean>
}

const ShopContext = createContext<ShopContextProps>({
  shopData: {},
  setShopData: () => {},
  loading: true,
  error: null,
  shops: [],
  setShops: () => {},
  dateRange: undefined,
  setDateRange: () => {},
  //  updateOrderStatus: async () => false,
})

interface ShopProviderProps {
  children: ReactNode
  userId?: string
  userEmail?: string
}

export const ShopProvider = ({ children, userId, userEmail }: ShopProviderProps) => {
  const [shopData, setShopData] = useState<ShopData>({})
  const [shops, setShops] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [creativeAiItems, setCreativeAiItems] = useState<any[]>([])
  const [creativeAiLoading, setCreativeAiLoading] = useState<boolean>(true)
  const [creativeAiError, setCreativeAiError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return {
      from: new Date(new Date().setHours(0, 0, 0, 0)),
      to: new Date(tomorrow.setHours(23, 59, 59, 999)),
    }
  })

  // Helper function to convert JavaScript Date to Firestore Timestamp
  const dateToTimestamp = (date: Date): Timestamp => {
    return Timestamp.fromDate(date)
  }

  // Helper function to convert Firestore Timestamp to JavaScript Date
  const timestampToDate = (timestamp: any): Date => {
    // If it's a Firestore Timestamp object with toDate method
    if (timestamp && typeof timestamp.toDate === "function") {
      return timestamp.toDate()
    }
    // Handle Firestore timestamp object with seconds and nanoseconds
    if (timestamp && timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
      return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
    }
    // If it's already a Date or a string, convert or return as is
    if (timestamp instanceof Date) {
      return timestamp
    }
    // If it's a string or number, convert to Date
    if (timestamp) {
      return new Date(timestamp)
    }
    // Default to current date if timestamp is undefined or null
    return new Date()
  }

  useEffect(() => {
    const fetchShopData = async () => {
      if (!userEmail) {
        console.log("No user email provided")
        setLoading(false)
        return
      }

      try {
        const shopsQuery = query(collection(db, "Shops"), where("email", "==", userEmail))
        const shopDocs = await getDocs(shopsQuery)

        if (shopDocs.empty) {
          console.log("No shop data found")
          setError("No shop data found")
          setLoading(false)
          return
        }

        const fetchedShops = []
        for (const shopDoc of shopDocs.docs) {
          const shopData = { ...shopDoc.data(), id: shopDoc.id }
          const shopRef = doc(db, "Shops", shopDoc.id)

          // Convert dateRange to Firestore timestamps
          const fromTimestamp = dateRange?.from ? dateToTimestamp(dateRange.from) : null
          const toTimestamp = dateRange?.to ? dateToTimestamp(dateRange.to) : null

          // Firestore query conditions for SMS and Tracking collections
          const smsQuery =
            fromTimestamp && toTimestamp
              ? query(
                  collection(shopRef, "SMS"),
                  where("createdAt", ">=", fromTimestamp),
                  where("createdAt", "<=", toTimestamp),
                )
              : collection(shopRef, "SMS")

          const imageAiQuery =
            fromTimestamp && toTimestamp
              ? query(
                  collection(shopRef, "ImageAi"),
                  where("createdAt", ">=", fromTimestamp),
                  where("createdAt", "<=", toTimestamp),
                )
              : collection(shopRef, "ImageAi")

          const trackingQuery =
            fromTimestamp && toTimestamp
              ? query(
                  collection(shopRef, "Tracking"),
                  where("lastUpdated", ">=", fromTimestamp),
                  where("lastUpdated", "<=", toTimestamp),
                )
              : collection(shopRef, "Tracking")

          // Add query for OrdersRetrieved collection with timestamp handling
          const ordersQuery =
            fromTimestamp && toTimestamp
              ? query(
                  collection(shopRef, "OrdersRetrieved"),
                  where("timestamp", ">=", fromTimestamp),
                  where("timestamp", "<=", toTimestamp),
                )
              : collection(shopRef, "OrdersRetrieved")

          const smsCampaignQuery = collection(shopRef, "SMScampaign")

          // Fetch subcollections in parallel
          const [smsDocs, trackingDocs, smsCampaignDocs, ordersDocs, imageAiDocs] = await Promise.all([
            getDocs(smsQuery),
            getDocs(trackingQuery),
            getDocs(smsCampaignQuery),
            getDocs(ordersQuery),
            getDocs(imageAiQuery),
          ])

          const trackingMap = {}
          const smsData = []
          const trackingData = []
          const ordersData = []
          const imageAiData = []

          // Process orders data - convert timestamps to dates
          ordersDocs.docs.forEach((orderDoc) => {
            const orderData = orderDoc.data()
            // Convert timestamp fields to JavaScript Date objects
            if (orderData.timestamp) {
              orderData.timestamp = timestampToDate(orderData.timestamp)
            }
            // Handle nested timestamp fields in orderData
            if (orderData.orderData && orderData.orderData.message_time) {
              orderData.orderData.message_time.value = timestampToDate(orderData.orderData.message_time.value)
            }
            ordersData.push({
              ...orderData,
              id: orderDoc.id,
            })
          })

          // Process tracking data
          trackingDocs.docs.forEach((trackingDoc) => {
            const trackingInfo = { ...trackingDoc.data(), id: trackingDoc.id }
            // Convert timestamp fields
            if (trackingInfo.lastUpdated) {
              trackingInfo.lastUpdated = timestampToDate(trackingInfo.lastUpdated)
            }
            trackingMap[trackingDoc.id] = trackingInfo.lastStatus || null
            // Find related SMS documents
            const relatedSmsDocs = smsDocs.docs.filter((smsDoc) => smsDoc.data().trackingId === trackingInfo.id)
            const messageTypes = relatedSmsDocs.map((smsDoc) => smsDoc.data().type)
            trackingInfo.messageTypes = messageTypes
            trackingInfo.phoneNumber = trackingInfo.data?.contact_phone || trackingInfo.data?.phone
            trackingInfo.deliveryType =
              trackingInfo.data?.stop_desk === 1 || trackingInfo.data?.stopdesk_id != null ? "stopdesk" : "domicile"
            trackingData.push(trackingInfo)
          })

          imageAiDocs.docs.forEach((imageAiDoc) => {
            const imageAiInfo = imageAiDoc.data()
            // Convert timestamp fields
            if (imageAiInfo.createdAt) {
              imageAiInfo.createdAt = timestampToDate(imageAiInfo.createdAt)
            }
            imageAiData.push({
              ...imageAiInfo,
              id: imageAiDoc.id,
            })
          })

          // Process SMS data
          smsDocs.docs.forEach((smsDoc) => {
            const smsInfo = smsDoc.data()
            // Convert timestamp fields
            if (smsInfo.createdAt) {
              smsInfo.createdAt = timestampToDate(smsInfo.createdAt)
            }
            smsData.push({
              ...smsInfo,
              id: smsDoc.id,
              lastStatus: trackingMap[smsInfo.trackingId] || null,
            })
          })

          // Process SMS campaigns
          const smsCampaignData = smsCampaignDocs.docs.map((smsDoc) => {
            const campaignData = smsDoc.data()
            // Convert timestamp fields
            if (campaignData.createdAt) {
              campaignData.createdAt = timestampToDate(campaignData.createdAt)
            }
            return {
              ...campaignData,
              id: smsDoc.id,
            }
          })

          // Attach subcollections
          shopData.sms = smsData
          shopData.tracking = trackingData
          shopData.smsCampaign = smsCampaignData
          shopData.imageai = imageAiData
          // Combine both types of orders
          shopData.orders = ordersData
          fetchedShops.push(shopData)
        }

        setShopData(fetchedShops[0] || {})
        setShops(fetchedShops)
      } catch (err) {
        console.error("Error fetching shop data:", err)
        setError("Error fetching shop data")
      } finally {
        setLoading(false)
      }
    }

    fetchShopData()
  }, [userEmail])

  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true)
      if (!shopData.id) {
        console.log("No shop provided")
        setLoading(false)
        return
      }

      try {
        const shopsQuery = query(collection(db, "Shops"), where("email", "==", userEmail))
        const shopDocs = await getDocs(shopsQuery)
        console.log("hello mama")

        if (shopDocs.empty) {
          console.log("No shop data found")
          setError("No shop data found")
          setLoading(false)
          return
        }

        const shopRef = doc(db, "Shops", shopData.id)



        const imageAiQuery = collection(shopRef, "ImageAi")

        // Fetch subcollections in parallel
        const [imageAiDocs] = await Promise.all([
          getDocs(imageAiQuery),
        ])


        const imageAiData = []

        imageAiDocs.docs.forEach((imageAi) => {
          const imageAiInfo = imageAi.data()
          // Convert timestamp fields
          if (imageAiInfo.createdAt) {
            imageAiInfo.createdAt = timestampToDate(imageAiInfo.createdAt)
          }
          imageAiData.push({
            ...imageAiInfo,
            id: imageAiDocs.id,
          })
        })

        setShopData((prev) => ({
          ...prev,
          orders: [],
          sms: [],
          tracking: [],
          imageAi: imageAiData,
        }))
        setLoading(false)
      } catch (err) {
        console.error("Error fetching shop data when chaning time:", err)
        setError("Error fetching shop data when chaning time")
      } finally {
        setLoading(false)
      }
    }

    fetchShopData()
  }, [shopData.id, dateRange])





  //creative ai
  useEffect(() => {
    const fetchCreativeAiInspirations = async () => {
      setCreativeAiLoading(true)
      setCreativeAiError(null)

      try {
          const creativeAiCollectionRef = collection(db, "CreativeAi")

  // Query the latest 20 documents ordered by createdAt
  const creativeAiQuery = query(
    creativeAiCollectionRef,
    orderBy("createdAt", "desc"),
    limit(20)
  )

  const querySnapshot = await getDocs(creativeAiQuery)
        const fetchedItems: any[] = []

        querySnapshot.forEach((doc) => {
          const data = doc.data()
          if (data.prompt && data.image && data.type && data.user) {
            fetchedItems.push({
              id: doc.id,
              image: data.image as string,
              beforeImage: data.beforeImage as string | undefined,
              user: data.user as string,
              // avatar:
              //   data.avatar ||
              //  `/placeholder.svg?height=32&width=32&text=${(data.user as string)?.[0]?.toUpperCase() || "U"}`,
              prompt: data.prompt as string,
              //likes: (data.likes as number) || Math.floor(Math.random() * 1500),
              type: data.type as "image" | "reel",
              duration: data.duration as string | undefined,
              //settings: data.settings as any,
              createdAt: data.createdAt ? timestampToDate(data.createdAt) : new Date(),
            })
          }
        })

        setCreativeAiItems(fetchedItems)
      } catch (error) {
        console.error("Error fetching CreativeAI inspirations:", error)
        setCreativeAiError("Could not load community inspirations.")
      } finally {
        setCreativeAiLoading(false)
      }
    }

    fetchCreativeAiInspirations()
  }, []) // Empty dependency array ensures this runs only once on mount

  // Set up real-time listener for SMScampaign collection
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Initializing Creative AI...")

  useEffect(() => {
    const texts = [
      "Initializing Creative AI...",
      "Loading neural networks...",
      "Preparing AI models...",
      "Setting up creative workspace...",
      "Optimizing generation algorithms...",
      "Almost ready to create magic...",
    ]
    let interval: NodeJS.Timeout

    // Simulate loading progress
    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Update loading text based on progress
        const textIndex = Math.min(Math.floor(prev / 17), texts.length - 1)
        setLoadingText(texts[textIndex])
        return prev + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  if (!loading && shopData.id) {
    return (
      <ShopContext.Provider
        value={{
          shopData,
          loading,
          error,
          setShopData,
          setShops,
          shops,
          dateRange,
          setDateRange,
          creativeAiItems,
          //  updateOrderStatus,
        }}
      >
        {children}
      </ShopContext.Provider>
    )
  }

  // Show loading UI when data is not yet available
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-700 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-700 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Name */}
        <div className="mb-12 flex items-center justify-center">
          <div className="relative mr-4">
            <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-30"></div>
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-50"></div>
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl">
              <Sparkles className="h-8 w-8 animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Creative<span className="text-purple-500">AI</span>
            </h1>
            <div className="flex items-center justify-center mt-2 space-x-1">
              <Stars className="h-4 w-4 text-yellow-500 animate-pulse" />
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Powered by Intelligence</span>
              <Stars className="h-4 w-4 text-yellow-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            Unleash Your Creative Potential
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Transform your ideas into stunning visuals with our advanced AI-powered creative tools and intelligent
            generation algorithms
          </p>
        </div>

        {/* Features */}
        <div className="mb-12 grid grid-cols-2 gap-4">
          {[
            { icon: Brain, text: "AI Image Generation", color: "from-purple-500 to-purple-600" },
            { icon: Wand2, text: "Smart Enhancement", color: "from-blue-500 to-blue-600" },
            { icon: Palette, text: "Creative Tools", color: "from-indigo-500 to-indigo-600" },
            { icon: Zap, text: "Lightning Fast", color: "from-pink-500 to-pink-600" },
          ].map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col items-center rounded-2xl border border-white/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-white dark:hover:bg-gray-800"
            >
              <div
                className={`mb-3 rounded-xl bg-gradient-to-r ${feature.color} p-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight">
                {feature.text}
              </span>
              <ArrowUpRight className="mt-2 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Enhanced Loading Bar */}
        <div className="mb-4 relative">
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse shadow-lg"></div>
        </div>

        {/* Loading Text */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">{loadingText}</span>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-purple-600 dark:text-purple-400">{progress}%</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div
                className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-60 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export const useShop = () => {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider")
  }
  return context
}
