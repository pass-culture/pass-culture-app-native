export interface CalendarPickerProps {
  hideCalendar: () => void
  selectedDate: Date
  setSelectedDate: (selectedDate: Date) => void
  visible: boolean
}
