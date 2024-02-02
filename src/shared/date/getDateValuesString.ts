import { CAPITALIZED_SHORT_MONTHS } from 'shared/date/months'

export function getDateValuesString(selectedDate: Date) {
  return {
    day: selectedDate.getDate().toString(),
    month: CAPITALIZED_SHORT_MONTHS[selectedDate.getMonth()],
    year: selectedDate.getFullYear().toString(),
  }
}
