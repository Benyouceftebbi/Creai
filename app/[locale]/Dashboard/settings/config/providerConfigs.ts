import yalidineLoginImage from "../components/yalidin-screens/yalidin-login.png"
import yalidineDevelopmentImage from "../components/yalidin-screens/yalidin-devlopment.png"
import yalidineDevelopmentImage2 from "../components/yalidin-screens/yalidin-devlpment2.png"
import yalidineGereleswebhook from "../components/yalidin-screens/yalidin-gerer-les-webhooks.png"
import webhookConfig from "../components/yalidin-screens/webhookConfig.png"
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
      apiKey: { label: "API Key", type: "text", placeholder: "Enter API Key" },
      apiSecret: { label: "API Secret", type: "password", placeholder: "Enter API Secret" },
      webhookUrl: { label: "Webhook URL", type: "url", placeholder: "Enter Webhook URL" },
    },
    languageOptions: [], // DHD doesn't have language options in this example
    steps: [
      {
        title: "Create an account",
        description: "Go to the DHD website and create an account.",
        image: "/placeholder.svg?height=150&width=250",
      },
      {
        title: "Generate API credentials",
        description: "Navigate to the API section and generate your API key and secret.",
        image: "/placeholder.svg?height=150&width=250",
      },
      {
        title: "Set up webhook",
        description: "Configure the webhook URL in your DHD account settings.",
        image: "/placeholder.svg?height=150&width=250",
      },
      {
        title: "Enter Configuration Details",
        description: "Enter the required configuration details for DHD.",
      },
      {
        title: "Finalize Setup",
        description: "Review your information and finalize the setup.",
      },
    ],
  },
  // Add more providers as needed
}

