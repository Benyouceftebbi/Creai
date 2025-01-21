import { db } from "@/firebase/firebase"
import { doc, setDoc } from "firebase/firestore"

export async function updateShippingInfo(
  profileID: string,
  shippingInfo: {
    provider: string
    [key: string]: string
  },
) {
  try {
    const docRef = doc(db, "Shops", profileID)
    await setDoc(
      docRef,
      {
        shippingProvider: shippingInfo.provider,
        apiId:shippingInfo.apiId,
        apiKey:shippingInfo.apiKey,
        apiToken:shippingInfo.apiToken,
        lng:shippingInfo.lng
      },
      { merge: true },
    )
    return { success: true, message: "Shipping information updated successfully" }
  } catch (error) {
    console.error("Error updating shipping information:", error)
    throw error
  }
}

