import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useState } from 'react'
import { Alert } from 'react-native'
import styled from 'styled-components/native'

import { requestPasswordReset } from 'features/auth/api'
import { HomeStackParamList } from 'features/home/navigation/HomeNavigator'
import { _ } from 'libs/i18n'
import { BottomCard } from 'ui/components/BottomCard'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { TextInput } from 'ui/components/inputs/TextInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { SafeContainer } from 'ui/components/SafeContainer'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = StackScreenProps<HomeStackParamList, 'ForgottenPassword'>

export const ForgottenPassword: FunctionComponent<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('')

  const shouldDisableValidateButton = isValueEmpty(email)

  function onBackNavigation() {
    navigation.navigate('Login')
  }

  function onClose() {
    navigation.navigate('Home', { shouldDisplayLoginModal: false })
  }

  async function validateEmail() {
    await requestPasswordReset({ email })
      .then(() => {
        navigation.navigate('ResetPasswordEmailSent', { email })
      })
      .catch((err) => {
        Alert.alert(err.message)
      })
  }

  return (
    <SafeContainer noTabBarSpacing>
      <BottomCard>
        <ModalHeader
          title={_(t`Mot de passe oublié`)}
          leftIcon={ArrowPrevious}
          onLeftIconPress={onBackNavigation}
          rightIcon={Close}
          onRightIconPress={onClose}
        />
        <ModalContent>
          <CenteredText>
            <Typo.Body>
              {_(
                t`Saisis ton adresse e-mail pour recevoir un lien qui te permettra de réinitialiser ton mot de passe !`
              )}
            </Typo.Body>
          </CenteredText>
          <Spacer.Column numberOfSpaces={4} />
          <StyledInput>
            <Typo.Body>{_(t`Adresse e-mail`)}</Typo.Body>
            <Spacer.Column numberOfSpaces={2} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder={_(/*i18n: email placeholder */ t`tonadresse@email.com`)}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoFocus={true}
            />
          </StyledInput>
          <Spacer.Column numberOfSpaces={6} />
          <ButtonPrimary
            title={_(t`Valider`)}
            onPress={validateEmail}
            disabled={shouldDisableValidateButton}
          />
        </ModalContent>
      </BottomCard>
    </SafeContainer>
  )
}

const ModalContent = styled.View({
  paddingTop: getSpacing(7),
  alignItems: 'center',
  width: '100%',
})

const CenteredText = styled.Text({
  textAlign: 'center',
})

const StyledInput = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: getSpacing(125),
})
