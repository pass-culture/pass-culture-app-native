import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { NativeSyntheticEvent, TextInput, TextInputKeyPressEventData } from 'react-native'
import styled from 'styled-components/native'

import { dateDiffInFullYears } from 'libs/dates'

import { DatePartType, PartialDateInput } from './PartialDateInput'

export interface DateValidation {
  isComplete: boolean
  isValid: boolean
  isTooOld: boolean
  isTooYoung: boolean
}

interface DateInputProps {
  onChangeValue?: (value: string | null, dateValidation: DateValidation) => void
}

export interface DateInputRef {
  clearFocuses: () => void
}

const MINIMUM_AGE = 16
const MAXIMUM_AGE = 120

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
  isValid: (input: number) => input >= 1 && input <= 9999,
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
    isTooOld: false,
    isTooYoung: false,
  }

  const isDayValid = DAY_VALIDATOR.isValid(Number(day)) && DAY_VALIDATOR.hasRightLength(day)
  const isMonthValid =
    MONTH_VALIDATOR.isValid(Number(month)) && MONTH_VALIDATOR.hasRightLength(month)
  const isYearValid = YEAR_VALIDATOR.isValid(Number(year)) && YEAR_VALIDATOR.hasRightLength(year)

  const now = new Date()
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
  const isDateValid = FULL_DATE_VALIDATOR.isValid(date, Number(year), Number(month), Number(day))
  const diffInYears = isDateValid ? dateDiffInFullYears(date, now) : null

  dateValidation.isValid = isDateValid && isMonthValid && isDayValid && isYearValid
  dateValidation.isComplete =
    DAY_VALIDATOR.hasRightLength(day) &&
    MONTH_VALIDATOR.hasRightLength(month) &&
    YEAR_VALIDATOR.hasRightLength(year)
  dateValidation.isTooYoung = diffInYears ? diffInYears < MINIMUM_AGE : false
  dateValidation.isTooOld = diffInYears ? diffInYears > MAXIMUM_AGE : false

  const isReadyToBeSubmitted =
    dateValidation.isComplete &&
    dateValidation.isValid &&
    !dateValidation.isTooYoung &&
    !dateValidation.isTooOld

  // notify parent effect
  useEffect(() => {
    const stringDate = dateValidation.isValid ? `${year}-${month}-${day}` : null
    props.onChangeValue?.(stringDate, dateValidation)
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
        isValid={(!dateValidation.isComplete && isDayValid) || isReadyToBeSubmitted}
        onChangeValue={setDay}
        placeholder="JJ"
        ref={dayInputRef}
      />
      <PartialDateInput
        identifier={DatePartType.MONTH}
        isValid={(!dateValidation.isComplete && isMonthValid) || isReadyToBeSubmitted}
        onChangeValue={setMonth}
        placeholder="MM"
        ref={monthInputRef}
        onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) =>
          handleBackSpace(e, DatePartType.MONTH)
        }
      />
      <PartialDateInput
        identifier={DatePartType.YEAR}
        isValid={(!dateValidation.isComplete && isYearValid) || isReadyToBeSubmitted}
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
