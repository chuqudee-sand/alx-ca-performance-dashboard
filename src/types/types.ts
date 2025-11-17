export type TicketMetric = {
  country: string;
  type: "activated" | "graduated";
  count: number;
};

// Add these lines to src/types/types.ts
import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
