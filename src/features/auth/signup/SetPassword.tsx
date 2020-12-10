import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import {
  isPasswordCorrect,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import { QuitSignupModal } from 'features/auth/signup/QuitSignupModal'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { BottomCardContentContainer } from 'ui/components/BottomCard'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'SetPassword'>

export const SetPassword: FunctionComponent<Props> = ({ route }) => {
  const [password, setPassword] = useState('')
  const { goBack, navigate } = useNavigation()
  const email = route.params.email
  const isNewsletterChecked = route.params.isNewsletterChecked

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  function submitPassword() {
    navigate('SetBirthday', { email, isNewsletterChecked, password })
  }

  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={_(t`Ton mot de passe`)}
          rightIcon={Close}
          onRightIconPress={showFullPageModal}
          leftIcon={ArrowPrevious}
          onLeftIconPress={goBack}
        />
        <BottomCardContentContainer>
          <Spacer.Column numberOfSpaces={6} />
          <StyledInput>
            <Typo.Body>{_(t`Mot de passe`)}</Typo.Body>
            <Spacer.Column numberOfSpaces={2} />
            <PasswordInput
              value={password}
              autoFocus
              onChangeText={setPassword}
              placeholder={_(/*i18n: password placeholder */ t`Ton mot de passe`)}
            />
          </StyledInput>
          <PasswordSecurityRules password={password} />
          <Spacer.Column numberOfSpaces={6} />
          <ButtonPrimary
            title={_(t`Continuer`)}
            onPress={submitPassword}
            disabled={!isPasswordCorrect(password)}
          />
        </BottomCardContentContainer>
      </BottomContentPage>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        testIdSuffix="birthday-information"
      />
    </React.Fragment>
  )
}

const StyledInput = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: getSpacing(125),
})
