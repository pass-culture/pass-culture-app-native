import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import {
  NativeSyntheticEvent,
  Platform,
  TextInput,
  TextInputSelectionChangeEventData,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { MaskedTextInput } from 'react-native-mask-text'
import styled from 'styled-components/native'

import { ColorsEnum, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
const DEFAULT_MASK = '99/99/9999'

export enum DatePartType {
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
}

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

const MaskedDateInputValidationBar: React.FC<
  ValidationBarProps & { value: string; width: number }
> = ({ value = '', onFocus, width, ...props }) => {
  return (
    <MaskedDateInputValidationBarContainer width={width}>
      <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={onFocus}>
        <MaskedDateInputValidationBarWrapper>
          <MaskedValidationText>{value}</MaskedValidationText>
          <ValidationBar {...props} />
        </MaskedDateInputValidationBarWrapper>
      </TouchableOpacity>
    </MaskedDateInputValidationBarContainer>
  )
}

const WithRefDateInput: React.ForwardRefRenderFunction<DateInputRef, DateInputProps> = (
  { onSubmit, minDate, maxDate, ...props },
  forwardedRef
) => {
  const inputRef = useRef<TextInput>(null)
  const [value, setValue] = useState(
    [props.initialDay ?? '', props.initialMonth ?? '', props.initialYear ?? ''].join('/').trim()
  )
  const [selection, setSelection] = useState<{ start: number; end: number } | undefined>({
    start: 0,
    end: 0,
  })
  const [focus, setFocus] = useState<'day' | 'month' | 'year'>()
  const dateObject = useMemo(() => {
    const result = (value.trim().length ? value.split('/') : []) as string[]
    return {
      day: result[0] ?? 'JJ',
      month: result[1] ?? 'MM',
      year: result[2] ?? 'AAAA',
    }
  }, [value])
  const date = useMemo(() => {
    if (dateObject.year === 'AAAA' || dateObject.month === 'MM' || dateObject.day === 'JJ') {
      return undefined
    }
    return new Date([dateObject.year, dateObject.month, dateObject.day].join('-'))
  }, [dateObject])

  const validation = useMemo(() => {
    const day = parseInt(dateObject.day)
    const month = parseInt(dateObject.month)
    const year = parseInt(dateObject.year)
    return {
      isDayValid: DAY_VALIDATOR.isValid(day) && DAY_VALIDATOR.hasRightLength(dateObject.day),
      isMonthValid:
        MONTH_VALIDATOR.isValid(month) && MONTH_VALIDATOR.hasRightLength(dateObject.month),
      isYearValid: YEAR_VALIDATOR.isValid(year) && YEAR_VALIDATOR.hasRightLength(dateObject.year),
    }
  }, [dateObject])

  const onSingleInputChange = (text: string) => {
    setValue(text)
    setSelection(undefined)
  }

  const onSelectionChange = ({
    nativeEvent: {
      selection: { start },
    },
  }: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    let nextFocus: typeof focus
    if (start <= 2) {
      nextFocus = 'day'
    } else if (start <= 5) {
      nextFocus = 'month'
    } else {
      nextFocus = 'year'
    }
    setFocus(nextFocus)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputRef.current) inputRef.current.focus()
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

    if (isValidDate && minDate) {
      nextDateValidation.isDateAboveMin = date! >= minDate
    }
    if (isValidDate && maxDate) {
      nextDateValidation.isDateBelowMax = date! <= maxDate
    }

    if (isValidDate) {
      nextDateValidation.isComplete =
        DAY_VALIDATOR.hasRightLength(dateObject.day) &&
        MONTH_VALIDATOR.hasRightLength(dateObject.month) &&
        YEAR_VALIDATOR.hasRightLength(dateObject.year)
    }

    nextDateValidation.isValid =
      isValidDate &&
      nextDateValidation.isComplete &&
      nextDateValidation.isDateAboveMin &&
      nextDateValidation.isDateBelowMax

    return nextDateValidation
  }, [isValidDate, date, dateObject])

  useEffect(() => {
    props.onChangeValue?.(isValidDate ? date! : null, dateValidation)
  }, [dateValidation, isValidDate, date])

  useImperativeHandle(forwardedRef, () => ({
    clearFocuses() {
      inputRef.current!.blur()
    },
  }))

  return (
    <Container>
      <MaskedTextInputElement
        ref={inputRef}
        value={value}
        onChangeText={onSingleInputChange}
        mask={DEFAULT_MASK}
        onSelectionChange={onSelectionChange}
        onBlur={() => setFocus(undefined)}
        selection={Platform.OS !== 'android' ? selection : undefined}
        autoFocus={false}
        keyboardType={'number-pad'}
        pointerEvents={'none'}
        returnKeyType={'done'}
        multiline={true}
        placeholder={'JJ/MM/AAAA'}
        onSubmitEditing={onSubmit}
        type={'custom'}
      />
      <ValidationBarContainer>
        <MaskedDateInputValidationBar
          value={dateObject.day}
          isFocused={focus === 'day'}
          isEmpty={dateObject.day === 'JJ'}
          isValid={validation.isDayValid}
          width={35}
          onFocus={() => {
            setSelection({
              start: 0,
              end: 1,
            })
            inputRef.current!.focus()
          }}
        />
        <Spacer />
        <MaskedDateInputValidationBar
          value={dateObject.month}
          isFocused={focus === 'month'}
          isEmpty={dateObject.month === 'MM'}
          isValid={validation.isMonthValid}
          width={40}
          onFocus={() => {
            setSelection({
              start: 3,
              end: 4,
            })
            inputRef.current!.focus()
          }}
        />
        <Spacer />
        <MaskedDateInputValidationBar
          value={dateObject.year}
          isFocused={focus === 'year'}
          isEmpty={dateObject.year === 'AAAA'}
          isValid={validation.isYearValid}
          width={70}
          onFocus={() => {
            setSelection({
              start: 6,
              end: 7,
            })
            inputRef.current!.focus()
          }}
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
    if (isFocused) {
      return { backgroundColor: ColorsEnum.PRIMARY }
    }
    if (isEmpty) {
      return { backgroundColor: ColorsEnum.GREY_MEDIUM }
    }
    if (isValid) {
      return { backgroundColor: ColorsEnum.GREEN_VALID }
    }

    return { backgroundColor: ColorsEnum.ERROR }
  }
)<ValidationBarPropsWithoutFocus>(({ backgroundColor }) => ({
  backgroundColor,
  height: 5,
  borderRadius: 22,
}))

const ValidationBarContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'flex-end',
  maxWidth: 400,
  width: '100%',
  zIndex: 1,
})

const MaskedTextInputElement = styled(MaskedTextInput)({
  fontSize: 18,
  lineHeight: '22px',
  textAlign: 'left',
  width: '100%',
  height: '100%',
  opacity: 0,
  zIndex: 0,
  position: 'absolute',
})

const MaskedValidationText = styled(Typo.Body)({
  fontSize: 18,
  lineHeight: '22px',
  textAlign: 'center',
  marginBottom: 5,
})

const Spacer = styled.View({
  width: 8,
})

const MaskedDateInputValidationBarContainer = styled.View.attrs<{ width: number }>(({ width }) => ({
  width,
}))<{ width: number }>(({ width }) => ({
  alignItems: 'stretch',
  width,
}))

const MaskedDateInputValidationBarWrapper = styled.TouchableOpacity({})
