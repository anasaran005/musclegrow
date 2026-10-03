import { Review } from "@/types";
import reviewsData from "@/data/reviews.json";
import { sleep } from "@/lib/utils";

export async function getReviews(): Promise<Review[]> {
  await sleep(100);
  return reviewsData as Review[];
}
