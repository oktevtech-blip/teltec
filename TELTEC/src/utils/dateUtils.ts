import { format, parseISO, isValid, differenceInDays, addDays } from "date-fns"

export const formatDate = (date: string | Date, formatString = "MMM dd, yyyy"): string => {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    return isValid(dateObj) ? format(dateObj, formatString) : "Invalid Date"
  } catch (error) {
    return "Invalid Date"
  }
}

export const getDaysUntil = (date: string | Date): number => {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    return isValid(dateObj) ? differenceInDays(dateObj, new Date()) : 0
  } catch (error) {
    return 0
  }
}

export const isOverdue = (date: string | Date): boolean => {
  return getDaysUntil(date) < 0
}

export const getDateStatus = (date: string | Date): "overdue" | "due-soon" | "upcoming" | "future" => {
  const days = getDaysUntil(date)

  if (days < 0) return "overdue"
  if (days <= 3) return "due-soon"
  if (days <= 7) return "upcoming"
  return "future"
}

export const addBusinessDays = (date: Date, days: number): Date => {
  let result = new Date(date)
  let addedDays = 0

  while (addedDays < days) {
    result = addDays(result, 1)
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      addedDays++
    }
  }

  return result
}
