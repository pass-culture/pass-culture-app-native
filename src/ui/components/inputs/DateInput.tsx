import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { NativeSyntheticEvent, TextInput, TextInputKeyPressEventData } from 'react-native'
import styled from 'styled-components/native'

import { DatePartType, PartialDateInput } from './PartialDateInput'

export interface DateValidation {
  isComplete: boolean
  isValid: boolean
  isDateAboveMin: boolean
  isDateBelowMax: boolean
}

interface DateInputProps {
  onChangeValue?: (value: Date | null, dateValidation: DateValidation) => void
  minDate?: Date
  maxDate?: Date
}

export interface DateInputRef {
  clearFocuses: () => void
}

const MIN_POSSIBLE_YEAR = 1
const MAX_POSSIBLE_YEAR = 9999

const DAY_VALIDATOR = {
  hasRightLength: (input: string) => input.length === 2,
  isValid: (input: number) => input >= 1 && input <= 31,
}
const MONTH_VALIDATOR = {
  hasRightLength: (input: string) => input.length === 2,
  isValid: (input: number) => input >= 1 && input <= 12,
}
const YEAR_VALIDATOR = {
  hasRightLength: (input: string) => input.length === 4,
  isValid: (input: number) => input >= MIN_POSSIBLE_YEAR && input <= MAX_POSSIBLE_YEAR,
}
export const FULL_DATE_VALIDATOR = {
  isValid(date: Date, year: number, month: number, day: number) {
    return (
      date instanceof Date &&
      date.getFullYear() == year &&
      date.getMonth() == month - 1 &&
      date.getUTCDate() == day
    )
  },
}

const WithRefDateInput: React.ForwardRefRenderFunction<DateInputRef, DateInputProps> = (
  props,
  forwardedRef
) => {
  const dayInputRef = useRef<TextInput>(null)
  const monthInputRef = useRef<TextInput>(null)
  const yearInputRef = useRef<TextInput>(null)

  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')

  const dateValidation: DateValidation = {
    isComplete: false,
    isValid: false,
    isDateAboveMin: props.minDate ? false : true,
    isDateBelowMax: props.maxDate ? false : true,
  }

  const dayNb = Number(day)
  const monthNb = Number(month)
  const yearNb = Number(year)
  const date = new Date(Date.UTC(yearNb, monthNb - 1, dayNb))

  const isDayValid = DAY_VALIDATOR.isValid(dayNb) && DAY_VALIDATOR.hasRightLength(day)
  const isMonthValid = MONTH_VALIDATOR.isValid(monthNb) && MONTH_VALIDATOR.hasRightLength(month)
  const isYearValid = YEAR_VALIDATOR.isValid(yearNb) && YEAR_VALIDATOR.hasRightLength(year)
  const doesDateExists = FULL_DATE_VALIDATOR.isValid(date, yearNb, monthNb, dayNb)

  if (doesDateExists && props.minDate) {
    dateValidation.isDateAboveMin = date >= props.minDate
  }
  if (doesDateExists && props.maxDate) {
    dateValidation.isDateBelowMax = date <= props.maxDate
  }

  dateValidation.isComplete =
    DAY_VALIDATOR.hasRightLength(day) &&
    MONTH_VALIDATOR.hasRightLength(month) &&
    YEAR_VALIDATOR.hasRightLength(year)
  dateValidation.isValid =
    doesDateExists &&
    dateValidation.isComplete &&
    dateValidation.isDateAboveMin &&
    dateValidation.isDateBelowMax

  // notify parent effect
  useEffect(() => {
    props.onChangeValue?.(doesDateExists ? date : null, dateValidation)
  }, [day, month, year])

  useImperativeHandle(forwardedRef, () => ({
    clearFocuses() {
      dayInputRef?.current?.blur()
      monthInputRef?.current?.blur()
      yearInputRef?.current?.blur()
    },
  }))

  // blur and focus next input effect
  useEffect(() => {
    if (DAY_VALIDATOR.hasRightLength(day)) {
      monthInputRef?.current?.focus()
    }
  }, [day])
  useEffect(() => {
    if (MONTH_VALIDATOR.hasRightLength(month)) {
      yearInputRef?.current?.focus()
    }
  }, [month])

  /** focus previous input after deleting all the content: only for month and year */
  function handleBackSpace(
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    identifier: DatePartType
  ) {
    if (e.nativeEvent.key !== 'Backspace') {
      return
    }

    if (identifier === DatePartType.MONTH && month.length <= 1) {
      dayInputRef?.current?.focus()
    }
    if (identifier === DatePartType.YEAR && year.length <= 1) {
      monthInputRef?.current?.focus()
    }
  }

  return (
    <Container>
      <PartialDateInput
        identifier={DatePartType.DAY}
        isValid={(!dateValidation.isComplete && isDayValid) || dateValidation.isValid}
        onChangeValue={setDay}
        placeholder="JJ"
        ref={dayInputRef}
      />
      <PartialDateInput
        identifier={DatePartType.MONTH}
        isValid={(!dateValidation.isComplete && isMonthValid) || dateValidation.isValid}
        onChangeValue={setMonth}
        placeholder="MM"
        ref={monthInputRef}
        onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) =>
          handleBackSpace(e, DatePartType.MONTH)
        }
      />
      <PartialDateInput
        identifier={DatePartType.YEAR}
        isValid={(!dateValidation.isComplete && isYearValid) || dateValidation.isValid}
        onChangeValue={setYear}
        placeholder="AAAA"
        ref={yearInputRef}
        onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) =>
          handleBackSpace(e, DatePartType.YEAR)
        }
      />
    </Container>
  )
}

export const DateInput = forwardRef<DateInputRef, DateInputProps>(WithRefDateInput)

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
