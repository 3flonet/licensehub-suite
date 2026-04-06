import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge tailwind classes smartly
 * Prevents conflicts like 'w-5 w-6' -> 'w-6'
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
