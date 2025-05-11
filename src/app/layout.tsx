import { cn, ConstructMetadata } from "@/lib/utils";
import TRPCProvider from "@/providers/tRPC";
import { Outfit } from "@next/font/google";
import { ThemeProvider } from "next-themes";
import "simplebar-react/dist/simplebar.min.css";
import { Toaster } from "sonner";
import Navbar from "./components/global/navbar";
import "./globals.css";
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = ConstructMetadata();

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
