import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { MINIMUM_DATE, UNDER_YOUNGEST_AGE } from 'features/auth/constants'
import { useDatePickerErrorHandler } from 'features/auth/helpers/useDatePickerErrorHandler'
import { PreValidationSignupNormalStepProps } from 'features/auth/types'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { storage } from 'libs/storage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { InfoBanner } from 'ui/components/InfoBanner'
import { DateInput } from 'ui/components/inputs/DateInput/DateInput'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { Spacer, Typo } from 'ui/theme'

export const SetBirthdayV2: FunctionComponent<PreValidationSignupNormalStepProps> = (props) => {
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

  const goToNextStep = useCallback(() => {
    if (birthdate) {
      props.goToNextStep({ birthdate })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthdate, props.goToNextStep])

  return (
    <Form.MaxWidth>
      <Typo.Title3>Renseigne ton âge</Typo.Title3>
      <Spacer.Column numberOfSpaces={4} />
      <InnerContainer>
        <InfoBanner
          message="Assure-toi que ton âge est exact. Il ne pourra plus être modifié par la suite et nous vérifions tes informations."
          icon={BicolorIdCard}
        />
        <Spacer.Column numberOfSpaces={10} />
        <DateInput
          onChange={setDate}
          errorMessage={errorMessage}
          defaultSelectedDate={defaultSelectedDate}
          maximumDate={MAXIMUM_SPINNER_DATE}
          minimumDate={MINIMUM_DATE}
        />
        <Spacer.Column numberOfSpaces={10} />
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
