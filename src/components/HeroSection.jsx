"use client";

import React from "react";
import { Button, Chip } from "@heroui/react";
import { Rocket } from "@gravity-ui/icons";
import Link from "next/link";
import {motion} from "motion/react";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden bg-sky-200 px-6 text-center">
      
      {/* Background Styling: Subtle Grid & Gradient Glow */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-50 blur-[120px]" />

      {/* Main Content Container */}
      <div className="relative z-10 flex max-w-5xl flex-col items-center gap-6">
        
        {/* Top Chip Badge */}
        <Chip
          variant="bordered"
          className="border-pink-500/30 bg-pink-950/20 px-3 py-1 text-pink-400 backdrop-blur-md"
          avatar={<Rocket className="text-pink-400" width={14} height={14} />}
        >
          INTRODUCING TICKETO V2.0
        </Chip>

        {/* Dynamic Heading */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Discover Premium Events & <br />
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Book Tickets
          </span>{" "}
          Seamlessly
        </h1>

        {/* Platform Description Subtitle */}
        <motion.p className="max-w-3xl text-base leading-relaxed text-gray-400 sm:text-lg md:text-xl">
          Ticketo links passionate organizers with eager attendees. Browse local festivals, 
          grand music nights, elite business seminars, and everything in between.
        </motion.p>

        {/* Call to Actions (CTA) Buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <Button
            as={Link}
            href="/events"
            size="lg"
            radius="full"
            className="bg-gradient-to-r from-pink-500 to-purple-600 font-semibold text-white shadow-lg shadow-pink-500/20 transition-transform hover:scale-105"
          >
            Explore Events
          </Button>
          
          <Button
            as={Link}
            href="/organizers/create"
            size="lg"
            radius="full"
            variant="bordered"
            className="border-gray-800 bg-gray-950/40 font-medium text-white backdrop-blur-sm transition-all hover:border-gray-700 hover:bg-gray-900/60"
          >
            Create Organization
          </Button>
        </div>

      </div>
    </section>
  );
}