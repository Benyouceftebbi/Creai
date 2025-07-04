"use client"

import { ArrowDown, ArrowUp, MessageSquare, HelpCircle, Star, X, Eye, Sparkles, Bot } from "lucide-react"
import * as React from "react"
import { useRouter } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTranslations } from "next-intl"
//import Algeria from "@react-map/algeria"
import { useTheme } from "next-themes"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useShop } from "@/app/context/ShopContext"
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore"
import { db } from "@/firebase/firebase"
import { DataTable } from "./messages/message-center/sms-history/data-table"
import { columns } from "./messages/message-center/sms-history/columns"
import { Modal, ModalContent, ModalDescription, ModalHeader, ModalTitle } from "@/components/ui/modal"
import { AIFeatureCard } from "./dashboard/components/ai-hover-card"

type AlgeriaDataItem = {
  name: string
  value: number
}

type ChartData = {
  month: string
  totalSmsOfOneTapLink: number
  totalSmsSentInCampaign: number
}

const columnHelper = createColumnHelper<AlgeriaDataItem>()

const algeriaStatesMap = {
  "1": "Adrar",
  "2": "Chlef",
  "3": "Laghouat",
  "4": "Oum El Bouaghi",
  "5": "Batna",
  "6": "Béjaïa",
  "7": "Biskra",
  "8": "Béchar",
  "9": "Blida",
  "10": "Bouira",
  "11": "Tamanrasset",
  "12": "Tébessa",
  "13": "Tlemcen",
  "14": "Tiaret",
  "15": "Tizi Ouzou",
  "16": "Algiers",
  "17": "Djelfa",
  "18": "Jijel",
  "19": "Sétif",
  "20": "Saïda",
  "21": "Skikda",
  "22": "Sidi Bel Abbès",
  "23": "Annaba",
  "24": "Guelma",
  "25": "Constantine",
  "26": "Médéa",
  "27": "Mostaganem",
  "28": "M'Sila",
  "29": "Mascara",
  "30": "Ouargla",
  "31": "Oran",
  "32": "El Bayadh",
  "33": "Illizi",
  "34": "Bordj Bou Arréridj",
  "35": "Boumerdès",
  "36": "El Tarf",
  "37": "Tindouf",
  "38": "Tissemsilt",
  "39": "El Oued",
  "40": "Khenchela",
  "41": "Souk Ahras",
  "42": "Tipaza",
  "43": "Mila",
  "44": "Aïn Defla",
  "45": "Naâma",
  "46": "Aïn Témouchent",
  "47": "Ghardaïa",
  "48": "Relizane",
  "49": "El M'Ghair",
  "50": "El Meniaa",
  "51": "Ouled Djellal",
  "52": "Bordj Baji Mokhtar",
  "53": "Béni Abbès",
  "54": "Timimoun",
  "55": "Touggourt",
  "56": "Djanet",
  "57": "In Salah",
  "58": "In Guezzam",
}

const algeriaColumns = [
  columnHelper.accessor("name", {
    header: "Wilaya",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("value", {
    header: "Total SMS",
    cell: (info) => info.getValue().toLocaleString(),
  }),
]

export default function Dashboard() {
  const t = useTranslations("header")
  const router = useRouter()
  const [progress, setProgress] = React.useState(13)
  const [showHelp, setShowHelp] = React.useState(false)
  const [showInfoDiv, setShowInfoDiv] = React.useState(true)
  const { theme } = useTheme()
  const { shopData } = useShop()
  const [showModal, setShowModal] = React.useState(!shopData.lng); // Show modal if shopData.lng is not present


  const chartData = React.useMemo<ChartData[]>(() => {
    // Get the current date
    const currentDate = new Date()
    const result: ChartData[] = []

    // Generate the last 6 months (including current month)
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate)
      date.setMonth(currentDate.getMonth() - i)

      // Get the month name for display
      const monthName = date.toLocaleString("default", { month: "long" })

      // Get the correct year and month for the data lookup
      const year = date.getFullYear()
      const monthNum = String(date.getMonth() + 1).padStart(2, "0") // +1 because getMonth() is 0-indexed
      const yearMonth = `${year}-${monthNum}`

      result.push({
        month: monthName,
        totalSmsOfOneTapLink: shopData.analytics?.totalMessagesByMonth?.[yearMonth] || 0,
        totalSmsSentInCampaign: shopData.analytics?.totalSMSComapignByMonth?.[yearMonth] || 0,
      })
    }

    return result
  }, [shopData.analytics])
  const chartConfig = {
    desktop: {
      label: "SMS Messages",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Campaign Messages",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig
  const algeriaData: AlgeriaDataItem[] = React.useMemo(() => {
    if (!shopData.analytics?.totalMessagesByState) return []

    return Object.entries(shopData.analytics.totalMessagesByState)
      .map(([stateCode, count]) => ({
        name: algeriaStatesMap[stateCode] || stateCode,
        value: count || 0,
      }))
      .sort((a, b) => b.value - a.value)
  }, [shopData.analytics?.totalMessagesByState])
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])
  const table = useReactTable({
    data: algeriaData,
    columns: algeriaColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })
  const currentDate = new Date()
  const yearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`


  


  const currentWeek = `${currentDate.getFullYear()}-W${String(Math.ceil(currentDate.getDate() / 7)).padStart(2, "0")}`
  const currentMonth = React.useMemo(() => {
    return new Date().toLocaleString("default", { month: "long" })
  }, [])

  const lastMonth = React.useMemo(() => {
    return new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString("default", { month: "long" })
  }, [])

  const currentMonthSms = React.useMemo(() => {
    return shopData.analytics?.[currentMonth]?.totalSmsSent || 0
  }, [shopData.analytics, currentMonth])

  const lastMonthSms = React.useMemo(() => {
    return shopData.analytics?.[lastMonth]?.totalSmsSent || 0
  }, [shopData.analytics, lastMonth])

  const percentageChange = React.useMemo(() => {
    return lastMonthSms > 0
      ? ((shopData?.analytics?.totalMessagesByMonth?.[yearMonth] -
          shopData?.analytics?.totalMessagesByMonth?.[
            `${currentDate.getFullYear()}-${String(currentDate.getMonth()).padStart(2, "0")}`
          ]) /
          shopData?.analytics?.totalMessagesByMonth?.[
            `${currentDate.getFullYear()}-${String(currentDate.getMonth()).padStart(2, "0")}`
          ]) *
          100
      : 0;
  }, [currentMonthSms, lastMonthSms]);
  

const previousWeek = `W${String(Math.ceil(currentDate.getDate() / 7) - 1).padStart(2, "0")}`;
const currentYear = currentDate.getFullYear();



const currentWeekKey = `${currentWeek}`;
const previousWeekKey = `${currentYear}-${previousWeek}`;



// Check if the keys exist in returnRateByWeek before accessing them
const currentReturnRate = shopData?.analytics?.returnRateByWeek?.[currentWeekKey] || 0;
const previousReturnRate = shopData?.analytics?.returnRateByWeek?.[previousWeekKey] || 0;


const percentageChangereturn =
  previousReturnRate === 0
    ? currentReturnRate
    : ((currentReturnRate - previousReturnRate) / previousReturnRate) * 100;

  const updateShopAnalytics = async (shopId: string) => {
    try {
      const analyticsData = {
        // Messages by month in YYYY-MM format
        totalMessagesByMonth: {
          SMS: {
            "2024-01": 2150,
            "2024-02": 2480,
            "2024-03": 2890,
            "2024-04": 3100,
            "2024-05": 2950,
            "2024-06": 3200,
          },
          SMSComapign: {
            "2024-01": 1800,
            "2024-02": 2100,
            "2024-03": 2400,
            "2024-04": 2600,
            "2024-05": 2500,
            "2024-06": 2800,
          },
        },

        // Weekly return rates (last 12 weeks)
        returnRateByWeek: {
          "2024-W01": 35.5,
          "2024-W02": 38.2,
          "2024-W03": 42.0,
          "2024-W04": 39.5,
          "2024-W05": 41.2,
          "2024-W06": 40.8,
          "2024-W07": 43.1,
          "2024-W08": 44.5,
          "2024-W09": 42.8,
          "2024-W10": 41.9,
          "2024-W11": 43.7,
          "2024-W12": 45.2,
        },

        // Distribution by state (all 58 wilayas)
        totalMessagesByState: {
          "01": 1250, // Adrar
          "02": 2100, // Chlef
          "03": 1800, // Laghouat
          "04": 1650, // Oum El Bouaghi
          "05": 2300, // Batna
          "06": 2800, // Béjaïa
          "07": 2100, // Biskra
          "08": 1450, // Béchar
          "09": 3200, // Blida
          "10": 2400, // Bouira
          "11": 1900, // Tamanrasset
          "12": 2600, // Tébessa
          "13": 2900, // Tlemcen
          "14": 2200, // Tiaret
          "15": 2700, // Tizi Ouzou
          "16": 4500, // Algiers
          "17": 2000, // Djelfa
          "18": 2500, // Jijel
          "19": 3000, // Sétif
          "20": 1700, // Saïda
          "21": 2300, // Skikda
          "22": 1950, // Sidi Bel Abbès
          "23": 3100, // Annaba
          "24": 2050, // Guelma
          "25": 3500, // Constantine
          "26": 2400, // Médéa
          "27": 2250, // Mostaganem
          "28": 1850, // M'Sila
          "29": 1600, // Mascara
          "30": 1400, // Ouargla
          "31": 3800, // Oran
          "32": 1300, // El Bayadh
          "33": 1000, // Illizi
          "34": 2600, // Bordj Bou Arréridj
          "35": 2900, // Boumerdès
          "36": 1750, // El Tarf
          "37": 800, // Tindouf
          "38": 1900, // Tissemsilt
          "39": 1550, // El Oued
          "40": 1800, // Khenchela
          "41": 2150, // Souk Ahras
          "42": 2550, // Tipaza
          "43": 2350, // Mila
          "44": 2000, // Aïn Defla
          "45": 1650, // Naâma
          "46": 1850, // Aïn Témouchent
          "47": 1500, // Ghardaïa
          "48": 2200, // Relizane
          "49": 900, // El M'Ghair
          "50": 1100, // El Meniaa
          "51": 1200, // Ouled Djellal
          "52": 700, // Bordj Baji Mokhtar
          "53": 600, // Béni Abbès
          "54": 850, // Timimoun
          "55": 1350, // Touggourt
          "56": 500, // Djanet
          "57": 750, // In Salah
          "58": 450, // In Guezzam
        },

        // Daily metrics
        smsSentToday: 150,
        dailyTarget: 200,
        monthlyTarget: 3000,
        newThisWeek: 45,
      }

      // Update the document in Firebase
      const shopRef = doc(db, "Shops", shopId)
      await setDoc(
        shopRef,
        {
          analytics: analyticsData,
        },
        { merge: true },
      ) // Using merge: true to only update the analytics field

      console.log("Analytics data updated successfully")
      return analyticsData
    } catch (error) {
      console.error("Error updating analytics data:", error)
      throw error
    }
  }
  const fetchContactRates = async () => {
    try {
      // Query only shops that have a "deliveryCompany" field
      const shopsQuery = query(collection(db, "Shops"), where("deliveryCompany", "!=", null));
      const querySnapshot = await getDocs(shopsQuery);
  
      let totalContacts = 0;
      let rateCounts = { Ooredoo: 0, Mobilis: 0, Djezzy: 0 };
  
      // Fetch Tracking subcollections in parallel
      await Promise.all(
        querySnapshot.docs.map(async (shopDoc) => {
          const trackingDocs = await getDocs(collection(shopDoc.ref, "Tracking"));
         
          
          trackingDocs.docs.forEach((trackingDoc) => {
            const trackingData = trackingDoc.data().data;
            const phone=trackingDoc.data().data.contact_phone
            console.log("id",phone);

                if (typeof phone === "string") {
                  totalContacts++; // Count total contacts
                  if (phone.startsWith("05")) {
                    rateCounts.Ooredoo++;
                  } else if (phone.startsWith("06")) {
                    rateCounts.Mobilis++;
                  } else if (phone.startsWith("07")) {
                    rateCounts.Djezzy++;
                  }
                }
              
            
          });
        })
      );
  
      // Calculate percentages
      const ratePercentages = {
        Ooredoo: totalContacts ? ((rateCounts.Ooredoo / totalContacts) * 100).toFixed(2) + "%" : "0%",
        Mobilis: totalContacts ? ((rateCounts.Mobilis / totalContacts) * 100).toFixed(2) + "%" : "0%",
        Djezzy: totalContacts ? ((rateCounts.Djezzy / totalContacts) * 100).toFixed(2) + "%" : "0%",
      };
  
      const smsCosts = { Ooredoo: 7, Mobilis: 4, Djezzy: 4 };

    // Calculate average SMS cost
    const totalSmsCost =
      rateCounts.Ooredoo * smsCosts.Ooredoo +
      rateCounts.Mobilis * smsCosts.Mobilis +
      rateCounts.Djezzy * smsCosts.Djezzy;

    const averageSmsCost = totalContacts ? (totalSmsCost / totalContacts).toFixed(2) : "0.00";

    console.log({ totalContacts, rateCounts, ratePercentages, averageSmsCost });
    return { totalContacts, rateCounts, ratePercentages, averageSmsCost };
    } catch (err) {
      console.error("Error fetching contact rates:", err);
    }
  };
  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-8">
      <div className="container mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        {!showInfoDiv && (
          <div className="flex justify-end mb-4">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowInfoDiv(true)}>
              <Eye className="h-4 w-4" />
              Show Info Section
            </Button>
          </div>
        )}

        {showInfoDiv && (
          <div className="bg-[#faf5ff] dark:bg-slate-800/50 p-4 rounded-lg relative">
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 z-10 h-6 w-6 rounded-full bg-white/80 hover:bg-white dark:bg-slate-700/80 dark:hover:bg-slate-700"
              onClick={() => setShowInfoDiv(false)}
              aria-label="Close info section"
            >
              <X className="h-3 w-3" />
            </Button>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-1/6">
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/ynSsw6D5gFg"
                    title="Dashboard Tutorial Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
              <div className="w-full sm:w-5/6">
                <h3 className="text-lg font-semibold mb-2">{t("dashboard-overview")}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  {t("dashboard-description") ||
                    "This dashboard provides an overview of your SMS messaging analytics and performance metrics. Watch the video for a quick tutorial on how to use the dashboard features."}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{t("dashboard-overview")}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm w-full sm:w-auto"
              //onClick={fetchContactRates}
            >
              {t("export-data")}
            </Button>

            <Button variant="outline" size="icon" aria-label={t("help")} onClick={() => setShowHelp(!showHelp)}>
              <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <AIFeatureCard
              title="Creative AI"
              description="Generate amazing content with AI"
              gradient="from-purple-500 via-pink-500 to-orange-500"
              icon={Sparkles}
              onClick={() => console.log("Creative AI clicked")}
            />
            <AIFeatureCard
              title="Order AI Retrieval"
              description="Smart order processing system"
              gradient="from-blue-500 via-cyan-500 to-teal-500"
              icon={Bot}
              onClick={() => console.log("Order AI clicked")}
            />
          </div>
        <div className="grid gap-2 sm:gap-4 md:gap-6 grid-cols-2 md:grid-cols-4">
          <Card className="group transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-0.5 hover:bg-primary/5">
            <CardContent className="p-2 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground">
                    {t("tokens-left")}
                  </p>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold"> {Number(shopData.tokens).toFixed(2)}</h2>
                </div>
                <div className="p-1 sm:p-2 md:p-3 bg-primary/10 rounded-full transition-all duration-300 ease-in-out group-hover:bg-primary/20">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-primary" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 pt-2">
                <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    {t("sms-remaining", {
                      min: Math.floor(shopData.tokens / 15),
                      max: Math.floor(shopData.tokens / 10),
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="group transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-0.5 hover:bg-primary/5">
            <CardContent className="p-2 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground">
                    {t("total-messages")}
                  </p>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold flex items-center space-x-2">
  {(() => {
    const currentMonthMessages = shopData?.analytics?.totalMessagesByMonth?.[yearMonth] || 0;

    // Compute previous month string correctly
    const prevDate = new Date(currentDate);
    prevDate.setMonth(prevDate.getMonth() - 1);
    const prevYearMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

    const previousMonthMessages = shopData?.analytics?.totalMessagesByMonth?.[prevYearMonth] || 0;
    const difference = currentMonthMessages - previousMonthMessages;

    return (
      <>
        <span>{currentMonthMessages}</span>
        {difference > 0 ? (
          <span className="text-green-500">▲</span> // Increase indicator
        ) : difference < 0 ? (
          <span className="text-red-500">▼</span> // Decrease indicator
        ) : (
          <span className="text-gray-500">➖</span> // No change
        )}
      </>
    );
  })()}
</h2>


                </div>
                <div className="p-1 sm:p-2 md:p-3 bg-primary/10 rounded-full transition-all duration-300 ease-in-out group-hover:bg-primary/20">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-primary" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 pt-2">
                <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                <span
   className={`flex items-center ${
    percentageChange > 0
      ? "text-green-600"  // Increase → Green
      : percentageChange < 0
      ? "text-red-600"    // Decrease → Red
      : "text-gray-500"   // No change → Gray
  }`}
>
  {(() => {
    const currentMonthMessages = shopData?.analytics?.totalMessagesByMonth?.[yearMonth] || 0;

    // Compute previous month string correctly
    const prevDate = new Date(currentDate);
    prevDate.setMonth(prevDate.getMonth() - 1);
    const prevYearMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

    const previousMonthMessages = shopData?.analytics?.totalMessagesByMonth?.[prevYearMonth] || 0;
    
    let percentageChange = 0;

    if (previousMonthMessages > 0) {
      percentageChange = ((currentMonthMessages - previousMonthMessages) / previousMonthMessages) * 100;
    } else if (currentMonthMessages > 0) {
      percentageChange = 100; // Full increase if last month was 0
    }

    return (
      <span
      className={`flex items-center ${
        percentageChange > 0
          ? "text-green-600"  // Positive change → Green
          : percentageChange < 0
          ? "text-red-600"    // Negative change → Red
          : "text-gray-500"   // No change → Gray
      }`}
    >
      {percentageChange > 0 ? (
        <ArrowUp className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-1" />
      ) : percentageChange < 0 ? (
        <ArrowDown className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-1" />
      ) : (
        <span>➖</span> // No change indicator
      )}
      {t("percentage-change", { value: Math.abs(percentageChange).toFixed(1) })}
    </span>
    
    );
  })()}
</span>



                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-0.5 hover:bg-primary/5">
            <CardContent className="p-2 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground">
                    {t("total-sms-today")}
                  </p>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                    {shopData?.analytics?.totalSMSSentToday || 0}
                  </h2>
                </div>
                <div className="p-1 sm:p-2 md:p-3 bg-primary/10 rounded-full transition-all duration-300 ease-in-out group-hover:bg-primary/20">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-primary" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 pt-2">
                <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                {(() => {
  const currentMonth = currentDate.getMonth() + 1;
  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const previousYear =
    currentMonth === 1 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();

  const previousYearMonth = `${previousYear}-${String(previousMonth).padStart(2, "0")}`;
  const previousMonthTotal = shopData?.analytics?.totalMessagesByMonth?.previousYearMonth || 0;
  const dailyAverageLastMonth = previousMonthTotal / 30; // Assume 30 days for simplicity
  const todayMessages = shopData?.analytics?.totalSMSSentToday || 0;

  const percentageChange = ((todayMessages - dailyAverageLastMonth) / dailyAverageLastMonth) * 100;

  return (
    <span
      className={`flex items-center ${
        percentageChange > 0
          ? "text-green-600"
          : percentageChange < 0
          ? "text-red-600"
          : "text-gray-500"
      }`}
    >
      {percentageChange > 0 ? (
        <ArrowUp className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-1" />
      ) : percentageChange < 0 ? (
        <ArrowDown className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-1" />
      ) : (
        <span>➖</span>
      )}
      {t("daily-target", { value: todayMessages })}
    </span>
  );
})()}

                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-0.5 hover:bg-primary/5">
    <CardContent className="p-2 sm:p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground">
            {t("return-rate")}
          </p>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
            {currentReturnRate.toFixed(1)}%
          </h2>
        </div>
        <div className="p-1 sm:p-2 md:p-3 bg-primary/10 rounded-full transition-all duration-300 ease-in-out group-hover:bg-primary/20">
          {percentageChangereturn > 0 ? (
            <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-green-600" />
          ) : percentageChangereturn < 0 ? (
            <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-red-600" />
          ) : (
            <span className="text-gray-500">➖</span>
          )}
        </div>
      </div>
      <div className="mt-3 sm:mt-4 pt-2">
        <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
          <span
            className={`flex items-center ${
              percentageChangereturn > 0
                ? "text-green-600"
                : percentageChangereturn < 0
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {percentageChangereturn > 0 ? (
              <ArrowUp className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-1" />
            ) : percentageChangereturn < 0 ? (
              <ArrowDown className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-1" />
            ) : (
              <span>➖</span>
            )}
            {t("return-rate-change", {
              value: Math.abs(percentageChangereturn).toFixed(1),
            })}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
        </div>

        <div className="grid gap-2 sm:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-6">
                <CardTitle className="text-base sm:text-lg md:text-xl">{t("message-analytics")}</CardTitle>
              </div>
              <div className="leading-none text-muted-foreground">{t("analytics-description")}</div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="max-h-[200px] w-full mt-10">
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                  <Bar dataKey="totalSmsOfOneTapLink" fill="var(--color-desktop)" radius={4} />
                  <Bar dataKey="totalSmsSentInCampaign" fill="var(--color-mobile)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">{t("algeria-map")}</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                
                </div>
                <div className="flex-1">
                  {algeriaData.length === 0 ? (
                    <div className="text-center text-gray-500">{t("no-data")}</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id} className="dark:border-gray-700">
                            {headerGroup.headers.map((header) => (
                              <TableHead key={header.id} className="dark:text-gray-300">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </TableHead>
                            ))}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {table.getRowModel().rows.map((row) => (
                          <TableRow key={row.id} className={"dark:border-gray-700"}>
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id} className="dark:text-gray-300">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="p-2 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
              <CardTitle className="text-base sm:text-lg md:text-xl">10 {t("recent-messages")}</CardTitle>
              <Button
                variant="link"
                className="p-0 h-auto text-xs sm:text-sm"
                onClick={() => router.push("/dashboard/messages")}
              >
                {t("view-all")}
              </Button>
            </div>
            <CardDescription className="text-[10px] sm:text-xs md:text-sm">{t("track-message-status")}</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={shopData.tracking?.slice(0, 10) || []} />
          </CardContent>
        </Card>
      </div>
      <Modal open={showModal} onOpenChange={setShowModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{t("modal.account-linking-title")}</ModalTitle>
            <ModalDescription>{t("modal.account-linking-description")}</ModalDescription>
          </ModalHeader>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setShowModal(false)} variant="destructive">
              {t("modal.close")}
            </Button>
            <Button variant="secondary" className="ml-2" onClick={() => router.push({ pathname: '/dashboard/settings', query: { link:true } })}>
              {t("modal.link-account")}
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  )
}

