import { useMemo } from 'react'

import { dayNumbers } from 'shared/date/days'
import { getDatesInMonth } from 'shared/date/getDatesInMonth'
import { getPastYears } from 'shared/date/getPastYears'
import { CAPITALIZED_MONTHS, CAPITALIZED_SHORT_MONTHS } from 'shared/date/months'
import { MonthType, PartialDate } from 'ui/components/inputs/DateInput/DatePicker/types'

type Args<MonthNameType extends 'short' | 'long'> = {
  date: PartialDate<MonthNameType>
  minimumYear: number
  maximumYear: number
  monthNamesType?: MonthNameType
}

export const useDatePickerOptions = <
  MonthNameType extends 'short' | 'long',
  MonthNames extends MonthType<MonthNameType>[],
>({
  date,
  minimumYear,
  maximumYear,
  monthNamesType,
}: Args<MonthNameType>): {
  optionGroups: { day: string[]; month: MonthType<MonthNameType>[]; year: string[] }
} => {
  // @ts-ignore strict typing of dates introduces new errors
  const monthNames: MonthNames =
    monthNamesType === 'short' ? CAPITALIZED_SHORT_MONTHS : CAPITALIZED_MONTHS
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
