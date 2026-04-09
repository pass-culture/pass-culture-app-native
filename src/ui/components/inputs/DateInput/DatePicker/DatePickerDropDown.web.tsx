import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { DateInputDesktop } from 'ui/components/inputs/DateInput/atoms/DateInputDesktop.web'
import { DatePickerProps } from 'ui/components/inputs/DateInput/DatePicker/types'
import { InputError } from 'ui/components/inputs/InputError'

export type DatePickerDropDownProps = Omit<DatePickerProps, 'date'> & {
  date?: Date
}

export const DatePickerDropDown: FunctionComponent<DatePickerDropDownProps> = ({
  onChange,
  date,
  minimumDate,
  maximumDate,
  errorMessage,
}) => {
  return (
    <React.Fragment>
      <DateInputDesktop
        date={date}
        onChange={onChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        errorMessage={errorMessage}
      />
      <InputErrorContainer errorMessage={!!errorMessage}>
        <InputError visible={!!errorMessage} errorMessage={errorMessage} numberOfSpacesTop={2} />
      </InputErrorContainer>
    </React.Fragment>
  )
}

const InputErrorContainer = styled.View<{ errorMessage: boolean }>(({ theme, errorMessage }) => ({
  marginBottom: errorMessage
    ? theme.designSystem.size.spacing.xxxl
    : theme.designSystem.size.spacing.l,
}))
