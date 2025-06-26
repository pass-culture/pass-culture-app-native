import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { CAPITALIZED_MONTHS } from 'shared/date/months'
import { DatePickerDropDownProps } from 'ui/components/inputs/DateInput/DatePicker/DatePickerDropDown.web'
import { PartialDate } from 'ui/components/inputs/DateInput/DatePicker/types'
import { useDatePickerOptions } from 'ui/components/inputs/DateInput/hooks/useDatePickerOptions'
import { DropDown } from 'ui/components/inputs/DropDown/DropDown'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const DateInputDesktop: FunctionComponent<DatePickerDropDownProps> = ({
  date: initialDate,
  maximumDate,
  minimumDate,
  onChange,
  accessibilityDescribedBy,
  errorMessage,
}) => {
  const { day, month, year } = getDefaultDateValues(initialDate)

  const [date, setDate] = useState<PartialDate<'long'>>({
    day,
    month,
    year,
  })

  const maximumYear = maximumDate.getFullYear()
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
    <Container
      testID="date-picker-dropdown"
      accessibilityDescribedBy={accessibilityDescribedBy}
      gap={2}>
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

const getDefaultDateValues = (initialDate?: Date): PartialDate<'long'> => {
  if (!initialDate)
    return {
      day: undefined,
      month: undefined,
      year: undefined,
    }

  return {
    day: initialDate.getUTCDate().toString(),
    month: CAPITALIZED_MONTHS.at(initialDate.getUTCMonth()),
    year: initialDate.getUTCFullYear().toString(),
  }
}

const getValidDate = (date: PartialDate<'long'>) => {
  if (!date.year || !date.month || !date.day) return

  const dateMonth = CAPITALIZED_MONTHS.indexOf(date.month)
  const maybeValidDate = new Date(Number(date.year), dateMonth, Number(date.day))
  return maybeValidDate.getDate() == Number(date.day) ? maybeValidDate : undefined
}

const Container = styled(ViewGap)(({ theme }) => ({
  flexDirection: 'row',
  width: '100%',
  maxWidth: theme.forms.maxWidth,
}))

const DropDownContainer = styled.View({
  flex: 1,
})
