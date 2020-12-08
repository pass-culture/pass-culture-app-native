import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useCallback, useRef, useState } from 'react'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'

import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { BottomCardContentContainer } from 'ui/components/BottomCard'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { DateInput } from 'ui/components/inputs/DateInput'
import { InputError } from 'ui/components/inputs/InputError'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface State {
  date: string | null
  hasError: boolean
}

type Props = StackScreenProps<RootStackParamList, 'SetBirthday'>

export const SetBirthday: FunctionComponent<Props> = ({ route }) => {
  const keyboardHeightRef = useRef(0)
  const [state, setState] = useState<State>({
    date: '',
    hasError: false,
  })
  const [isComplete, setIsComplete] = useState(false)

  const {
    visible: informationModalVisible,
    showModal: showInformationModal,
    hideModal: hideInformationModal,
  } = useModal(false)

  const { goBack, navigate } = useNavigation<UseNavigationType>()
  const email = route.params.email
  const isNewsletterChecked = route.params.isNewsletterChecked
  const password = route.params.password
  const canNavigateToCguRef = useRef(false)

  function onChangeValue(value: string | null, _isComplete: boolean) {
    setState({
      date: value,
      hasError: _isComplete && value === null,
    })
    // avoid blinking effect on primary button when typing the date
    if (_isComplete !== isComplete) {
      setIsComplete(_isComplete)
    }
  }

  function goToCguAcceptance() {
    navigate('AcceptCgu', {
      email: email,
      isNewsletterChecked: isNewsletterChecked,
      password: password,
      birthday: state.date ? state.date : '',
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
    if (keyboardHeightRef.current === 0) {
      return goToCguAcceptance()
    }

    canNavigateToCguRef.current = true
    Keyboard.dismiss()
  }

  const onKeyboardDismiss = useCallback(() => {
    if (canNavigateToCguRef.current || state.date) {
      goToCguAcceptance()
    }
  }, [])

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
        />
        <BottomCardContentContainer>
          <ButtonTertiary
            title={_(t`Pourquoi ?`)}
            onPress={showInformationModal}
            testIdSuffix={'why-link'}
          />
          <DateInputContainer>
            <DateInput onChangeValue={onChangeValue} />
            <InputError
              visible={state.hasError}
              messageId="La date choisie est incorrecte"
              numberOfSpacesTop={5}
            />
          </DateInputContainer>
          <ButtonPrimary
            title={_(t`Continuer`)}
            disabled={!isComplete}
            testIdSuffix={'validate-birthday'}
            onPress={animateBeforeNavigation}
          />
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
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const DateInputContainer = styled.View({
  marginVertical: getSpacing(10),
  alignItems: 'center',
  width: '100%',
})
