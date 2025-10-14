import { CapitalizedMonth, CapitalizedShortMonth } from 'shared/date/months'

export type DatePickerProps = {
  date: Date
  onChange: (date?: Date) => void
  minimumDate: Date
  maximumDate: Date
  errorMessage?: string
  isDisabled?: boolean
}

export type MonthType<MonthNameType extends 'short' | 'long' = 'short'> =
  MonthNameType extends 'long' ? CapitalizedMonth : CapitalizedShortMonth

export type PartialDate<MonthNameType extends 'short' | 'long' = 'short'> = {
  year?: string
  month?: MonthType<MonthNameType>
  day?: string
}
