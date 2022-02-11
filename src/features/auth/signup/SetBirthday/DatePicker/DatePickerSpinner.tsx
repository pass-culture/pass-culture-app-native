import { t } from '@lingui/macro'
import React, { useState } from 'react'
import DatePicker from 'react-native-date-picker'
import styled from 'styled-components/native'

import { DateInput } from 'features/auth/signup/SetBirthday/atoms/DateInput/DateInput'
import {
  DEFAULT_SELECTED_DATE,
  MAXIMUM_SPINNER_DATE,
  MINIMUM_DATE,
} from 'features/auth/signup/SetBirthday/utils/constants'
import { useDatePickerErrorHandler } from 'features/auth/signup/SetBirthday/utils/useDatePickerErrorHandler'
import { SignupData } from 'features/auth/signup/types'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { Spacer } from 'ui/theme'

interface Props {
  accessibilityLabelForNextStep?: string
  goToNextStep: (signupData: Partial<SignupData>) => void
}

export function DatePickerSpinner(props: Props) {
  const [date, setDate] = useState<Date>(DEFAULT_SELECTED_DATE)
  const birthdate = formatDateToISOStringWithoutTime(date)
  const { isDisabled, errorMessage } = useDatePickerErrorHandler(new Date(birthdate))

  function goToNextStep() {
    if (birthdate) {
      props.goToNextStep({ birthdate })
    }
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={5} />
      <DateInput date={date} isFocus={!isDisabled} isError={!!errorMessage} />
      {!!errorMessage && <InputError visible messageId={errorMessage} numberOfSpacesTop={2} />}
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
