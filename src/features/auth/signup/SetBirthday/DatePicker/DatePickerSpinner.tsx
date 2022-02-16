import { t } from '@lingui/macro'
import React, { useState } from 'react'
import DatePicker from 'react-native-date-picker'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { DateInput } from 'features/auth/signup/SetBirthday/atoms/DateInput/DateInput'
import { DatePickerProps } from 'features/auth/signup/SetBirthday/DatePicker/types'
import { MINIMUM_DATE, UNDER_YOUNGEST_AGE } from 'features/auth/signup/SetBirthday/utils/constants'
import { useDatePickerErrorHandler } from 'features/auth/signup/SetBirthday/utils/useDatePickerErrorHandler'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { Spacer } from 'ui/theme'

export function DatePickerSpinner(props: DatePickerProps) {
  const DEFAULT_SELECTED_DATE = new Date(
    new Date().setFullYear(new Date().getFullYear() - UNDER_YOUNGEST_AGE)
  )
  const MAXIMUM_SPINNER_DATE = new Date(DEFAULT_SELECTED_DATE.getFullYear(), 11, 31)

  const [date, setDate] = useState<Date>(DEFAULT_SELECTED_DATE)
  const birthdate = formatDateToISOStringWithoutTime(date)
  const { isDisabled, errorMessage } = useDatePickerErrorHandler(new Date(birthdate))

  function goToNextStep() {
    if (birthdate) {
      props.goToNextStep({ birthdate })
    }
  }

  const birthdateInputErrorId = uuidv4()

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={5} />
      <DateInput date={date} isFocus={!isDisabled} isError={!!errorMessage} />
      {!!errorMessage && (
        <InputError
          visible
          messageId={errorMessage}
          numberOfSpacesTop={2}
          relatedInputId={birthdateInputErrorId}
        />
      )}
      <Spacer.Column numberOfSpaces={5} />
      <SpinnerDatePicker
        testID="datePicker"
        date={date}
        onDateChange={setDate}
        mode="date"
        locale="fr-FR"
        maximumDate={MAXIMUM_SPINNER_DATE}
        minimumDate={MINIMUM_DATE}
        androidVariant="nativeAndroid"
        aria-describedby={birthdateInputErrorId}
      />
      <Spacer.Column numberOfSpaces={2} />
      <ButtonPrimary
        wording={t`Continuer`}
        accessibilityLabel={props.accessibilityLabelForNextStep}
        disabled={isDisabled}
        onPress={goToNextStep}
      />
      <Spacer.Column numberOfSpaces={5} />
    </React.Fragment>
  )
}

const SpinnerDatePicker = styled(DatePicker).attrs(({ theme }) => ({
  textColor: theme.colors.black,
}))({ width: '100%' })
