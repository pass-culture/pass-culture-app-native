import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Platform, TextInput } from 'react-native'
import styled from 'styled-components/native'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import validateDate from 'validate-date'

import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { MaskedTextInput } from 'react-native-mask-text'
import { StyledInputContainer } from 'ui/components/inputs/StyledInputContainer'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import { t } from '@lingui/macro'

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
  isValid: (input: string) => input.length === 2 && parseInt(input) >= 1 && parseInt(input) <= 31,
}
const MONTH_VALIDATOR = {
  isValid: (input: string) => input.length === 2 && parseInt(input) >= 1 && parseInt(input) <= 12,
}
const YEAR_VALIDATOR = {
  isValid: (input: string) =>
    input.length === 4 &&
    parseInt(input) >= MIN_POSSIBLE_YEAR &&
    parseInt(input) <= MAX_POSSIBLE_YEAR,
}

export const DateInputLabelText = styled(Typo.Body)({
  textAlign: 'center',
  fontSize: 18,
  lineHeight: '22px',
})

const WithRefDateInput: React.ForwardRefRenderFunction<DateInputRef, DateInputProps> = (
  { onSubmit, minDate, maxDate, initialDay, initialMonth, initialYear, ...props },
  forwardedRef
) => {
  const inputRef = useRef<TextInput>(null)
  const initialValue = [initialDay ?? '', initialMonth ?? '', initialYear ?? ''].join('').trim()
  const [value, setValue] = useState(initialValue)

  const dateParts = useMemo(() => {
    const day = value.substr(0, 2)
    const month = value.substr(2, 2)
    const year = value.substr(4, 4)

    return {
      day: {
        value: day,
        isValid: DAY_VALIDATOR.isValid(day ?? ''),
      },
      month: {
        value: month,
        isValid: MONTH_VALIDATOR.isValid(month ?? ''),
      },
      year: {
        value: year,
        isValid: YEAR_VALIDATOR.isValid(year ?? ''),
      },
    }
  }, [value])

  const date = useMemo(() => {
    const { year, month, day } = dateParts
    const dateStr = [year.value, month.value, day.value].join('-')
    if (validateDate(dateStr, 'boolean')) {
      return new Date(+year.value, +month.value - 1, +day.value)
    }
    return null
  }, [dateParts])

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

    nextDateValidation.isComplete =
      dateParts.day.isValid && dateParts.month.isValid && dateParts.year.isValid

    nextDateValidation.isValid =
      isValidDate &&
      nextDateValidation.isComplete &&
      nextDateValidation.isDateAboveMin &&
      nextDateValidation.isDateBelowMax

    return nextDateValidation
  }, [isValidDate, date, dateParts])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (Platform.OS !== 'web') {
        if (inputRef.current) inputRef.current.focus()
      }
    }, 500)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    props.onChangeValue?.(isValidDate && date ? date : null, dateValidation)
  }, [dateValidation, isValidDate, date])

  useImperativeHandle(forwardedRef, () => ({
    clearFocuses() {
      inputRef.current?.blur?.()
    },
  }))

  return (
    <InputContainer>
      <LabelContainer>
        <Typo.Body>{t`Date de naissance`}</Typo.Body>
        <StyledCaption>{t`JJ/MM/AAAA`}</StyledCaption>
      </LabelContainer>
      <Spacer.Column numberOfSpaces={2} />
      <StyledInputContainer>
        <StyledMaskedTextInput
          mask={'99/99/9999'}
          keyboardType={'number-pad'}
          onSubmitEditing={onSubmit}
          returnKeyType={'done'}
          onChangeText={setValue}
          placeholder={'03/03/2003'}
          autoFocus={true}
        />
      </StyledInputContainer>
    </InputContainer>
  )
}

export const DateInput = forwardRef<DateInputRef, DateInputProps>(WithRefDateInput)

const StyledMaskedTextInput = styled(MaskedTextInput).attrs({
  placeholderTextColor: ColorsEnum.GREY_DARK,
})(({ theme }) => ({
  flex: 1,
  padding: 0,
  color: theme.colors.black,
  fontFamily: theme.fontFamily.regular,
  fontSize: getSpacing(3.75),
  height: '100%',
}))

const StyledCaption = styled(Typo.Caption)(({ theme, color }) => ({
  color: color ?? theme.colors.greyDark,
}))
