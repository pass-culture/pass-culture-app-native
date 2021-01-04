import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useCallback, useRef, useState } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { QuitSignupModal, SignupSteps } from 'features/auth/signup/QuitSignupModal'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { _ } from 'libs/i18n'
import { BottomCardContentContainer } from 'ui/components/BottomCard'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { ExternalLink } from 'ui/components/buttons/externalLink/ExternalLink'
import { DateInput, DateInputRef, DateValidation } from 'ui/components/inputs/DateInput'
import { InputError } from 'ui/components/inputs/InputError'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { StepDots } from 'ui/components/StepDots'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { Close } from 'ui/svg/icons/Close'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'SetBirthday'>

export const SetBirthday: FunctionComponent<Props> = ({ route }) => {
  const keyboardHeightRef = useRef(0)
  const [date, setDate] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [isTooYoung, setIsTooYoung] = useState(false)
  const [isTooOld, setIsTooOld] = useState(false)

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
  const canNavigateToCguRef = useRef(false)
  const isReadyToBeSubmitted = isComplete && isValid && !isTooYoung && !isTooOld

  const dateInputRef = useRef<DateInputRef>(null)

  function onChangeValue(date: string | null, validation: DateValidation) {
    setDate(date)
    setIsComplete(validation.isComplete)
    setIsValid(validation.isValid)
    setIsTooYoung(validation.isTooYoung)
    setIsTooOld(validation.isTooOld)
  }

  function goToCguAcceptance() {
    navigate('AcceptCgu', {
      email: email,
      isNewsletterChecked: isNewsletterChecked,
      password: password,
      birthday: date ? date : '',
    })
  }

  /**
   * It's a trick to bypass the unexpected keyboard behavior on the next page:
   *
   *   Actually the view starts in a top position but without the keyboard displayed
   *   and animates itself to reach the bottom position.
   *
   * To fix:
   * If the keyboard is already down, we just navigate.
   * Otherwise, we trigger the keyboard dismissing which will result in:
   * - a call to onKeyboardDismiss()
   * - and a navigation to the next screen
   */
  function animateBeforeNavigation() {
    if (keyboardHeightRef.current === 0 && date) {
      return goToCguAcceptance()
    }

    canNavigateToCguRef.current = true
    Keyboard.dismiss()
  }

  const onKeyboardDismiss = useCallback(() => {
    if (informationModalVisible) {
      // quits if the keyboard is dismissed because the modal is displayed
      return
    }
    if (canNavigateToCguRef.current && date) {
      goToCguAcceptance()
    }
  }, [informationModalVisible, date])

  useFocusEffect(() => {
    // reset this variable each time the screen is focused to prevent automatic navigation to the next screen
    canNavigateToCguRef.current = false
  })

  function showQuitSignupModal() {
    dateInputRef.current && dateInputRef.current.clearFocuses()
    showFullPageModal()
  }

  function onPressWhy() {
    analytics.logClickWhyAnniversary()
    showInformationModal()
  }

  return (
    <React.Fragment>
      <BottomContentPage
        keyboardHeightRef={keyboardHeightRef}
        onKeyboardDismiss={onKeyboardDismiss}>
        <ModalHeader
          title={_(t`Ton anniversaire`)}
          leftIcon={ArrowPrevious}
          onLeftIconPress={goBack}
          rightIcon={Close}
          onRightIconPress={showQuitSignupModal}
        />
        <BottomCardContentContainer>
          <TouchableOpacityFullWidth onPress={Keyboard.dismiss}>
            <ButtonTertiary
              title={_(t`Pourquoi ?`)}
              onPress={onPressWhy}
              testIdSuffix={'why-link'}
            />
            <DateInputContainer>
              <DateInput onChangeValue={onChangeValue} ref={dateInputRef} />
              <InputError
                visible={isComplete && (!isValid || isTooOld)}
                messageId="La date choisie est incorrecte"
                numberOfSpacesTop={5}
              />
              <InputError
                visible={isComplete && isValid && isTooYoung}
                messageId="Tu dois avoir 16 ans pour t'inscrire"
                numberOfSpacesTop={5}
              />
            </DateInputContainer>
            <Paragraphe>
              <Typo.Body>
                {_(
                  /*i18n: signup birthday page reCAPTCHA */ t`Ce site est protégé par reCAPTCHA Google. La`
                )}
              </Typo.Body>
              <ExternalLink
                text={_(t`Charte des Données Personnelles`)}
                url={'https://policies.google.com/privacy'}
                color={ColorsEnum.PRIMARY}
                testID="external-link-google-data-privacy"
              />
              <Spacer.Row numberOfSpaces={1} />
              <Typo.Body>{_(/*i18n: signup birthday page reCAPTCHA */ t`et les`)}</Typo.Body>
              <ExternalLink
                text={_(t`Conditions Générales d'Utilisation`)}
                url={'https://policies.google.com/terms'}
                color={ColorsEnum.PRIMARY}
                testID="external-link-google-cgu"
              />
              <Spacer.Row numberOfSpaces={1} />
              <Typo.Body>
                {_(/*i18n: signup birthday page reCAPTCHA */ t` s'appliquent.`)}
              </Typo.Body>
            </Paragraphe>
            <ButtonPrimary
              title={_(t`Continuer`)}
              disabled={!isReadyToBeSubmitted}
              testIdSuffix={'validate-birthday'}
              onPress={animateBeforeNavigation}
            />
            <Spacer.Column numberOfSpaces={5} />
            <StepDots numberOfSteps={4} currentStep={3} />
          </TouchableOpacityFullWidth>
        </BottomCardContentContainer>
      </BottomContentPage>
      <AppInformationModal
        title="Pourquoi ?"
        visible={informationModalVisible}
        onCloseIconPress={hideInformationModal}
        testIdSuffix="birthday-information">
        <React.Fragment>
          <BirthdayCake />
          <Spacer.Column numberOfSpaces={2} />
          <StyledBody>
            {_(t`L’application pass Culture est accessible à tous.
         Si tu as 18 ans, tu es éligible pour obtenir une aide financière de 300 €
          proposée par le Ministère de la Culture qui sera créditée directement sur ton compte pass Culture.`)}
          </StyledBody>
        </React.Fragment>
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

const TouchableOpacityFullWidth = styled(TouchableOpacity)({
  width: '100%',
  alignItems: 'center',
})

const Paragraphe = styled.Text({
  flexWrap: 'wrap',
  alignItems: 'center',
  alignSelf: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  marginVertical: getSpacing(8),
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const DateInputContainer = styled.View({
  marginTop: getSpacing(10),
  alignItems: 'center',
  width: '100%',
})
