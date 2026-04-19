import { ArrowUpRight, BookmarkPlus, CalendarRange, LayoutDashboard, Search } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const cards = [
  {
    icon: LayoutDashboard,
    title: "Personalized dashboard",
    description: "A central home for role direction, priorities, saved outputs, and next steps.",
  },
  {
    icon: Search,
    title: "Field-specific role recommendations",
    description: "See realistic job families, example titles, company-type guidance, and skill gaps.",
  },
  {
    icon: BookmarkPlus,
    title: "Private resume feedback history",
    description: "Upload PDFs, review analysis history, and store everything privately in your account.",
  },
  {
    icon: CalendarRange,
    title: "Search timing planner",
    description: "Map milestones against graduation timing and your earliest possible start date.",
  },
  {
    icon: ArrowUpRight,
    title: "Recent jobs with apply links",
    description: "Discover open or recent roles with filters, match rationale, and bookmarks.",
  },
];

export function FeatureGrid() {
  return (
    <section className="space-y-8" id="how-it-works">
      <SectionHeading
        eyebrow="How it works"
        title="A career hub built to turn uncertainty into action"
        description="The platform combines profile inputs, private resume storage, structured AI generation, and live jobs data so the advice stays connected to what you can do next."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card className="p-6" key={card.title}>
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-ink">{card.title}</h3>
                  <p className="text-sm leading-7 text-muted">{card.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
