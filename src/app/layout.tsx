import type { Metadata } from "next";
import { Outfit } from "@next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "./components/global/navbar";
import { ThemeProvider } from "next-themes";
import TRPCProvider from "@/providers/tRPC";
import { Toaster } from "sonner";
import "simplebar-react/dist/simplebar.min.css";
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Quill - Chat with your documents",
  description: "Upload and chat with your PDF documents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <TRPCProvider>
        <body
          className={cn(
            "min-h-screen font-sans antialiased grainy",
            outfit.className
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <Toaster richColors position="bottom-right" />
          </ThemeProvider>
        </body>
      </TRPCProvider>
    </html>
  );
}
