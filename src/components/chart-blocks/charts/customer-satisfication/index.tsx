import { SmilePlus, ThumbsUp } from "lucide-react";
import { customerSatisfication
} from "@/data/customer-satisfication";
import ChartTitle from "../../components/chart-title";
import LinearProgress from "./components/linear-progress";

const customerSatisficationOptions = [
  {
    label: "Overall CSAT",
    color: "#05F283",
    percentage: customerSatisfication.csat,
    icon: <ThumbsUp className="h-6 w-6" stroke="#05F283" fill="#05F283" />,
  },
  {
    label: "Overall NPS",
    color: "#5648b7",
    percentage: customerSatisfication.nps,
    icon: <ThumbsUp className="h-6 w-6" stroke="#5648b7" fill="#5648b7" />,
  },
];

export default function CustomerSatisfication() {
  return (
    <section className="flex h-full flex-col gap-2">
      <ChartTitle title="CSAT & NPS" icon={SmilePlus} />
      <div className="my-4 flex h-full items-center justify-between">
        <div className="mx-auto grid w-full grid-cols-2 gap-6">
          {customerSatisficationOptions.map((option) => (
            <LinearProgress
              key={option.label}
              label={option.label}
              color={option.color}
              percentage={option.percentage}
              icon={option.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
