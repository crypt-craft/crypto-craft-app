import React from "react";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col px-4 md:px-8 lg:px-16">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
