import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { MINIMUM_DATE, UNDER_YOUNGEST_AGE } from 'features/auth/constants'
import { useDatePickerErrorHandler } from 'features/auth/helpers/useDatePickerErrorHandler'
import { PreValidationSignupStepProps } from 'features/auth/types'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { storage } from 'libs/storage'
import { Banner } from 'ui/components/Banner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { DateInput } from 'ui/components/inputs/DateInput/DateInput'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { Spacer } from 'ui/theme'

export const SetBirthday: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const CURRENT_YEAR = new Date().getFullYear()
  const DEFAULT_SELECTED_DATE = new Date(new Date().setFullYear(CURRENT_YEAR - UNDER_YOUNGEST_AGE))

  const [defaultSelectedDate, setDefaultSelectedDate] = useState(DEFAULT_SELECTED_DATE)
  const MAXIMUM_SPINNER_DATE = new Date(CURRENT_YEAR - UNDER_YOUNGEST_AGE, 11, 31)

  useEffect(() => {
    const setDate = async () => {
      const userAge = await storage.readObject<number | string>('user_age')
      if (typeof userAge === 'number') {
        setDefaultSelectedDate(new Date(new Date().setFullYear(CURRENT_YEAR - userAge)))
      }
    }

    setDate()
  }, [CURRENT_YEAR])

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
          message="Assure-toi que ton âge est exact. Nous le vérifions et il ne pourra plus être modifié par la suite."
          icon={BicolorIdCard}
        />
        <Spacer.Column numberOfSpaces={6} />
        <DateInput
          onChange={setDate}
          errorMessage={errorMessage}
          defaultSelectedDate={defaultSelectedDate}
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
