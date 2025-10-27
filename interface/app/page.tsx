"use client";
import React from "react";
import { SystemBody } from "@/components/ui";
import { DataContext } from "@/contexts";

export default function MainPage() {
  return (
    <div className="main-page">
      <DataContext>
        <SystemBody />
      </DataContext>
    </div>
  );
}
