"use client";
import React from "react";
import { SystemBody } from "@/components/ui";
import { DataContext } from "@/contexts";
import { NotificationHandler } from "@/components/feedback";
import NotificationContextProvider from "@/contexts/NotificationContext";

export default function MainPage() {
  return (
    <div className="main-page">
      <NotificationContextProvider>
        <DataContext>
          <SystemBody />
        </DataContext>
        <NotificationHandler />
      </NotificationContextProvider>
    </div>
  );
}
