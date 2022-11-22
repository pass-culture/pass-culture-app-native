import { FunctionComponent } from 'react'

export interface Props {
  hideCalendar: () => void
  selectedDate: Date
  setSelectedDate: (selectedDate: Date) => void
  visible: boolean
}

export const CalendarPicker: FunctionComponent<Props>
