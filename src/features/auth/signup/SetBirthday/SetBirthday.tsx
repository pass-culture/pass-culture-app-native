import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { MINIMUM_DATE, UNDER_YOUNGEST_AGE } from 'features/auth/signup/SetBirthday/utils/constants'
import { useDatePickerErrorHandler } from 'features/auth/signup/SetBirthday/utils/useDatePickerErrorHandler'
import { PreValidationSignupStepProps } from 'features/auth/signup/types'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { Banner } from 'ui/components/Banner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { DateInput } from 'ui/components/inputs/DateInput/DateInput'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { Spacer } from 'ui/theme'

export const SetBirthday: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const DEFAULT_SELECTED_DATE = new Date(
    new Date().setFullYear(new Date().getFullYear() - UNDER_YOUNGEST_AGE)
  )
  const MAXIMUM_SPINNER_DATE = new Date(DEFAULT_SELECTED_DATE.getFullYear(), 11, 31)

  const [date, setDate] = useState<Date | undefined>()

  const birthdate = date ? formatDateToISOStringWithoutTime(date) : undefined
  const { isDisabled, errorMessage } = useDatePickerErrorHandler(date)

  function goToNextStep() {
    if (birthdate) {
      props.goToNextStep({ birthdate })
    }
  }

  return (
    <Form.MaxWidth>
      <InnerContainer>
        <Banner
          title="Assure-toi que ton âge est exact. Nous le vérifions et il ne pourra plus être modifié par la suite."
          icon={BicolorIdCard}
        />
        <Spacer.Column numberOfSpaces={6} />
        <DateInput
          onChange={setDate}
          errorMessage={errorMessage}
          defaultSelectedDate={DEFAULT_SELECTED_DATE}
          maximumDate={MAXIMUM_SPINNER_DATE}
          minimumDate={MINIMUM_DATE}
        />
        <Spacer.Column numberOfSpaces={2} />
        <ButtonPrimary
          wording="Continuer"
          accessibilityLabel={props.accessibilityLabelForNextStep}
          disabled={isDisabled}
          onPress={goToNextStep}
        />
        <Spacer.Column numberOfSpaces={5} />
      </InnerContainer>
    </Form.MaxWidth>
  )
}

const InnerContainer = styled.View({
  width: '100%',
  alignItems: 'center',
})
