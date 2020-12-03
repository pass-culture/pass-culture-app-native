import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useState } from 'react'
import { Alert } from 'react-native'
import styled from 'styled-components/native'

import {
  isPasswordCorrect,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { BottomCardContentContainer } from 'ui/components/BottomCard'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'SetPassword'>

export const SetPassword: FunctionComponent<Props> = ({ route }) => {
  const [password, setPassword] = useState('')
  const { goBack, navigate } = useNavigation()
  const email = route.params.email
  const isNewsletterChecked = route.params.isNewsletterChecked

  function onClose() {
    Alert.alert('TODO: PC-4936 abandon registration')
  }

  function submitPassword() {
    navigate('SetBirthday', { email, isNewsletterChecked, password })
  }

  return (
    <BottomContentPage>
      <ModalHeader
        title={_(t`Ton mot de passe`)}
        rightIcon={Close}
        onRightIconPress={onClose}
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
  )
}

const StyledInput = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: getSpacing(125),
})
