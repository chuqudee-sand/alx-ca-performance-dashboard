"use client";

import { VChart } from "@visactor/react-vchart";
import type { IBarChartSpec } from "@visactor/vchart";
import { graduationBySprint } from "@/data/graduation-by-sprints";

const spec: IBarChartSpec = {
  type: "bar",
  data: [
    {
      id: "graduationBySprint",
      values: graduationBySprint,
    },
  ],
  xField: ["Program", "Sprint"],
  yField: "Rate",
  seriesField: "Sprint",
  bar: {
    style: {
      // Increased bar width
      width: 57,
      cornerRadius: [6, 6, 0, 0],
    },
  },
  // Add padding adjustments for better spacing
  padding: {
    top: 20,
    bottom: 50,
    left: 60,
    right: 20
  },
  legends: {
    visible: true,
    orient: "top",
    position: "start",
  },
  tooltip: {
    trigger: ["hover", "click"],
  },
  axes: [
    {
      orient: "bottom",
      type: "band",
      title: { text: "Program", visible: true },
      label: { 
        visible: true,
        formatMethod: (text: string | string[]) => {
          if (Array.isArray(text)) {
            return text[0];
          }
          return text;
        }
      },
      // Adjust band padding to reduce distance between groups
      bandPadding: 0.2,
      // Adjust inner padding for bars within the same group
      domainLine: {
        visible: true
      }
    },
    {
      orient: "left",
      title: { text: "Graduation Rate (%)", visible: false },
      label: {
        visible: true,
        formatMethod: (text: string | string[]) => {
          if (Array.isArray(text)) {
            return text.map(val => `${val}%`);
          }
          return `${text}%`;
        },
      },
      min: 0,
      max: 80,
      nice: true,
    },
  ],
  color: [
    "#028ECA",
    "#5648b7", 
    "#41C9B9",
    "#FF5347",
    "#FBD437"
  ],
};

export default function Chart() {
  return <VChart spec={spec} />;
}