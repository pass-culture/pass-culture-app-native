interface DefaultDatePickerProps {
  defaultSelectedDate: Date
  onChange: (date?: Date) => void
  errorMessage?: string | null
  isDisabled?: boolean
  chidren?: never
}
export interface DatePickerProps extends DefaultDatePickerProps {
  minimumDate: Date
  maximumDate: Date
}

export interface DatePickerWebProps extends DefaultDatePickerProps {
  minimumYear: number
}
