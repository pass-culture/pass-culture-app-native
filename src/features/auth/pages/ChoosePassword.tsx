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
import { BottomCard, BottomCardContentContainer } from 'ui/components/BottomCard'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Background } from 'ui/svg/Background'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'ChoosePassword'>

export const ChoosePassword: FunctionComponent<Props> = ({ navigation }) => {
  const [password, setPassword] = useState('')
  const { goBack } = useNavigation()

  // TODO: PC-5430 gestion du storage de l'email (props ? navigation params ?) & transmission password

  function onClose() {
    Alert.alert('TODO: PC-4936 abandon registration')
  }

  function submitPassword() {
    navigation.navigate('SetBirthday')
  }

  return (
    <React.Fragment>
      <Background />
      <BottomCard>
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
      </BottomCard>
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
