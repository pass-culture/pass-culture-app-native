import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { BirthdayInformationModal } from 'features/auth/signup/SetBirthday/BirthdayInformationModal/BirthdayInformationModal'
import { DatePickerSpinner } from 'features/auth/signup/SetBirthday/DatePicker/DatePickerSpinner.web'
import { PreValidationSignupStepProps } from 'features/auth/signup/types'
import { analytics } from 'libs/analytics'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { useModal } from 'ui/components/modals/useModal'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Form } from 'ui/web/form/Form'
import { DatePickerDropDown } from 'features/auth/signup/SetBirthday/DatePicker/DatePickerDropDown.web'

export const SetBirthday: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const { isTouch } = useTheme()

  const { visible, showModal: showInformationModal, hideModal } = useModal(false)

  function onPressWhy() {
    analytics.logConsultWhyAnniversary()
    showInformationModal()
  }

  return (
    <Form.MaxWidth>
      <InnerContainer>
        <ButtonTertiary
          icon={InfoPlain}
          wording={t`Pour quelle raison\u00a0?`}
          onPress={onPressWhy}
        />
        {isTouch ? (
          <DatePickerSpinner
            goToNextStep={props.goToNextStep}
            accessibilityLabelForNextStep={props.accessibilityLabelForNextStep}
          />
        ) : (
          <DatePickerDropDown
            goToNextStep={props.goToNextStep}
            accessibilityLabelForNextStep={props.accessibilityLabelForNextStep}
          />
        )}
      </InnerContainer>
      <BirthdayInformationModal visible={visible} hideModal={hideModal} />
    </Form.MaxWidth>
  )
}
const InnerContainer = styled.View({
  width: '100%',
  alignItems: 'center',
})
