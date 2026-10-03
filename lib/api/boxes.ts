import { Box, ScheduleItem, SideBox, AddonDrink, DayOfWeek } from "@/types";
import boxesData from "@/data/boxes.json";
import sidesData from "@/data/sides.json";
import addonsData from "@/data/addons.json";
import scheduleData from "@/data/schedule.json";
import { sleep } from "@/lib/utils";

export async function getBoxes(): Promise<Box[]> {
  await sleep(60);
  return boxesData as Box[];
}

export async function getBoxBySlug(slug: string): Promise<Box | null> {
  await sleep(40);
  const found = (boxesData as Box[]).find((b) => b.slug === slug);
  return found || null;
}

export async function getBoxById(id: string): Promise<Box | null> {
  await sleep(40);
  const found = (boxesData as Box[]).find((b) => b.id === id);
  return found || null;
}

export async function getSchedule(): Promise<ScheduleItem[]> {
  await sleep(40);
  return scheduleData as ScheduleItem[];
}

export async function getSides(): Promise<SideBox[]> {
  await sleep(40);
  return sidesData as SideBox[];
}

export async function getSideById(id: string): Promise<SideBox | null> {
  await sleep(30);
  const found = (sidesData as SideBox[]).find((s) => s.id === id);
  return found || null;
}

export async function getAddons(): Promise<AddonDrink[]> {
  await sleep(40);
  return addonsData as AddonDrink[];
}

export async function getAddonById(id: string): Promise<AddonDrink | null> {
  await sleep(30);
  const found = (addonsData as AddonDrink[]).find((a) => a.id === id);
  return found || null;
}

export function getTodayDayOfWeek(): DayOfWeek {
  const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  const days: DayOfWeek[] = ['Mon', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayIndex] || 'Mon';
}

export async function getTodayBox(): Promise<Box> {
  const day = getTodayDayOfWeek();
  const schedule = await getSchedule();
  const item = schedule.find((s) => s.day === day) || schedule[0];
  const box = await getBoxById(item.boxId);
  return box || (boxesData[0] as Box);
}
