import { atom } from "jotai";
import { activatedGraduated } from "@/data/activated-graduated-by-country";
import type { TicketMetric } from "@/types/types";

export const ticketChartDataAtom = atom<TicketMetric[]>((_get) => {
  // Map country-based data to match TicketMetric structure
  return activatedGraduated.flatMap((item) => [
    {
      country: item.Country,
      type: "activated",
      count: item.activated,
    },
    {
      country: item.Country,
      type: "graduated",
      count: item.graduated,
    },
  ]);
});
