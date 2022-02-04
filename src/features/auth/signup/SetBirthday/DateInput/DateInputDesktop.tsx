import { t } from '@lingui/macro'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Platform, TextInput, TextInputProps } from 'react-native'
import styled from 'styled-components/native'
// @ts-ignore : problem with the module typing
import validateDate from 'validate-date'

import { DateInputRef, DateValidation } from 'features/auth/signup/SetBirthday/DateInput/utils'
import { accessibilityAndTestId } from 'tests/utils'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

interface ValidationBarProps {
  testID?: string
  backgroundColor?: ColorsEnum
  isEmpty: boolean
  isValid?: boolean
  isFocused: boolean
  onFocus: () => void
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

type DateInputLabelProps = {
  value: string
  isValid: boolean
  hasFocus: boolean
  onFocus: () => void
  placeholder: string
  accessibilityLabel: string
}

const DateInputLabel: React.FC<DateInputLabelProps> = ({
  placeholder,
  value,
  isValid,
  hasFocus,
  onFocus,
  accessibilityLabel,
}) => {
  const valueLength = value?.trim?.()?.length
  const text = valueLength ? value.trim() : placeholder
  return (
    <StyledTouchableOpacity {...accessibilityAndTestId(accessibilityLabel)} onPress={onFocus}>
      <DateInputLabelText
        testID={'date-input-label-text'}
        numberOfLines={1}
        valueLength={valueLength}>
        {text}
      </DateInputLabelText>
      <ValidationBar
        testID={'date-input-validation-bar'}
        isFocused={hasFocus}
        isEmpty={!value?.length}
        isValid={isValid}
      />
    </StyledTouchableOpacity>
  )
}

const StyledTouchableOpacity = styled.TouchableOpacity({
  flex: 1,
  justifyContent: 'center',
  width: '30%',
  maxWidth: 130,
})

export const DateInputLabelText = styled(Typo.Body)<{ valueLength: number }>(
  ({ valueLength, theme }) => ({
    textAlign: 'center',
    fontSize: 18,
    lineHeight: '22px',
    color: valueLength ? undefined : theme.colors.greyDark,
  })
)

const WithRefDateInput: React.ForwardRefRenderFunction<DateInputRef, DateInputProps> = (
  { onSubmit, minDate, maxDate, initialDay, initialMonth, initialYear, ...props },
  forwardedRef
) => {
  const inputRef = useRef<TextInput>(null)
  const initialValue = [initialDay ?? '', initialMonth ?? '', initialYear ?? ''].join('').trim()
  const [value, setValue] = useState(initialValue)
  const [currentFocus, setCurrentFocus] = useState<'day' | 'month' | 'year'>()

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

  const onSelectionChange: TextInputProps['onSelectionChange'] = ({
    nativeEvent: {
      selection: { start },
    },
  }) => {
    if ([0, 1].includes(start)) {
      setCurrentFocus('day')
    } else if ([2, 3].includes(start)) {
      setCurrentFocus('month')
    } else {
      setCurrentFocus('year')
    }
  }

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
    <Container>
      <ValidationBarContainer>
        <HiddenTextInput
          ref={inputRef}
          pointerEvents={'none'}
          keyboardType={'number-pad'}
          onSubmitEditing={onSubmit}
          onChangeText={setValue}
          value={value}
          autoFocus={true}
          maxLength={8}
          onBlur={() => setCurrentFocus(undefined)}
          onSelectionChange={onSelectionChange}
          selectionColor={'transparent'}
          {...accessibilityAndTestId(t`Entrée pour la date de naissance`)}
        />
        <DateInputLabel
          accessibilityLabel={t`Entrée pour le jour de la date de naissance`}
          placeholder={t`JJ`}
          value={dateParts.day.value}
          isValid={!dateValidation.isComplete ? dateParts.day.isValid : dateValidation.isValid}
          hasFocus={currentFocus === 'day'}
          onFocus={() => {
            setCurrentFocus('day')
            inputRef.current?.focus?.()
            setValue('')
          }}
        />
        <Spacer.Flex flex={0.25} />
        <DateInputLabel
          accessibilityLabel={t`Entrée pour le mois de la date de naissance`}
          placeholder={t`MM`}
          value={dateParts.month.value}
          isValid={!dateValidation.isComplete ? dateParts.month.isValid : dateValidation.isValid}
          hasFocus={currentFocus === 'month'}
          onFocus={() => {
            setCurrentFocus('month')
            inputRef.current?.focus?.()
            setValue(value.substr(0, 2))
          }}
        />
        <Spacer.Flex flex={0.25} />
        <DateInputLabel
          accessibilityLabel={t`Entrée pour l'année jour de la date de naissance`}
          placeholder={t`AAAA`}
          value={dateParts.year.value}
          isValid={!dateValidation.isComplete ? dateParts.year.isValid : dateValidation.isValid}
          hasFocus={currentFocus === 'year'}
          onFocus={() => {
            setCurrentFocus('year')
            inputRef.current?.focus?.()
            setValue(value.substr(0, 4))
          }}
        />
      </ValidationBarContainer>
    </Container>
  )
}

export const DateInputDesktop = forwardRef<DateInputRef, DateInputProps>(WithRefDateInput)

const Container = styled.View({
  flexDirection: 'column',
  alignItems: 'stretch',
  alignSelf: 'center',
  position: 'relative',
  width: '100%',
  maxWidth: 300,
})
type ValidationBarPropsWithoutFocus = Omit<ValidationBarProps, 'onFocus' | 'width'>

const ValidationBar = styled.View.attrs<ValidationBarPropsWithoutFocus>(
  ({ isEmpty, isFocused, isValid, theme }) => {
    if (isValid) return { backgroundColor: theme.colors.greenValid }
    if (isFocused) return { backgroundColor: theme.colors.primary }
    if (isEmpty) return { backgroundColor: theme.colors.greyMedium }
    return { backgroundColor: theme.colors.error }
  }
)<ValidationBarPropsWithoutFocus>(({ backgroundColor }) => ({
  backgroundColor,
  height: 5,
  borderRadius: 22,
  alignSelf: 'stretch',
}))

const ValidationBarContainer = styled.View({
  flexDirection: 'row',
  position: 'relative',
})

const HiddenTextInput = styled(TextInput)(({ theme }) => ({
  fontSize: 1,
  lineHeight: '22px',
  textAlign: 'center',
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  zIndex: theme.zIndex.background,
  opacity: 0.1,
  ...Platform.select({
    web: {
      caretColor: 'transparent',
    },
  }),
}))
