import { t } from '@lingui/macro'
import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { BirthdayInformationModal } from 'features/auth/signup/SetBirthday/BirthdayInformationModal'
import { PreValidationSignupStepProps } from 'features/auth/signup/types'
import { analytics } from 'libs/analytics'
import { dateDiffInFullYears } from 'libs/dates'
import { env } from 'libs/environment'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { DateInput, DateInputRef, DateValidation } from 'ui/components/inputs/DateInput'
import { InputError } from 'ui/components/inputs/InputError'
import { useModal } from 'ui/components/modals/useModal'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { getSpacing, Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

let INITIAL_DATE: Date | null = null

if (__DEV__ && env.SIGNUP_DATE) {
  INITIAL_DATE = new Date(env.SIGNUP_DATE) // '2003-01-01T00:00:00Z'
}

const DEFAULT_YOUNGEST_AGE = 15
const MIN_DATE = new Date('1900-01-01T00:00:00Z')

interface State {
  date: Date | null
  isDateComplete: boolean
  isDateValid: boolean
  isTooYoung: boolean
  isTooOld: boolean
}

export const SetBirthday: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const { isMobileViewport } = useTheme()
  const [wereBirthdayAnalyticsTriggered, setWereBirthdayAnalyticsTriggered] = useState(false)
  const [state, setState] = useState<State>({
    date: INITIAL_DATE,
    isDateComplete: false,
    isDateValid: false,
    isTooYoung: false,
    isTooOld: false,
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { data: settings } = useAppSettings()

  const now = new Date()
  const youngestAge = settings?.accountCreationMinimumAge ?? DEFAULT_YOUNGEST_AGE
  const maxYear = now.getFullYear() - youngestAge
  const maxDate = new Date(maxYear, now.getMonth(), now.getDate())

  const { visible, showModal: showInformationModal, hideModal } = useModal(false)

  const dateInputRef = useRef<DateInputRef>(null)

  function onChangeValue(date: Date | null, validation: DateValidation) {
    setState({
      date,
      isDateComplete: validation.isComplete,
      isDateValid: validation.isValid,
      isTooYoung: !validation.isDateBelowMax,
      isTooOld: !validation.isDateAboveMin,
    })
  }

  function goToNextStep() {
    const { date } = state
    if (date) {
      const birthday = formatDateToISOStringWithoutTime(date)
      props.goToNextStep({ birthdate: birthday })
    }
  }

  function onPressWhy() {
    analytics.logConsultWhyAnniversary()
    showInformationModal()
  }

  useEffect(() => {
    if (!state.isDateComplete || state.isDateValid) return setErrorMessage(null)
    if (state.date) {
      if (state.isTooYoung && !wereBirthdayAnalyticsTriggered) {
        const age = dateDiffInFullYears(state.date, now)
        analytics.logSignUpTooYoung(age)
        setWereBirthdayAnalyticsTriggered(true)
        return setErrorMessage(
          t`Tu dois avoir au moins\u00a0${youngestAge}\u00a0ans pour t’inscrire au pass Culture`
        )
      }
      if (state.isTooOld) {
        const age = dateDiffInFullYears(state.date, now)
        return setErrorMessage(
          t`Euh... Il semblerait qu’il y ait une erreur. As-tu réellement\u00a0${age}\u00a0ans\u00a0?`
        )
      }
    }
    return setErrorMessage(t`La date n’existe pas. Exemple de résultat attendu\u00a0: 03/03/2003`)
  }, [state])

  return (
    <Form.MaxWidth>
      <InnerContainer>
        <ButtonTertiary
          icon={InfoPlain}
          title={t`Pour quelle raison\u00a0?`}
          onPress={onPressWhy}
        />
        <Spacer.Column numberOfSpaces={5} />
        <DateInputContainer>
          <DateInput
            autoFocus={true}
            onChangeValue={onChangeValue}
            ref={dateInputRef}
            minDate={MIN_DATE}
            maxDate={maxDate}
            onSubmit={goToNextStep}
          />
          {errorMessage ? (
            <InputError visible messageId={errorMessage} numberOfSpacesTop={2} />
          ) : (
            <Spacer.Column numberOfSpaces={getSpacing(isMobileViewport ? 2.5 : 1.5)} />
          )}
        </DateInputContainer>
        <Spacer.Column numberOfSpaces={5} />
        <ButtonPrimary
          title={t`Continuer`}
          accessibilityLabel={props.accessibilityLabelForNextStep}
          disabled={!state.isDateValid}
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

const DateInputContainer = styled.View({
  alignItems: 'stretch',
  flexDirection: 'column',
  width: '100%',
})
