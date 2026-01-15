import { isSameDay, startOfDay } from 'date-fns'

/**
 * Retourne la date de début de journée si elle est différente de la date actuelle.
 * Sinon, retourne la date actuelle pour éviter des re-renders inutiles.
 */
export const updateSelectedDate = (currentDate: Date, newDate: Date): Date => {
  if (isSameDay(currentDate, newDate)) {
    return currentDate
  }
  return startOfDay(newDate)
}

/**
 * Initialise la date sélectionnée à partir d'une liste ou d'une valeur par défaut.
 */
export const getInitialSelectedDate = (dates: Date[]): Date => {
  return dates?.[0] || startOfDay(new Date())
}
