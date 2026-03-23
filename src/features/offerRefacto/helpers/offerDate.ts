import { isSameDay, startOfDay } from 'date-fns'

/**
 * Returns the start date of the day if it is different from the current date.
 * Otherwise, return the current date to avoid unnecessary re-renders.
 */
export const updateSelectedDate = (currentDate: Date, newDate: Date): Date => {
  if (isSameDay(currentDate, newDate)) {
    return currentDate
  }
  return startOfDay(newDate)
}

/**
 * Initializes the selected date from a list or a default value.
 */
export const getInitialSelectedDate = (dates: Date[]): Date => {
  return dates?.[0] || startOfDay(new Date())
}
