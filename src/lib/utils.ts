import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteURL(path: string) {
  // Fix: typeof window !== "undefined" (string comparison)
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  // Fix: string interpolation and protocol
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}
