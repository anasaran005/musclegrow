import { Order, OrderStatus } from "@/types";
import { sleep } from "@/lib/utils";

// Mock orders storage using the new 6-box fixed rotation model
const mockOrders: Order[] = [
  {
    id: "ord-101",
    displayId: "GW-4821",
    date: "Today",
    dayOfWeek: "Mon",
    slot: "lunch",
    status: "Out for delivery",
    statusStep: 3,
    items: [
      {
        id: "item-box-1",
        itemType: "box",
        name: "Power Chicken Box (Kongu Pepper Chicken)",
        day: "Mon",
        slot: "lunch",
        quantity: 1,
        isVeg: false,
        calories: 695,
        protein: 60,
        price: 299,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "item-drink-1",
        itemType: "drink",
        name: "Beetroot Elixir (250 ml)",
        day: "Mon",
        slot: "lunch",
        quantity: 1,
        isVeg: true,
        calories: 85,
        protein: 2,
        price: 59,
        image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=400&q=80",
      }
    ],
    deliveryAddress: {
      id: "addr-1",
      name: "Mohammed Anas",
      phone: "+91 98421 23456",
      tag: "Home",
      flatNumber: "Flat 4B, Green Acres",
      street: "East Sambandam Road",
      landmark: "Near Avila Convent",
      area: "RS Puram",
      pincode: "641002",
      city: "Coimbatore",
      isDefault: true,
    },
    deliveryAgent: {
      name: "Murugan S.",
      phone: "+91 94432 87654",
    },
    estimatedDeliveryTime: "12:45 PM",
    totalCalories: 780,
    totalProtein: 62,
    totalAmount: 358,
  },
  {
    id: "ord-100",
    displayId: "GW-4790",
    date: "Yesterday",
    dayOfWeek: "Sat",
    slot: "lunch",
    status: "Delivered",
    statusStep: 4,
    items: [
      {
        id: "item-box-2",
        itemType: "box",
        name: "Paneer Tikka Box (Foxtail Millet Rice)",
        day: "Sat",
        slot: "lunch",
        quantity: 1,
        isVeg: true,
        calories: 725,
        protein: 43,
        price: 269,
        image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "item-side-1",
        itemType: "side",
        name: "Grilled Paneer with Salad",
        day: "Sat",
        slot: "lunch",
        quantity: 1,
        isVeg: true,
        calories: 300,
        protein: 22,
        price: 179,
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80",
      }
    ],
    deliveryAddress: {
      id: "addr-1",
      name: "Mohammed Anas",
      phone: "+91 98421 23456",
      tag: "Home",
      flatNumber: "Flat 4B, Green Acres",
      street: "East Sambandam Road",
      landmark: "Near Avila Convent",
      area: "RS Puram",
      pincode: "641002",
      city: "Coimbatore",
      isDefault: true,
    },
    estimatedDeliveryTime: "12:30 PM",
    actualDeliveryTime: "12:28 PM",
    totalCalories: 1025,
    totalProtein: 65,
    totalAmount: 448,
  },
];

export async function getOrders(): Promise<Order[]> {
  await sleep(100);
  return mockOrders;
}

export async function getOrderById(id?: string): Promise<Order | null> {
  await sleep(60);
  if (!id) return mockOrders[0] || null;
  const ord = mockOrders.find(
    (o) => o.id === id || (o.displayId && o.displayId.toLowerCase() === id.toLowerCase())
  );
  return ord || mockOrders[0] || null;
}
