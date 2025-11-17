import { Gauge, type LucideIcon, MessagesSquare, Briefcase, Globe, Zap } from "lucide-react";

export type SiteConfig = typeof siteConfig;
export type Navigation = {
  icon: LucideIcon;
  name: string;
  href: string;
};

export const siteConfig = {
  title: "VisActor Next Template",
  description: "Template for VisActor and Next.js",
};

export const navigations: Navigation[] = [
  {
    icon: Gauge,
    name: "CA Overview",
    href: "/",
  },
  {
    icon: MessagesSquare,
    name: "Cohort",
    href: "/cohort",
  },
  {
    icon: Briefcase,  // Pick an icon you prefer
    name: "Programs",
    href: "/programs",
  },
  {
    icon: Globe,      // Pick an icon you prefer
    name: "Regional",
    href: "/regional",
  },
  {
    icon: Zap,        // Pick an icon you prefer
    name: "Sprint",
    href: "/sprint",
  }
];
