export type DatePickerProps = {
  date?: Date
  onChange: (date?: Date) => void
  defaultSelectedDate: Date
  previousBirthdateProvided?: string
  minimumDate: Date
  maximumDate?: Date
  errorMessage?: string | null
  accessibilityDescribedBy?: string
  isDisabled?: boolean
}
