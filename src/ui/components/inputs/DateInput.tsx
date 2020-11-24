import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { DatePartType, PartialDateInput } from './PartialDateInput'

interface DateInputProps {
  onChangeValue?: (value: string | null) => void
}

export const CurrentYear = new Date().getFullYear()
export const Oldest = CurrentYear - 80
export const Youngest = CurrentYear - 13

const PartialDateValidator = {
  [DatePartType.DAY]: {
    validate: (input: number) => input >= 1 && input <= 31,
  },
  [DatePartType.MONTH]: {
    validate: (input: number) => input >= 1 && input <= 12,
  },
  [DatePartType.YEAR]: {
    validate: (input: number) => input >= Oldest && input <= Youngest,
  },
}

export function isValidDate(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getFullYear() == year && date.getMonth() == month - 1 && date.getUTCDate() == day
    ? true
    : false
}

export const DateInput: FunctionComponent<DateInputProps> = (props) => {
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')

  // PartialDateValidator will be injected in the next PR
  const isDayValid = PartialDateValidator.day.validate(Number(day))
  const isMonthValid = PartialDateValidator.month.validate(Number(month))
  const isYearValid = PartialDateValidator.year.validate(Number(year))
  const isValid = isValidDate(Number(year), Number(month), Number(day))

  useEffect(() => {
    if (isValid && isMonthValid && isDayValid && isYearValid) {
      props.onChangeValue?.(`${year}-${month}-${day}`)
    } else {
      props.onChangeValue?.(null)
    }
  }, [day, month, year])

  return (
    <Container>
      <PartialDateInput
        identifier={DatePartType.DAY}
        isValid={isDayValid}
        maxLength={2}
        onChangeValue={setDay}
        placeholder="JJ"
      />
      <PartialDateInput
        identifier={DatePartType.MONTH}
        isValid={isMonthValid && isValid}
        maxLength={2}
        onChangeValue={setMonth}
        placeholder="MM"
      />
      <PartialDateInput
        identifier={DatePartType.YEAR}
        isValid={isYearValid}
        maxLength={4}
        onChangeValue={setYear}
        placeholder="YYYY"
      />
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
