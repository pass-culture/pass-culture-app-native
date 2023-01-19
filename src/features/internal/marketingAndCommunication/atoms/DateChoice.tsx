import React from 'react'

import { DateInput } from 'ui/components/inputs/DateInput/DateInput'

interface Props {
  onChange: (date: Date | undefined) => void
}

export function DateChoice(props: Props) {
  const now = new Date()
  return <DateInput defaultSelectedDate={now} minimumDate={now} onChange={props.onChange} />
}
