const CURRENT_DATE = new Date()
export const CURRENT_DAY = CURRENT_DATE.getDate()
export const CURRENT_MONTH = CURRENT_DATE.getMonth()
export const CURRENT_YEAR = CURRENT_DATE.getFullYear()

export const DEFAULT_YOUNGEST_AGE = 15
const UNDER_YOUNGEST_AGE = DEFAULT_YOUNGEST_AGE - 1
export const DEFAULT_SELECTED_DATE = new Date(
  new Date().setFullYear(new Date().getFullYear() - UNDER_YOUNGEST_AGE)
)

export const MINIMUM_YEAR = 1900
export const MINIMUM_DATE = new Date('1900-01-01')
export const MAXIMUM_SPINNER_DATE = new Date(DEFAULT_SELECTED_DATE.getFullYear(), 11, 31)
