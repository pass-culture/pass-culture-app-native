import { addDays, format } from 'date-fns'

// yyyy-MM-dd days, the format MovieCalendarV2 expects
export const getCalendarDays = (now: Date, count: number): string[] =>
  Array.from({ length: count }, (_, index) => format(addDays(now, index), 'yyyy-MM-dd'))
