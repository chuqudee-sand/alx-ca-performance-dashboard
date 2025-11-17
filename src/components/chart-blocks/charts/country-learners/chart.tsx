"use client";

import { VChart } from "@visactor/react-vchart";
import type { IBarChartSpec } from "@visactor/vchart";
import { countryLearnersData } from "@/data/paid-enrolled-learners";

const spec: IBarChartSpec = {
  type: "bar",
  data: [
    {
      id: "countryLearners",
      values: countryLearnersData,
    },
  ],
  title: {
    text: "Paid Learners by Country",
    textStyle: {
      fontSize: 18,
      fontWeight: "bold",
      fill: "#bcbcbdff",
    },
    subtext: "Country-level breakdown for paid learners",
    subtextStyle: {
      fontSize: 14,
      fill: "#666",
    },
    padding: {
      bottom: 16, // Add some space between title and chart
    },
  },
  xField: "country",
  yField: "learners",
  legends: {
    visible: false,
  },
  bar: {
    style: {
      width: 28,
      cornerRadius: [6, 6, 0, 0],
    },
  },
  tooltip: {
    trigger: ["hover", "click"],
  },
  axes: [
    {
      orient: "bottom",
      title: { text: "Country", visible: true },
      label: { visible: true },
    },
    {
      orient: "left",
      title: { text: "Learners", visible: false },
      label: {
        visible: true,
        formatMethod: (text: string | string[]) => {
          if (Array.isArray(text)) {
            return text.map((v) => v.toLocaleString());
          }
          return text.toLocaleString();
        },
      },
      min: 0,
      nice: true,
    },
  ],
  color: ["#028ECA"],

  background: {
    visible: true,
    style: {
      fill: "#002B56", // Berkeley Blue HEX color
    },
  },
};

export default function CountryLearnersChart() {
  return <VChart spec={spec} />;
}