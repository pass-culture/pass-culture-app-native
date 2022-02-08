import { t } from '@lingui/macro'
import React, { FunctionComponent, useState } from 'react'
import DatePicker from 'react-native-date-picker'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { BirthdayInformationModal } from 'features/auth/signup/SetBirthday/BirthdayInformationModal/BirthdayInformationModal'
import { DateInput } from 'features/auth/signup/SetBirthday/DateInput/DateInput'
import { useDatePickerErrorHandler } from 'features/auth/signup/SetBirthday/utils/useDatePickerErrorHandler'
import { PreValidationSignupStepProps } from 'features/auth/signup/types'
import { analytics } from 'libs/analytics'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { InputError } from 'ui/components/inputs/InputError'
import { useModal } from 'ui/components/modals/useModal'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

const MINIMUM_DATE = new Date('1900-01-01')

export const SetBirthday: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const CURRENT_DATE = new Date()
  const [date, setDate] = useState<Date>(CURRENT_DATE)
  const { visible, showModal: showInformationModal, hideModal } = useModal(false)
  const { isDisabled, errorMessage } = useDatePickerErrorHandler(date)

  function onPressWhy() {
    analytics.logConsultWhyAnniversary()
    showInformationModal()
  }

  function goToNextStep() {
    const birthdate = formatDateToISOStringWithoutTime(date)
    if (birthdate) {
      props.goToNextStep({ birthdate })
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
        <DateInput date={date} isFocus={!isDisabled} isError={!!errorMessage} />
        {!!errorMessage && (
          <InputError
            visible
            messageId={errorMessage}
            numberOfSpacesTop={2}
            relatedInputId={birthdateInputErrorId}
          />
        )}
        <Spacer.Column numberOfSpaces={5} />
        <SpinnerDatePicker
          testID="datePicker"
          date={date}
          onDateChange={setDate}
          mode="date"
          locale="fr-FR"
          maximumDate={MAXIMUM_SPINNER_DATE}
          minimumDate={MINIMUM_DATE}
          androidVariant="nativeAndroid"
          aria-describedby={birthdateInputErrorId}
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

const SpinnerDatePicker = styled(DatePicker).attrs(({ theme }) => ({
  textColor: theme.colors.black,
}))({ width: '100%' })
