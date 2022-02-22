export type DatePickerProps = {
  defaultSelectedDate: Date
  minimumDate: Date
  maximumDate?: Date
  onChange: (date?: Date) => void
  errorMessage?: string | null
  isDisabled?: boolean
  chidren?: never
}
