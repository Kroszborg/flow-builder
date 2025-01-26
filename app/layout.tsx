import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Flow Builder - Create and Visualize Workflows",
  description:
    "Create, visualize, and manage workflows with ease. Perfect for project planning, user journeys, and process mapping.",
  keywords: [
    "workflow",
    "flow builder",
    "project planning",
    "user journey",
    "process mapping",
  ],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Flow Builder - Create and Visualize Workflows",
    description:
      "Create, visualize, and manage workflows with ease. Perfect for project planning, user journeys, and process mapping.",
    url: "https://your-flow-builder-url.com",
    siteName: "Flow Builder",
    images: [
      {
        url: "https://your-flow-builder-url.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flow Builder - Create and Visualize Workflows",
    description:
      "Create, visualize, and manage workflows with ease. Perfect for project planning, user journeys, and process mapping.",
    images: ["https://your-flow-builder-url.com/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
