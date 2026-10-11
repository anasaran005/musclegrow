export const BRAND = {
  name: "MuscleGrow",
  legalName: "MuscleGrow Nutrition Pvt Ltd",
  tagline: "Every gram counted. Delivered fresh in Coimbatore.",
  shortDescription: "High-protein fitness meals with calories, protein, carbs and fat measured on every dish. Delivered fresh across Coimbatore 6 days a week.",
  city: "Coimbatore",
  state: "Tamil Nadu",
  country: "India",
  currency: "₹",
  fssaiNumber: "12423008000492", // Lab verification & regulatory placeholder
  whatsappNumber: "+919876543210",
  whatsappMessage: "Hi MuscleGrow! I want to know more about the meal subscription.",
  supportEmail: "hello@musclegrow.fit",
  phone: "+91 98765 43210",
  address: "142, D.B. Road, RS Puram, Coimbatore - 641002, Tamil Nadu",
  workingDays: "Monday to Saturday (6 days a week)",
  deliverySlots: {
    lunch: "12:00 PM - 1:30 PM",
    dinner: "7:00 PM - 8:30 PM",
  },
  cutoffTime: "9:00 PM previous night",
  pricing: {
    subscriptionMin: 239,
    subscriptionMax: 289,
    oneOffAvg: 319,
  },
  socials: {
    instagram: "https://instagram.com/musclegrow.fit",
    whatsapp: "https://wa.me/919876543210",
    twitter: "https://twitter.com/musclegrowfit",
    linkedin: "https://linkedin.com/company/musclegrow",
  },
} as const;

export default BRAND;
