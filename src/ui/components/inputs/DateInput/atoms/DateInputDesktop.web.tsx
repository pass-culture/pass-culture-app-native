import React, { useState, useEffect, FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { getDateValuesString } from 'shared/date/getDateValuesString'
import { monthNames } from 'shared/date/months'
import { DatePickerProps, PartialDate } from 'ui/components/inputs/DateInput/DatePicker/types'
import { useDatePickerOptions } from 'ui/components/inputs/DateInput/hooks/useDatePickerOptions'
import { DropDown } from 'ui/components/inputs/DropDown/DropDown'
import { Spacer } from 'ui/theme'

export const DateInputDesktop: FunctionComponent<DatePickerProps> = ({
  defaultSelectedDate,
  maximumDate,
  minimumDate,
  onChange,
  accessibilityDescribedBy,
  errorMessage,
}) => {
  const { day, month, year } = getDefaultDateValues(defaultSelectedDate)

  const [date, setDate] = useState<PartialDate>({
    day,
    month,
    year,
  })

  const maximumYear = getDateValuesString(maximumDate ?? defaultSelectedDate).year
  const minimumYear = minimumDate.getFullYear()
  const { optionGroups } = useDatePickerOptions({ date, maximumYear, minimumYear })

  const onPartialDateChange = (key: keyof PartialDate) => (value: string) => {
    setDate((prevDateValues) => ({ ...prevDateValues, [key]: value }))
  }

  useEffect(() => {
    onChange(getValidDate(date))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  return (
    <Container testID="date-picker-dropdown" accessibilityDescribedBy={accessibilityDescribedBy}>
      <DropDownContainer>
        <DropDown
          value={date.day}
          label="Jour"
          options={optionGroups.day}
          onChange={onPartialDateChange('day')}
          noBorderRadiusRight
          accessibilityLabel="Entrée pour le jour de la date de naissance"
          isError={!!errorMessage}
        />
      </DropDownContainer>
      <Spacer.Row numberOfSpaces={2} />
      <DropDownContainer>
        <DropDown
          value={date.month}
          label="Mois"
          options={optionGroups.month}
          onChange={onPartialDateChange('month')}
          noBorderRadiusRight
          noBorderRadiusLeft
          accessibilityLabel="Entrée pour le mois de la date de naissance"
          isError={!!errorMessage}
        />
      </DropDownContainer>
      <Spacer.Row numberOfSpaces={2} />
      <DropDownContainer>
        <DropDown
          value={date.year}
          label="Année"
          options={optionGroups.year}
          onChange={onPartialDateChange('year')}
          noBorderRadiusLeft
          accessibilityLabel="Entrée pour l’année de la date de naissance"
          isError={!!errorMessage}
        />
      </DropDownContainer>
    </Container>
  )
}

const getDefaultDateValues = (initialDate?: Date): PartialDate => {
  if (!initialDate)
    return {
      day: undefined,
      month: undefined,
      year: undefined,
    }

  return {
    day: initialDate.getUTCDate().toString(),
    month: monthNames.at(initialDate.getUTCMonth()),
    year: initialDate.getUTCFullYear().toString(),
  }
}

const getValidDate = (date: PartialDate) => {
  if (!date.year || !date.month || !date.day) return

  const dateMonth = monthNames.indexOf(date.month)
  const maybeValidDate = new Date(Number(date.year), dateMonth, Number(date.day))
  return maybeValidDate.getDate() == Number(date.day) ? maybeValidDate : undefined
}

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  width: '100%',
  maxWidth: theme.forms.maxWidth,
}))

const DropDownContainer = styled.View({
  flex: 1,
})
