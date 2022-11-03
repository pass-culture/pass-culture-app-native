import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { BirthdayInformationModal } from 'features/auth/signup/SetBirthday/BirthdayInformationModal/BirthdayInformationModal'
import { MINIMUM_DATE, UNDER_YOUNGEST_AGE } from 'features/auth/signup/SetBirthday/utils/constants'
import { useDatePickerErrorHandler } from 'features/auth/signup/SetBirthday/utils/useDatePickerErrorHandler'
import { PreValidationSignupStepProps } from 'features/auth/signup/types'
import { analytics } from 'libs/firebase/analytics'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { Banner } from 'ui/components/Banner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { Form } from 'ui/components/Form'
import { DateInput } from 'ui/components/inputs/DateInput/DateInput'
import { useModal } from 'ui/components/modals/useModal'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Spacer } from 'ui/theme'

export const SetBirthday: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const DEFAULT_SELECTED_DATE = new Date(
    new Date().setFullYear(new Date().getFullYear() - UNDER_YOUNGEST_AGE)
  )
  const MAXIMUM_SPINNER_DATE = new Date(DEFAULT_SELECTED_DATE.getFullYear(), 11, 31)

  const { visible, showModal: showInformationModal, hideModal } = useModal(false)
  const [date, setDate] = useState<Date | undefined>()

  const birthdate = date ? formatDateToISOStringWithoutTime(date) : undefined
  const { isDisabled, errorMessage } = useDatePickerErrorHandler(date)

  function onPressWhy() {
    analytics.logConsultWhyAnniversary()
    showInformationModal()
  }

  function goToNextStep() {
    if (birthdate) {
      props.goToNextStep({ birthdate })
    }
  }

  return (
    <Form.MaxWidth>
      <InnerContainer>
        <ButtonTertiaryPrimary
          icon={InfoPlain}
          wording="Pour quelle raison&nbsp;?"
          accessibilityLabel="Pour quelle raison me demande-t-on ma date de naissance&nbsp;?"
          onPress={onPressWhy}
        />
        <Spacer.Column numberOfSpaces={4} />
        <Banner
          title="Assure-toi que ton âge est exact. Il ne pourra plus être modifié par la suite et nous vérifions tes informations."
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
          testID="date-picker-submit-button"
          wording="Continuer"
          accessibilityLabel={props.accessibilityLabelForNextStep}
          disabled={isDisabled}
          onPress={goToNextStep}
        />
        <Spacer.Column numberOfSpaces={5} />
      </InnerContainer>
      <BirthdayInformationModal visible={visible} hideModal={hideModal} />
    </Form.MaxWidth>
  )
}

const InnerContainer = styled.View({
  width: '100%',
  alignItems: 'center',
})
