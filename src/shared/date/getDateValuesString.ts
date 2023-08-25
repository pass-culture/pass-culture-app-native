import { monthNamesShort } from 'shared/date/months'

export function getDateValuesString(selectedDate: Date) {
  return {
    day: selectedDate.getDate().toString(),
    month: monthNamesShort[selectedDate.getMonth()],
    year: selectedDate.getFullYear().toString(),
  }
}
