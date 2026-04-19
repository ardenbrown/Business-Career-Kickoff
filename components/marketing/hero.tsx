"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, FileStack, MessagesSquare, Radar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Radar,
    title: "AI role mapping",
    description: "Translate your business profile into realistic role directions and search keywords.",
  },
  {
    icon: FileStack,
    title: "Resume intelligence",
    description: "Upload a PDF resume for private analysis, ATS feedback, and bullet rewrite ideas.",
  },
  {
    icon: MessagesSquare,
    title: "Outreach toolkit",
    description: "Generate networking and follow-up templates tuned to your stage and experience.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Live jobs feed",
    description: "Browse recent roles through a compliant jobs provider with filters and saved jobs.",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white/70 bg-hero-mesh px-6 py-16 shadow-panel sm:px-10 lg:px-14 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-8">
          <Badge>For business seniors and recent grads</Badge>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Build a focused job search with AI guidance that actually fits your profile.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
              Business Career Kickoff turns your major, interests, graduation timing, experience,
              locations, and resume into personalized direction across roles, applications,
              outreach, resume edits, and real job discovery.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="w-full sm:w-auto" size="lg">
              <Link href="/auth/sign-in">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto" size="lg" variant="secondary">
              <Link href="#how-it-works">
                See how it works
              </Link>
            </Button>
          </div>
        </div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          className="grid gap-4"
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                className="border-white/80 p-5"
                key={feature.title}
                style={{ marginLeft: index % 2 === 0 ? 0 : 24 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-ink">{feature.title}</p>
                    <p className="text-sm leading-7 text-muted">{feature.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
