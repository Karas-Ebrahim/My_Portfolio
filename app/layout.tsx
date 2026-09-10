import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karas Ebrahim | Data Scientist / AI & ML Engineer",
  description: "Interactive developer portfolio for Karas Ebrahim — Data Science, AI/ML and Backend Engineering.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
