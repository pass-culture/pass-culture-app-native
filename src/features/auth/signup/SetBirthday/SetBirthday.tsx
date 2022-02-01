import { t } from '@lingui/macro'
import React, { FunctionComponent, useEffect, useState } from 'react'
import DatePicker from 'react-native-date-picker'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { BirthdayInformationModal } from 'features/auth/signup/SetBirthday/BirthdayInformationModal/BirthdayInformationModal'
import { DateInput } from 'features/auth/signup/SetBirthday/DateInput/DateInput'
import { PreValidationSignupStepProps } from 'features/auth/signup/types'
import { analytics } from 'libs/analytics'
import { dateDiffInFullYears } from 'libs/dates'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { InputError } from 'ui/components/inputs/InputError'
import { useModal } from 'ui/components/modals/useModal'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

const MINIMUM_DATE = new Date('1900-01-01')
const DEFAULT_YOUNGEST_AGE = 15

export const SetBirthday: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const CURRENT_DATE = new Date()
  const CURRENT_DATE_WITHOUT_TIME = formatDateToISOStringWithoutTime(CURRENT_DATE)

  const [date, setDate] = useState<Date>(CURRENT_DATE)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { visible, showModal: showInformationModal, hideModal } = useModal(false)

  function onPressWhy() {
    analytics.logConsultWhyAnniversary()
    showInformationModal()
  }

  const SELECTED_DATE_WITHOUT_TIME = formatDateToISOStringWithoutTime(date)
  const isDisabled = CURRENT_DATE_WITHOUT_TIME === SELECTED_DATE_WITHOUT_TIME

  const { data: settings } = useAppSettings()
  const youngestAge = settings?.accountCreationMinimumAge ?? DEFAULT_YOUNGEST_AGE

  useEffect(() => {
    const age = dateDiffInFullYears(date, CURRENT_DATE)
    if (!isDisabled && age < 15) {
      analytics.logSignUpTooYoung(age)
      return setErrorMessage(
        t`Tu dois avoir au moins\u00a0${youngestAge}\u00a0ans pour t’inscrire au pass Culture`
      )
    }
    return setErrorMessage(null)
  }, [date])

  function goToNextStep() {
    if (date) {
      const birthday = SELECTED_DATE_WITHOUT_TIME
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
        <DateInput date={date} isFocus={!isDisabled} isError={!!errorMessage} />
        {!!errorMessage && <InputError visible messageId={errorMessage} numberOfSpacesTop={2} />}
        <Spacer.Column numberOfSpaces={5} />
        <StyledDatePicker
          testID="datePicker"
          date={date}
          onDateChange={setDate}
          mode="date"
          locale="fr-FR"
          maximumDate={CURRENT_DATE}
          minimumDate={MINIMUM_DATE}
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

const StyledDatePicker = styled(DatePicker).attrs(({ theme }) => ({
  textColor: theme.colors.black,
}))({ width: '100%' })
