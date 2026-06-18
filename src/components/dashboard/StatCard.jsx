"use client";
import React from "react";
import { Card } from "@heroui/react";

export default function StatCard({ title, value, icon: Icon }) {
  return (
    <Card className="w-full bg-[#18181b] border border-zinc-800 text-zinc-100 p-6 flex flex-col gap-4">
      {/* Icon Container wrapper */}
      {Icon && (
        <div className="w-10 h-10 flex items-center justify-center bg-zinc-800/60 rounded-lg text-zinc-400 border border-zinc-700/40">
          <Icon aria-label={`${title} icon`} className="size-5" role="img" />
        </div>
      )}

      {/* Hero UI Header for the text layouts */}
      <Card.Header className="p-0 flex flex-col items-start gap-1">
        <Card.Description className="text-xs font-medium text-zinc-400 tracking-wide uppercase">
          {title}
        </Card.Description>
        <Card.Title className="text-2xl font-bold text-zinc-100 tracking-tight">
          {value}
        </Card.Title>
      </Card.Header>
    </Card>
  );
}