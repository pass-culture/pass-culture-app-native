import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useRef, useState } from 'react'
import styled from 'styled-components/native'

import { SIGNUP_NUMBER_OF_STEPS, useDepositAmountsByAge } from 'features/auth/api'
import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { useAppSettings } from 'features/auth/settings'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
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

const DEFAULT_YOUNGEST_AGE = 15
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
  const { data: settings } = useAppSettings()
  const deposit = useDepositAmountsByAge().eighteenYearsOldDeposit.replace(' ', '\u00a0')

  const now = new Date()
  const youngestAge = settings?.accountCreationMinimumAge ?? DEFAULT_YOUNGEST_AGE
  const maxYear = now.getFullYear() - youngestAge
  const maxDate = new Date(maxYear, now.getMonth(), now.getDate())

  const { email, isNewsletterChecked, password } = route.params

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

  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack('SetPassword', { email, isNewsletterChecked })

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
      navigate('AcceptCgu', {
        email,
        isNewsletterChecked,
        password,
        birthday,
        postalCode: undefined,
      })
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
        analytics.logSignUpTooYoung(age)
        setWereBirthdayAnalyticsTriggered(true)
      }
      return (
        <InputError
          visible
          messageId={t`Tu dois avoir` + '\u00a0' + youngestAge + '\u00a0' + t`ans pour t'inscrire`}
          numberOfSpacesTop={5}
        />
      )
    }
    return (
      <InputError visible messageId={t`La date choisie est incorrecte`} numberOfSpacesTop={5} />
    )
  }

  const displayPostGeneralisationMessage =
    settings?.enableNativeEacIndividual && settings.enableUnderageGeneralisation

  const financialHelpMessage = displayPostGeneralisationMessage
    ? t`Entre 15 et 18 ans, tu es éligible à une aide financière progressive allant de 20` +
      '\u00a0' +
      t`€ à` +
      '\u00a0' +
      deposit +
      '\u00a0' +
      t`offerte par le Gouvernement.` +
      '\n' +
      '\n'
    : t`Si tu as 18 ans, tu es éligible à une aide financière de` +
      '\u00a0' +
      deposit +
      '\u00a0' +
      t`offerte par le Gouvernement.` +
      '\n' +
      '\n'

  const birthdayInformation =
    t`Nous avons besoin de connaître ton âge.` +
    ' ' +
    financialHelpMessage +
    t`Cette aide sera créditée directement sur ton compte pass Culture.`

  const modalTitle = t`Pourquoi saisir ma date de naissance\u00a0?`

  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={t`Ton anniversaire`}
          leftIconAccessibilityLabel={t`Revenir en arrière`}
          leftIcon={ArrowPrevious}
          onLeftIconPress={goBack}
          rightIconAccessibilityLabel={t`Abandonner l'inscription`}
          rightIcon={Close}
          onRightIconPress={showQuitSignupModal}
        />
        <BottomCardContentContainer>
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
                onSubmit={goToNextStep}
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
            <StepDots numberOfSteps={SIGNUP_NUMBER_OF_STEPS} currentStep={3} />
          </InnerContainer>
        </BottomCardContentContainer>
      </BottomContentPage>
      <AppInformationModal
        title={modalTitle}
        numberOfLinesTitle={3}
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

const InnerContainer = styled.View({
  width: '100%',
  alignItems: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const DateInputContainer = styled.View({
  alignItems: 'stretch',
  flexDirection: 'column',
  width: '100%',
})

const ModalChildrenContainer = styled.View({
  paddingTop: getSpacing(5),
  alignItems: 'center',
})
