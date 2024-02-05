import range from 'lodash/range'

export const dayNumbers = range(1, 31 + 1).map((num) => String(num))
export const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
export const SHORT_DAYS = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.']
export const dayNamesShort = DAYS.map((dayName) => dayName.charAt(0))
