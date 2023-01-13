import { dateDiffInFullYears } from 'libs/dates'

export const CURRENT_DATE = new Date('2020-12-01T00:00:00.000Z')
export const ELIGIBLE_AGE_DATE = new Date('2003-12-01T00:00:00.000Z')
export const DEFAULT_SELECTED_DATE = new Date('2006-12-01T00:00:00.000Z')
export const MINIMUM_DATE = new Date('1900-01-01T00:00:00.000Z')
export const MAXIMUM_DATE = new Date('2003-12-01T00:00:00.000Z')
export const FUTUR_DATE = new Date('2022-12-01T00:00:00.000Z')
export const FIFTEEN_YEARS_OLD_FIRST_DAY_DATE = new Date('2005-12-01T00:00:00.000Z')
export const EIGHTEEN_AGE_DATE = new Date('2002-12-01T00:00:00.000Z')
export const NOT_ELIGIBLE_YOUNGEST_AGE_DATE = new Date('2006-01-01T00:00:00.000Z')
export const AGE = dateDiffInFullYears(new Date(NOT_ELIGIBLE_YOUNGEST_AGE_DATE), CURRENT_DATE)
