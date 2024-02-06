import { useMemo } from 'react'

import { dayNumbers } from 'shared/date/days'
import { getDatesInMonth } from 'shared/date/getDatesInMonth'
import { getPastYears } from 'shared/date/getPastYears'
import { CAPITALIZED_MONTHS, CAPITALIZED_SHORT_MONTHS } from 'shared/date/months'
import { PartialDate } from 'ui/components/inputs/DateInput/DatePicker/types'

type Args = {
  date: PartialDate
  minimumYear: number
  maximumYear: number
  monthNamesType?: 'long' | 'short'
}

export const useDatePickerOptions = ({
  date,
  minimumYear,
  maximumYear,
  monthNamesType,
}: Args): { optionGroups: { day: string[]; month: string[]; year: string[] } } => {
  const monthNames = monthNamesType === 'short' ? CAPITALIZED_SHORT_MONTHS : CAPITALIZED_MONTHS
  const optionGroups = useMemo(() => {
    const year = getPastYears(minimumYear, maximumYear)

    if (date.year === undefined || date.month === undefined || date.day === undefined) {
      return {
        day: dayNumbers,
        month: monthNames,
        year,
      }
    }

    const { month: selectedMonth, year: selectedYear } = date
    const selectedMonthIndex = monthNames.indexOf(selectedMonth).toString()
    return {
      day: getDatesInMonth(selectedMonthIndex, selectedYear),
      month: monthNames,
      year,
    }
  }, [date, maximumYear, minimumYear, monthNames])

  return { optionGroups }
}
