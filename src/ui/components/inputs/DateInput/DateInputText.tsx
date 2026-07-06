import { format, isValid, parse } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'

import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { TextInput } from 'ui/designSystem/TextInput/TextInput'

type Props = {
  date: Date
  onChange: (date: Date) => void
  minimumDate?: Date
  maximumDate?: Date
  errorMessage?: string
}

const label = 'Date de naissance'
const dateFormat = 'dd/MM/yyyy'
const invalidDateMessage = 'La date saisie est invalide.'
const maxLength = 10

const formatInput = (text: string) => {
  const digits = text.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

const parseDate = (value: string, minimumDate?: Date, maximumDate?: Date) => {
  if (value.length !== maxLength) return null
  const parsed = parse(value, dateFormat, new Date())
  if (!isValid(parsed)) return null
  if (format(parsed, dateFormat) !== value) return null
  if (minimumDate && parsed < minimumDate) return null
  if (maximumDate && parsed > maximumDate) return null
  return parsed
}

export const DateInputText = ({
  date,
  onChange,
  minimumDate,
  maximumDate,
  errorMessage,
}: Props) => {
  const [value, setValue] = useState(format(date, dateFormat))

  useEffect(() => {
    setValue(format(date, dateFormat))
  }, [date])

  const parsedDate = useMemo(
    () => parseDate(value, minimumDate, maximumDate),
    [value, minimumDate, maximumDate]
  )

  const displayedError =
    value.length === maxLength ? (parsedDate ? errorMessage : invalidDateMessage) : errorMessage

  const computedAccessibilityLabel = getComputedAccessibilityLabel(label, value, displayedError)

  const onTextChange = (text: string) => {
    const formatted = formatInput(text)
    setValue(formatted)
    const parsed = parseDate(formatted, minimumDate, maximumDate)
    if (parsed) onChange(parsed)
  }

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onTextChange}
      keyboardType="number-pad"
      maxLength={maxLength}
      errorMessage={displayedError}
      description="Format&nbsp;: 01/09/2002"
      accessibilityLabel={computedAccessibilityLabel}
    />
  )
}
