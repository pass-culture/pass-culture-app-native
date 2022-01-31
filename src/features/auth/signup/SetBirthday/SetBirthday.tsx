import { t } from '@lingui/macro'
import React, { FunctionComponent, useState } from 'react'
import DatePicker from 'react-native-date-picker'
import styled from 'styled-components/native'

import { BirthdayInformationModal } from 'features/auth/signup/SetBirthday/BirthdayInformationModal/BirthdayInformationModal'
import { DateInput } from 'features/auth/signup/SetBirthday/DateInput/DateInput'
import { PreValidationSignupStepProps } from 'features/auth/signup/types'
import { analytics } from 'libs/analytics'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { useModal } from 'ui/components/modals/useModal'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

const currentDateWithoutTime = formatDateToISOStringWithoutTime(new Date())

export const SetBirthday: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const [date, setDate] = useState<Date>(new Date())
  const { visible, showModal: showInformationModal, hideModal } = useModal(false)

  function onPressWhy() {
    analytics.logConsultWhyAnniversary()
    showInformationModal()
  }

  const selectedDateWithoutTime = formatDateToISOStringWithoutTime(date)
  const isDisabled = currentDateWithoutTime === selectedDateWithoutTime

  function goToNextStep() {
    if (date) {
      const birthday = selectedDateWithoutTime
      props.goToNextStep({ birthdate: birthday })
    }
  }

  return (
    <Form.MaxWidth>
      <InnerContainer>
        <ButtonTertiary
          icon={InfoPlain}
          wording={t`Pour quelle raison\u00a0?`}
          onPress={onPressWhy}
        />
        <Spacer.Column numberOfSpaces={5} />
        <DateInput date={date} />
        <Spacer.Column numberOfSpaces={5} />
        <StyledDateTimePicker
          date={date}
          onDateChange={setDate}
          mode="date"
          locale="fr-FR"
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 2)}
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
      </InnerContainer>
      <BirthdayInformationModal visible={visible} hideModal={hideModal} />
    </Form.MaxWidth>
  )
}

const InnerContainer = styled.View({
  width: '100%',
  alignItems: 'center',
})

const StyledDateTimePicker = styled(DatePicker).attrs(({ theme }) => ({
  textColor: theme.colors.black,
}))({ width: '100%' })
