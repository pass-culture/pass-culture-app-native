export const monthNames = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
]
export const monthNamesShort = [
  'Janv.',
  'Févr.',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juil.',
  'Août',
  'Sept.',
  'Oct.',
  'Nov.',
  'Déc.',
]
export const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
export const dayNamesShort = ['D', 'L', 'M', 'M', 'J', 'V', 'S']
export const today = "Aujourd'hui"

export const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
export const generateDays = (activeMonth: number, activeYear: number) => {
  let limit = 31
  if (activeMonth % 2 === 0) {
    limit = activeMonth === 2 ? (isLeapYear(activeYear) ? 29 : 28) : 30
  }
  return Array.from(new Array(limit)).map((item, index) => index + 1)
}

export const CURRENT_YEAR = new Date().getFullYear()
export const YEAR_LIST = Array.from(new Array(100)).map(
  (item, index) => CURRENT_YEAR + (index - 50)
)
