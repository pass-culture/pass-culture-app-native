import { t } from '@lingui/macro'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Platform, TextInput } from 'react-native'
import { MaskedTextInput } from 'react-native-mask-text'
import styled from 'styled-components/native'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import validateDate from 'validate-date'

import { accessibilityAndTestId } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

interface ValidationBarProps {
  testID?: string
  backgroundColor?: ColorsEnum
  isEmpty: boolean
  isValid?: boolean
  isFocused: boolean
  onFocus: () => void
}

export interface DateValidation {
  isComplete: boolean
  isValid: boolean
  isDateAboveMin: boolean
  isDateBelowMax: boolean
}

interface DateInputProps {
  autoFocus?: boolean
  onChangeValue?: (value: Date | null, dateValidation: DateValidation) => void
  minDate?: Date
  maxDate?: Date
  initialDay?: string
  initialMonth?: string
  initialYear?: string
  onSubmit?: () => void
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
      date.getDate() == day
    )
  },
}

const WithRefDateInput: React.ForwardRefRenderFunction<DateInputRef, DateInputProps> = (
  { onSubmit, minDate, maxDate, ...props },
  forwardedRef
) => {
  const inputRef = useRef<TextInput>(null)
  const initialValue = [props.initialDay ?? '', props.initialMonth ?? '', props.initialYear ?? '']
    .join('')
    .trim()
  const [value, setValue] = useState(initialValue)
  const [hasFocus, setHasFocus] = useState(false)

  const date = useMemo(() => {
    if (!value?.length) return null
    const parts = value.split('/')
    const dateStr = [parts[2], parts[1], parts[0]].join('-')
    if (validateDate(dateStr, 'boolean')) return new Date(dateStr)
    return null
  }, [value])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (Platform.OS !== 'web') {
        if (inputRef.current) inputRef.current.focus()
      }
    }, 500)
    return () => clearTimeout(timeout)
  }, [])

  const isValidDate = date instanceof Date && !isNaN(date.getTime())
  const dateValidation: DateValidation = useMemo(() => {
    const nextDateValidation = {
      isComplete: false,
      isValid: false,
      isDateAboveMin: minDate ? false : true,
      isDateBelowMax: maxDate ? false : true,
    }

    if (isValidDate && date && minDate) {
      nextDateValidation.isDateAboveMin = date >= minDate
    }
    if (isValidDate && date && maxDate) {
      nextDateValidation.isDateBelowMax = date <= maxDate
    }

    const [day, month, year] = value.split('/')
    nextDateValidation.isComplete =
      DAY_VALIDATOR.hasRightLength(day ?? '') &&
      MONTH_VALIDATOR.hasRightLength(month ?? '') &&
      YEAR_VALIDATOR.hasRightLength(year ?? '')

    nextDateValidation.isValid =
      isValidDate &&
      nextDateValidation.isComplete &&
      nextDateValidation.isDateAboveMin &&
      nextDateValidation.isDateBelowMax

    return nextDateValidation
  }, [isValidDate, date, value])
  useEffect(() => {
    props.onChangeValue?.(isValidDate && date ? date : null, dateValidation)
  }, [dateValidation, isValidDate, date])

  useImperativeHandle(forwardedRef, () => ({
    clearFocuses() {
      inputRef.current?.blur?.()
    },
  }))

  return (
    <Container>
      <ValidationBarContainer>
        <MaskedTextInputElement
          mask={'99/99/9999'}
          keyboardType={'number-pad'}
          onSubmitEditing={onSubmit}
          returnKeyType={'done'}
          onChangeText={setValue}
          placeholder={'JJ/MM/AAAA'}
          autoFocus={true}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          type={'custom'}
          {...accessibilityAndTestId(t`Entrée pour la date de naissance`)}
        />
        <ValidationBar
          testID={'date-bar'}
          isFocused={hasFocus}
          isEmpty={!value?.length}
          isValid={dateValidation.isComplete}
        />
      </ValidationBarContainer>
    </Container>
  )
}

export const DateInput = forwardRef<DateInputRef, DateInputProps>(WithRefDateInput)

const Container = styled.View({
  flexDirection: 'column',
  alignItems: 'center',
  alignSelf: 'stretch',
  position: 'relative',
  width: '100%',
})
type ValidationBarPropsWithoutFocus = Omit<ValidationBarProps, 'onFocus' | 'width'>
const ValidationBar = styled.View.attrs<ValidationBarPropsWithoutFocus>(
  ({ isEmpty, isFocused, isValid }) => {
    if (isValid) {
      return { backgroundColor: ColorsEnum.GREEN_VALID }
    }

    if (isFocused) {
      return { backgroundColor: ColorsEnum.PRIMARY }
    }
    if (isEmpty) {
      return { backgroundColor: ColorsEnum.GREY_MEDIUM }
    }

    return { backgroundColor: ColorsEnum.ERROR }
  }
)<ValidationBarPropsWithoutFocus>(({ backgroundColor }) => ({
  backgroundColor,
  height: 5,
  borderRadius: 22,
  alignSelf: 'stretch',
  minWidth: 130,
}))

const ValidationBarContainer = styled.View({
  flexDirection: 'column',
  alignItems: 'stretch',
})

const MaskedTextInputElement = styled(MaskedTextInput)({
  fontSize: 18,
  lineHeight: '22px',
  textAlign: 'center',
})
