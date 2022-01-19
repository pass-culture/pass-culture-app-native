import { t } from '@lingui/macro'
import moment from 'moment'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Platform, TextInput } from 'react-native'
import { MaskedTextInput } from 'react-native-mask-text'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'tests/utils'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import { StyledInputContainer } from 'ui/components/inputs/StyledInputContainer'
import { getSpacing, Spacer, Typo } from 'ui/theme'

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
  onSubmit?: () => void
}

export interface DateInputRef {
  clearFocuses: () => void
}

const MASK = '99/99/9999'

const WithRefDateInput: React.ForwardRefRenderFunction<DateInputRef, DateInputProps> = (
  { onSubmit, minDate, maxDate, ...props },
  forwardedRef
) => {
  const inputRef = useRef<TextInput>(null)
  const [value, setValue] = useState('')
  const [hasFocus, setHasFocus] = useState(false)

  const date = useMemo(() => {
    if (!value?.length) return null
    const dateStr = value.split('/').reverse().join('-')
    if (moment(dateStr, 'YYYY-MM-DD', true).isValid()) return new Date(dateStr)
    return null
  }, [value])

  useEffect(() => {
    const timeout = globalThis.setTimeout(() => {
      if (Platform.OS !== 'web') {
        if (inputRef.current) inputRef.current.focus()
      }
    }, 500)
    return () => clearTimeout(timeout)
  }, [])

  const isValidDate = date instanceof Date

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

    nextDateValidation.isComplete = value.length === MASK.length

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
    <InputContainer>
      <LabelContainer>
        <Typo.Body>{t`Date de naissance`}</Typo.Body>
        <StyledCaption>{t`JJ/MM/AAAA`}</StyledCaption>
      </LabelContainer>
      <Spacer.Column numberOfSpaces={2} />
      <StyledInputContainer
        isFocus={hasFocus}
        isError={
          dateValidation.isDateAboveMin || dateValidation.isDateBelowMax || !dateValidation.isValid
        }>
        <StyledMaskedTextInput
          mask={MASK}
          keyboardType="number-pad"
          onSubmitEditing={onSubmit}
          onChangeText={setValue}
          placeholder="03/03/2003"
          autoFocus
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          {...accessibilityAndTestId(t`Entrée pour la date de naissance`)}
        />
      </StyledInputContainer>
    </InputContainer>
  )
}

export const DateInput = forwardRef<DateInputRef, DateInputProps>(WithRefDateInput)

const StyledMaskedTextInput = styled(MaskedTextInput).attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.greyDark,
}))(({ theme }) => ({
  flex: 1,
  color: theme.colors.black,
  fontFamily: theme.fontFamily.regular,
  fontSize: getSpacing(3.75),
  height: '100%',
}))

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
