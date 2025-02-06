import yalidineLoginImage from "../components/yalidin-screens/yalidin-login.png"
import yalidineDevelopmentImage from "../components/yalidin-screens/yalidin-devlopment.png"
import yalidineDevelopmentImage2 from "../components/yalidin-screens/yalidin-devlpment2.png"
import yalidineGereleswebhook from "../components/yalidin-screens/yalidin-gerer-les-webhooks.png"
import webhookConfig from "../components/yalidin-screens/webhookConfig.png"
import { defaultHead } from "@/node_modules/next/head"


import stepOne from "../components/dhd-screens/Step-1-dhd.png"
import stepTwo from "../components/dhd-screens/Step-2-dhd.png"
import stepThree from "../components/dhd-screens/3rd-step-dhd.jpg"
import submitDhd from "../components/dhd-screens/submition-step-dhd.png"
import pending from "../components/dhd-screens/pending-step-dhd.png"
import activated from "../components/dhd-screens/activated-step-dhd.png"
import viewToken from "../components/dhd-screens/view-token-dhd.png"

export interface ProviderConfig {
  name: string
  fields: {
    [key: string]: {
      label: string
      type: string
      placeholder: string
    }
  }
  steps: {
    title: string
    description: string
    image?: string
  }[]
  languageOptions: { value: string; label: string }[]
}

export const providerConfigs: { [key: string]: ProviderConfig } = {
  "Yalidin Express": {
    name: "Yalidin Express",
    fields: {
      apiId: { label: "API ID", type: "text", placeholder: "Enter API ID" },
      apiKey: { label: "API Key", type: "text", placeholder: "Enter API Key" },
      apiToken: { label: "API Token", type: "text", placeholder: "Enter API Token" },
    },
    languageOptions: [
      { value: "fr", label: "Français" },
      { value: "ar", label: "العربية" },
    ],
    steps: [
      {
        title: "Login to Yalidine Express",
        description:
          "Visit https://yalidine.app and log in to your account. If you don't have an account yet, you'll need to register first.",
        image: yalidineLoginImage,
      },
      {
        title: "Navigate to Development",
        description: "Open the hamburger menu, then click on 'Development' to access developer options.",
        image: yalidineDevelopmentImage,
      },
      {
        title: "Access Webhook Settings",
        description: "Click on 'Gérer les webhooks' to navigate to the webhook creation screen.",
        image: yalidineDevelopmentImage2,
      },
      {
        title: "Create New Webhook",
        description:
          "Follow the on-screen instructions to create a new webhook. Fill in the required information in the input fields.",
        image: webhookConfig,
      },
      {
        title: "Copy Webhook Information",
        description:
          "Copy the name, email and link provided below and use them to set up your webhook in the Yalidine Express interface, Set the 'Type d'évènement' to the option parcel_status_updated ",
          image: webhookConfig,
      },
      {
        title: "Enter Configuration Details",
        description: "Enter the required configuration details for Yalidine Express (You can get those info from ).",
        image: webhookConfig,
      },
      {
        title: "Finalize Setup",
        description: "Review your information and finalize the setup.",
      },
    ],
  },
  DHD: {
    name: "DHD",
    fields: {
     
    },
    languageOptions: [  { value: "fr", label: "Français" },
    { value: "ar", label: "العربية" },],
    steps: [
      {
        title: "Start DHD Integration",
        description: "Begin the DHD integration process by accessing the integration page. visit the follwing link https://dhd.ecotrack.dz/market",
        image: stepOne,
      },
      {
        title: "Enter Integration Details",
        description: "Fill in the required integration details, including your company information.",
        image: stepTwo,
      },
      {
        title: "Provide Additional Information",
        description: "Enter any additional information required for the DHD integration.",
        image: stepThree,
      },
      {
        title: "Submit Integration Request",
        description: "Review your information and submit the DHD integration request.",
        image: submitDhd,
      },
      {
        title: "Await Approval",
        description: "Your integration request is pending. Wait for DHD to review and approve it.",
        image: pending,
      },
      {
        title: "Integration Activated",
        description: "Congratulations! Your DHD integration has been activated.",
        image: activated,
      },
      {
        title: "View API Token",
        description: "Access your API token, which you'll need to configure the integration in your system.",
        image: viewToken,
      },
    ],
  },
  "Go Livri": {
    name: "Go Livri",
    fields: {
      apiKey: { label: "API Key", type: "text", placeholder: "Enter Go Livri API Key" },
      accountId: { label: "Account ID", type: "text", placeholder: "Enter Go Livri Account ID" },
    },
    languageOptions: [
      { value: "fr", label: "Français" },
      { value: "ar", label: "العربية" },
    ],
    steps: [
      {
        title: "Create Go Livri Account",
        description: "Sign up for a Go Livri account if you don't have one already.",
        image: stepOne,
      },
      {
        title: "Access API Settings",
        description: "Navigate to the API settings in your Go Livri dashboard.",
        image: stepTwo,
      },
      {
        title: "Generate API Key",
        description: "Generate a new API key for integration purposes.",
        image: stepThree,
      },
      {
        title: "Copy Account Information",
        description: "Copy your Account ID and newly generated API Key.",
        image: submitDhd,
      },
      {
        title: "Configure Webhook",
        description: "Set up a webhook in Go Livri to receive real-time updates.",
        image: pending,
      },
      {
        title: "Enter Configuration Details",
        description: "Enter the API Key and Account ID in the configuration fields.",
        image: activated,
      },
      {
        title: "Test Integration",
        description: "Perform a test to ensure the integration is working correctly.",
        image: viewToken,
      },
    ],
  },
  UPS: {
    name: "UPS",
    fields: {
      accessKey: { label: "Access Key", type: "text", placeholder: "Enter UPS Access Key" },
      userId: { label: "User ID", type: "text", placeholder: "Enter UPS User ID" },
      password: { label: "Password", type: "password", placeholder: "Enter UPS Password" },
    },
    languageOptions: [
      { value: "en", label: "English" },
      { value: "fr", label: "Français" },
      { value: "ar", label: "العربية" },
    ],
    steps: [
      {
        title: "Create UPS Developer Account",
        description: "Sign up for a UPS developer account at https://www.ups.com/upsdeveloperkit",
        image: stepOne,
      },
      {
        title: "Request API Access",
        description: "Request access to the UPS APIs you need for integration.",
        image: stepTwo,
      },
      {
        title: "Generate Access Key",
        description: "Generate an Access Key in your UPS developer account.",
        image: stepThree,
      },
      {
        title: "Obtain Credentials",
        description: "Obtain your User ID and Password for API authentication.",
        image: submitDhd,
      },
      {
        title: "Configure Webhook (if applicable)",
        description: "Set up webhooks for real-time notifications, if supported by UPS.",
        image: pending,
      },
      {
        title: "Enter Configuration Details",
        description: "Enter the Access Key, User ID, and Password in the configuration fields.",
        image: activated,
      },
      {
        title: "Test Integration",
        description: "Perform a test to ensure the UPS integration is working correctly.",
        image: viewToken,
      },
    ],
  },
  // Add more providers as needed
}