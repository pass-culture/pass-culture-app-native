import { range } from 'lodash'

export const dayNumbers = range(1, 31 + 1).map((num) => String(num))
export const DAYS = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
] as const
export const SHORT_DAYS = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'] as const
export const dayNamesShort = DAYS.map((dayName) => dayName.charAt(0))

export type FullWeekDay = (typeof DAYS)[number]
export type ShortWeekDay = (typeof SHORT_DAYS)[number]
