import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const DEFAULT_USER_ID = 1

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dirname(path: string): string {
  const lastSlash = path.lastIndexOf("/");
  if (lastSlash === -1) return "/";
  return path.substring(0, lastSlash);
}
