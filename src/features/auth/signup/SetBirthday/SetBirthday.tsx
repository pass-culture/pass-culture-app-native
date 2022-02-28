import { t } from '@lingui/macro'
import React, { FunctionComponent, useState } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { BirthdayInformationModal } from 'features/auth/signup/SetBirthday/BirthdayInformationModal/BirthdayInformationModal'
import { DatePickerDropDown } from 'features/auth/signup/SetBirthday/DatePicker/DatePickerDropDown.web'
import { DatePickerSpinner } from 'features/auth/signup/SetBirthday/DatePicker/DatePickerSpinner'
import { MINIMUM_DATE, UNDER_YOUNGEST_AGE } from 'features/auth/signup/SetBirthday/utils/constants'
import { useDatePickerErrorHandler } from 'features/auth/signup/SetBirthday/utils/useDatePickerErrorHandler'
import { PreValidationSignupStepProps } from 'features/auth/signup/types'
import { analytics } from 'libs/analytics'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { useModal } from 'ui/components/modals/useModal'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

export const SetBirthday: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const DEFAULT_SELECTED_DATE = new Date(
    new Date().setFullYear(new Date().getFullYear() - UNDER_YOUNGEST_AGE)
  )
  const MAXIMUM_SPINNER_DATE = new Date(DEFAULT_SELECTED_DATE.getFullYear(), 11, 31)

  const { isTouch } = useTheme()
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

  const DatePicker = isTouch ? DatePickerSpinner : DatePickerDropDown

  return (
    <Form.MaxWidth>
      <InnerContainer>
        <ButtonTertiary
          icon={InfoPlain}
          wording={t`Pour quelle raison\u00a0?`}
          accessibilityLabel={t`Pourquoi me demande-t-on ma date de naissance\u00a0?`}
          onPress={onPressWhy}
        />
        <Spacer.Column numberOfSpaces={2} />
        <DatePicker
          onChange={setDate}
          errorMessage={errorMessage}
          defaultSelectedDate={DEFAULT_SELECTED_DATE}
          maximumDate={MAXIMUM_SPINNER_DATE}
          minimumDate={MINIMUM_DATE}
        />
        <Spacer.Column numberOfSpaces={2} />
        <ButtonPrimary
          testID="date-picker-submit-button"
          wording={t`Continuer`}
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
