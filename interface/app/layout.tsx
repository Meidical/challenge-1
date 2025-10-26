import type { Metadata } from "next";
import { Appbar, Footer } from "@/components/navigation";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Dificult Airway Predictor",
  description: "An Expert System to predict difficult airways.",
  authors: { name: "Ricardo Sousa" },
  creator: "Ricardo Sousa",
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Appbar />
        <main>
          <h1 className="sr-only">Expert System</h1>
          {children}
        </main>
        <Footer />
        <div id="modal-root" />
      </body>
    </html>
  );
}
