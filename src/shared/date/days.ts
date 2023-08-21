import range from 'lodash/range'

export const dayNumbers = range(1, 31 + 1).map((num) => String(num))
export const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
export const dayNamesShort = dayNames.map((dayName) => dayName.charAt(0))
