import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { NativeSyntheticEvent, TextInput, TextInputKeyPressEventData } from 'react-native'
import styled from 'styled-components/native'

import { DatePartType, PartialDateInput } from './PartialDateInput'

interface DateInputProps {
  onChangeValue?: (value: string | null, isComplete: boolean) => void
}

export interface DateInputRef {
  clearFocuses: () => void
}

export const CurrentYear = new Date().getFullYear()
export const Oldest = CurrentYear - 80
export const Youngest = CurrentYear - 13

const PartialDateValidator = {
  [DatePartType.DAY]: {
    hasRightLength: (input: string) => input.length === 2,
    validate: (input: number) => input >= 1 && input <= 31,
  },
  [DatePartType.MONTH]: {
    hasRightLength: (input: string) => input.length === 2,
    validate: (input: number) => input >= 1 && input <= 12,
  },
  [DatePartType.YEAR]: {
    hasRightLength: (input: string) => input.length === 4,
    validate: (input: number) => input >= Oldest && input <= Youngest,
  },
}

export function isValidDate(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getFullYear() == year && date.getMonth() == month - 1 && date.getUTCDate() == day
    ? true
    : false
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

  // PartialDateValidator will be injected in the next PR
  const { day: dayValidator, month: monthValidator, year: yearValidator } = PartialDateValidator

  const isDayValid = dayValidator.validate(Number(day)) && dayValidator.hasRightLength(day)
  const isMonthValid =
    monthValidator.validate(Number(month)) && monthValidator.hasRightLength(month)
  const isYearValid = yearValidator.validate(Number(year)) && yearValidator.hasRightLength(year)

  const isComplete =
    dayValidator.hasRightLength(day) &&
    monthValidator.hasRightLength(month) &&
    yearValidator.hasRightLength(year)

  const isValid = isValidDate(Number(year), Number(month), Number(day))

  useImperativeHandle(forwardedRef, () => ({
    clearFocuses() {
      dayInputRef?.current?.blur()
      monthInputRef?.current?.blur()
      yearInputRef?.current?.blur()
    },
  }))

  // notify parent effect
  useEffect(() => {
    if (isValid && isMonthValid && isDayValid && isYearValid) {
      props.onChangeValue?.(`${year}-${month}-${day}`, isComplete)
    } else {
      const date = `${year}${month}${day}`
      date.length > 0 && props.onChangeValue?.(null, isComplete)
    }
  }, [day, month, year])

  // blur and focus next input effect
  useEffect(() => {
    if (dayValidator.hasRightLength(day)) {
      monthInputRef?.current?.focus()
    }
  }, [day])
  useEffect(() => {
    if (monthValidator.hasRightLength(month)) {
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
        isValid={isDayValid}
        onChangeValue={setDay}
        placeholder="JJ"
        ref={dayInputRef}
      />
      <PartialDateInput
        identifier={DatePartType.MONTH}
        isValid={(!isComplete && isMonthValid) || (isComplete && isValid)}
        onChangeValue={setMonth}
        placeholder="MM"
        ref={monthInputRef}
        onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) =>
          handleBackSpace(e, DatePartType.MONTH)
        }
      />
      <PartialDateInput
        identifier={DatePartType.YEAR}
        isValid={isYearValid}
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
