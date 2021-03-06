import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useRef, useState } from 'react'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import styled from 'styled-components/native'

import { useDepositAmount, useSignInNumberOfSteps } from 'features/auth/api'
import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { dateDiffInFullYears } from 'libs/dates'
import { env } from 'libs/environment'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { BottomCardContentContainer } from 'ui/components/BottomCardContentContainer'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { DateInput, DateInputRef, DateValidation } from 'ui/components/inputs/DateInput'
import { InputError } from 'ui/components/inputs/InputError'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { StepDots } from 'ui/components/StepDots'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'SetBirthday'>

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

const YOUNGEST_AGE = 16

const MIN_DATE = new Date('1900-01-01T00:00:00Z')

interface State {
  date: Date | null
  isDateComplete: boolean
  isDateValid: boolean
  isTooYoung: boolean
  isTooOld: boolean
}

export const SetBirthday: FunctionComponent<Props> = ({ route }) => {
  const [wereBirthdayAnalyticsTriggered, setWereBirthdayAnalyticsTriggered] = useState(false)
  const [state, setState] = useState<State>({
    date: INITIAL_DATE,
    isDateComplete: false,
    isDateValid: false,
    isTooYoung: false,
    isTooOld: false,
  })

  const deposit = useDepositAmount()

  const now = new Date()
  const currentYear = now.getUTCFullYear()
  const maxDate = new Date(now)
  maxDate.setFullYear(currentYear - YOUNGEST_AGE)

  const {
    visible: informationModalVisible,
    showModal: showInformationModal,
    hideModal: hideInformationModal,
  } = useModal(false)

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  const { goBack, navigate } = useNavigation<UseNavigationType>()
  const email = route.params.email
  const isNewsletterChecked = route.params.isNewsletterChecked
  const password = route.params.password

  const dateInputRef = useRef<DateInputRef>(null)
  const numberOfSteps = useSignInNumberOfSteps()

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
    const nextPage = 'AcceptCgu'
    // FIXME: we disabled this after gen cause it was displaying postal code during registration
    // const nextPage = settings?.wholeFranceOpening ? 'AcceptCgu' : 'SetPostalCode'
    const { date } = state
    if (date) {
      const birthday = formatDateToISOStringWithoutTime(date)
      navigate(nextPage, { email, isNewsletterChecked, password, birthday, postalCode: undefined })
    }
  }

  function showQuitSignupModal() {
    dateInputRef.current && dateInputRef.current.clearFocuses()
    showFullPageModal()
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
        logBirthdayAnalytics(age)
        setWereBirthdayAnalyticsTriggered(true)
      }
      return (
        <InputError
          visible
          messageId={t`Tu dois avoir 16 ans pour t'inscrire`}
          numberOfSpacesTop={5}
        />
      )
    }
    return (
      <InputError visible messageId={t`La date choisie est incorrecte`} numberOfSpacesTop={5} />
    )
  }

  const birthdayInformation =
    t`L’application pass Culture est accessible à tous.` +
    '\n' +
    t`Si tu as 18 ans, tu pourras obtenir une aide financière de` +
    '\u00a0' +
    deposit +
    '\u00a0' +
    t`proposée par le Ministère de la Culture qui sera créditée directement sur ton compte pass Culture.`

  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={t`Ton anniversaire`}
          leftIcon={ArrowPrevious}
          onLeftIconPress={goBack}
          rightIcon={Close}
          onRightIconPress={showQuitSignupModal}
        />
        <BottomCardContentContainer>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <InnerContainer>
              <ButtonTertiary title={t`Pourquoi ?`} onPress={onPressWhy} />
              <Spacer.Column numberOfSpaces={10} />
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
                />
                {renderErrorMessages()}
              </DateInputContainer>
              <Spacer.Column numberOfSpaces={14} />
              <ButtonPrimary
                title={t`Continuer`}
                disabled={!state.isDateValid}
                onPress={goToNextStep}
              />
              <Spacer.Column numberOfSpaces={5} />
              <StepDots numberOfSteps={numberOfSteps} currentStep={3} />
            </InnerContainer>
          </TouchableWithoutFeedback>
        </BottomCardContentContainer>
      </BottomContentPage>
      <AppInformationModal
        title="Pourquoi ?"
        visible={informationModalVisible}
        onCloseIconPress={hideInformationModal}
        testIdSuffix="birthday-information">
        <ModalChildrenContainer>
          <BirthdayCake />
          <Spacer.Column numberOfSpaces={2} />
          <StyledBody>{birthdayInformation}</StyledBody>
        </ModalChildrenContainer>
      </AppInformationModal>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        testIdSuffix="birthday-quit-signup"
        signupStep={SignupSteps.Birthday}
      />
    </React.Fragment>
  )
}

async function logBirthdayAnalytics(age: number) {
  if (age <= 13) {
    analytics.logSignUpLessThanOrEqualTo13()
  } else if (age === 14 || age === 15) {
    analytics.logSignUpBetween14And15Included()
  }
}

const InnerContainer = styled.View({
  width: '100%',
  alignItems: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const DateInputContainer = styled.View({
  alignItems: 'center',
  width: '100%',
})

const ModalChildrenContainer = styled.View({
  paddingTop: getSpacing(5),
  alignItems: 'center',
})
