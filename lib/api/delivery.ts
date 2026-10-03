import { DeliveryZone } from "@/types";
import zonesData from "@/data/delivery-zones.json";
import { sleep } from "@/lib/utils";

export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  await sleep(80);
  return zonesData as DeliveryZone[];
}

export async function checkPincode(pincode: string): Promise<{
  deliverable: boolean;
  zone?: DeliveryZone;
  message: string;
}> {
  await sleep(150);
  const cleanPin = pincode.trim();
  const zone = (zonesData as DeliveryZone[]).find((z) => z.pincode === cleanPin);

  if (zone && zone.isDeliverable) {
    return {
      deliverable: true,
      zone,
      message: `Great news! We deliver fresh to ${zone.area} (${zone.pincode}) twice daily with free delivery.`,
    };
  }

  // Check if Coimbatore district (641xxx)
  if (cleanPin.startsWith("641")) {
    return {
      deliverable: false,
      message: `We're expanding rapidly across Coimbatore! Pincode ${cleanPin} is on our upcoming route. Drop your WhatsApp number to get notified when we launch.`,
    };
  }

  return {
    deliverable: false,
    message: `MuscleGrow currently delivers exclusively within Coimbatore (Pincodes starting with 641xxx). We hope to expand to your city soon!`,
  };
}
