export type DatePickerProps = {
  date: Date
  onChange: (date?: Date) => void
  minimumDate: Date
  maximumDate: Date
  errorMessage?: string | null
  accessibilityDescribedBy?: string
  isDisabled?: boolean
}

export type PartialDate = {
  year?: string
  month?: string
  day?: string
}
