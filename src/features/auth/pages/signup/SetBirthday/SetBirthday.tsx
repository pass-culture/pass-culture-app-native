import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { MINIMUM_DATE, UNDER_YOUNGEST_AGE } from 'features/auth/constants'
import { useDatePickerErrorHandler } from 'features/auth/helpers/useDatePickerErrorHandler'
import { PreValidationSignupNormalStepProps } from 'features/auth/types'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { storage } from 'libs/storage'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { DateInput } from 'ui/components/inputs/DateInput/DateInput'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const SetBirthday: FunctionComponent<PreValidationSignupNormalStepProps> = ({
  goToNextStep,
  accessibilityLabelForNextStep,
  previousSignupData,
}) => {
  const currentYear = new Date().getFullYear()
  const previousBirthdateProvided = previousSignupData.birthdate
  const maximumSpinnerDate = new Date(currentYear - UNDER_YOUNGEST_AGE, 11, 31)

  const initialDate = previousBirthdateProvided
    ? new Date(previousBirthdateProvided)
    : new Date(new Date().setFullYear(currentYear - UNDER_YOUNGEST_AGE))

  const [defaultSelectedDate, setDefaultSelectedDate] = useState(initialDate)

  useEffect(() => {
    const setDate = async () => {
      const userAge = await storage.readObject<number | string>('user_age')
      if (!previousBirthdateProvided && typeof userAge === 'number') {
        setDefaultSelectedDate(new Date(new Date().setFullYear(currentYear - userAge)))
      }
    }

    setDate()
  }, [currentYear, previousBirthdateProvided])

  const [date, setDate] = useState<Date | undefined>()

  const birthdate = date ? formatDateToISOStringWithoutTime(date) : undefined
  const { isDisabled, errorMessage } = useDatePickerErrorHandler(date)

  const onGoToNextStep = useCallback(() => {
    if (birthdate) {
      goToNextStep({ birthdate })
    }
  }, [birthdate, goToNextStep])

  return (
    <Form.MaxWidth>
      <Typo.Title3 {...getHeadingAttrs(2)}>Renseigne ton âge</Typo.Title3>
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
          previousBirthdateProvided={previousBirthdateProvided}
          maximumDate={maximumSpinnerDate}
          minimumDate={MINIMUM_DATE}
        />
        <Spacer.Column numberOfSpaces={10} />
        <ButtonPrimary
          wording="Continuer"
          accessibilityLabel={accessibilityLabelForNextStep}
          disabled={isDisabled}
          onPress={onGoToNextStep}
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
