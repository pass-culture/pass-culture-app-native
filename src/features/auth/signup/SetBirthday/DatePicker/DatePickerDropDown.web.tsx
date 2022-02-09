import { t } from '@lingui/macro'
import React, { useState } from 'react'

import { DateInputDesktop } from 'features/auth/signup/SetBirthday/atoms/DateInput/DateInputDesktop.web'
import { useDatePickerErrorHandler } from 'features/auth/signup/SetBirthday/utils/useDatePickerErrorHandler'
import { SignupData } from 'features/auth/signup/types'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { Spacer } from 'ui/theme'

interface Props {
  accessibilityLabelForNextStep?: string
  goToNextStep: (signupData: Partial<SignupData>) => void
  chidren?: never
}

export function DatePickerDropDown(props: Props) {
  const [date, setDate] = useState<Date | undefined>()

  const { isDisabled, errorMessage } = useDatePickerErrorHandler(date)

  function goToNextStep() {
    if (date) {
      const birthdate = formatDateToISOStringWithoutTime(date)
      props.goToNextStep({ birthdate })
    }
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={2} />
      <DateInputDesktop onDateChange={setDate} />
      {!!errorMessage && <InputError visible messageId={errorMessage} numberOfSpacesTop={2} />}
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        wording={t`Continuer`}
        accessibilityLabel={props.accessibilityLabelForNextStep}
        disabled={isDisabled}
        onPress={goToNextStep}
      />
      <Spacer.Column numberOfSpaces={2} />
    </React.Fragment>
  )
}
