export interface Props {
  hideCalendar: () => void
  selectedDate: Date
  setSelectedDate: (selectedDate: Date) => void
  visible: boolean
}
