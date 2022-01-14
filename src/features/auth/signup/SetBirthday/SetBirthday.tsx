import { t } from '@lingui/macro'
import React, { FunctionComponent, useRef, useState } from 'react'
import styled from 'styled-components/native'

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
import { Spacer } from 'ui/theme'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'

let INITIAL_DATE: Date | null = null
let INITIAL_DAY: string | undefined = undefined
let INITIAL_MONTH: string | undefined = undefined
let INITIAL_YEAR: string | undefined = undefined

if (__DEV__ && env.SIGNUP_DATE) {
  INITIAL_DATE = new Date(env.SIGNUP_DATE) // '2003-01-01T00:00:00Z'
  INITIAL_DAY = `${INITIAL_DATE.getDate()}`.padStart(2, '0')
  INITIAL_MONTH = `${INITIAL_DATE.getMonth() + 1}`.padStart(2, '0')
  INITIAL_YEAR = `${INITIAL_DATE.getFullYear()}`
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
  const [wereBirthdayAnalyticsTriggered, setWereBirthdayAnalyticsTriggered] = useState(false)
  const [state, setState] = useState<State>({
    date: INITIAL_DATE,
    isDateComplete: false,
    isDateValid: false,
    isTooYoung: false,
    isTooOld: false,
  })
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

  function renderErrorMessages() {
    if (!state.isDateComplete || state.isDateValid) {
      return
    }
    if (state.isTooYoung && !state.isTooOld) {
      if (!wereBirthdayAnalyticsTriggered && state.date) {
        const age = dateDiffInFullYears(state.date, now)
        analytics.logSignUpTooYoung(age)
        setWereBirthdayAnalyticsTriggered(true)
      }
      return (
        <InputError
          visible
          messageId={t`Tu dois avoir\u00a0${youngestAge}\u00a0ans pour t'inscrire`}
          numberOfSpacesTop={5}
        />
      )
    }
    return (
      <InputError visible messageId={t`La date choisie est incorrecte`} numberOfSpacesTop={5} />
    )
  }

  return (
    <React.Fragment>
      <InnerContainer>
        <ButtonTertiary
          icon={InfoPlain}
          title={t`Pour quelle raison\u00a0?`}
          onPress={onPressWhy}
        />
        <Spacer.Column numberOfSpaces={8} />
        <DateInputContainer>
          <DateInput
            autoFocus={true}
            onChangeValue={onChangeValue}
            ref={dateInputRef}
            minDate={MIN_DATE}
            maxDate={maxDate}
            initialDay={INITIAL_DAY}
            initialMonth={INITIAL_MONTH}
            initialYear={INITIAL_YEAR}
            onSubmit={goToNextStep}
          />
          {renderErrorMessages()}
        </DateInputContainer>
        <Spacer.Column numberOfSpaces={14} />
        <ButtonPrimary
          title={t`Continuer`}
          accessibilityLabel={props.accessibilityLabelForNextStep}
          disabled={!state.isDateValid}
          onPress={goToNextStep}
        />
        <Spacer.Column numberOfSpaces={5} />
      </InnerContainer>
      <BirthdayInformationModal settings={settings} visible={visible} hideModal={hideModal} />
    </React.Fragment>
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
