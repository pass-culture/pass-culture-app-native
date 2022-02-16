import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BirthdayInformationModal } from 'features/auth/signup/SetBirthday/BirthdayInformationModal/BirthdayInformationModal'
import { DatePickerSpinner } from 'features/auth/signup/SetBirthday/DatePicker/DatePickerSpinner'
import { PreValidationSignupStepProps } from 'features/auth/signup/types'
import { analytics } from 'libs/analytics'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { useModal } from 'ui/components/modals/useModal'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Form } from 'ui/web/form/Form'

export const SetBirthday: FunctionComponent<PreValidationSignupStepProps> = (props) => {
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
        <DatePickerSpinner
          goToNextStep={props.goToNextStep}
          accessibilityLabelForNextStep={props.accessibilityLabelForNextStep}
        />
      </InnerContainer>
      <BirthdayInformationModal visible={visible} hideModal={hideModal} />
    </Form.MaxWidth>
  )
}

const InnerContainer = styled.View({
  width: '100%',
  alignItems: 'center',
})
