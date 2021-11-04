import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { useRef } from 'react'
import { Platform, ScrollView, StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { isLongEnough } from 'features/auth/components/PasswordSecurityRules'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useChangeEmailMutation } from 'features/profile/mutations'
import { ChangeEmailDisclaimer } from 'features/profile/pages/ChangeEmail/ChangeEmailDisclaimer'
import { useValidateEmail } from 'features/profile/pages/ChangeEmail/utils/useValidateEmail'
import { useSafeState } from 'libs/hooks'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { EmailInput } from 'ui/components/inputs/EmailInput'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

export function ChangeEmail() {
  const theme = useTheme()
  const [email, setEmail] = useSafeState('')
  const [password, setPassword] = useSafeState('')
  const emailErrorMessage = useValidateEmail(email)
  const [passwordErrorMessage, setPasswordErrorMessage] = useSafeState<string | null>(null)
  const { navigate } = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar } = useSnackBarContext()

  const { mutate: changeEmail, isLoading } = useChangeEmailMutation({
    onSuccess: () => {
      showSuccessSnackBar({
        message: t`E-mail envoyé ! Tu as 24h pour activer ta nouvelle adresse. Si tu ne le trouves pas, pense à vérifier tes spams.`,
        timeout: SNACK_BAR_TIME_OUT,
      })
      navigateToProfile()
    },
    onError: () => {
      setPasswordErrorMessage(t`Mot de passe incorrect`)
    },
  })

  const scrollRef = useRef<ScrollView | null>(null)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const { bottom } = useSafeAreaInsets()
  useForHeightKeyboardEvents(setKeyboardHeight)

  const disabled = !isLongEnough(password) || (!!emailErrorMessage && email.length > 0) || isLoading

  const navigateToProfile = () => navigate(...getTabNavConfig('Profile'))

  const submitEmailChange = () => {
    changeEmail({ email, password })
  }

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <StyledScrollView
        ref={scrollRef}
        contentContainerStyle={getScrollViewContentContainerStyle(keyboardHeight)}>
        <Spacer.Column numberOfSpaces={18} />
        <ChangeEmailDisclaimer />
        <Spacer.Column numberOfSpaces={4} />
        <CenteredContainer>
          <InputContainer>
            <EmailInput label={t`Nouvel e-mail`} email={email} onEmailChange={setEmail} />
            {!!emailErrorMessage && (
              <InputError visible messageId={emailErrorMessage} numberOfSpacesTop={2} />
            )}
          </InputContainer>
          <Spacer.Column numberOfSpaces={4} />
          <InputContainer>
            <PasswordInput
              label={t`Mot de passe`}
              value={password}
              onChangeText={setPassword}
              placeholder={t`Ton mot de passe`}
              textContentType="password"
            />
            {!!passwordErrorMessage && (
              <InputError visible messageId={passwordErrorMessage} numberOfSpacesTop={2} />
            )}
          </InputContainer>

          {theme.isDesktop ? <Spacer.Column numberOfSpaces={10} /> : <Spacer.Flex flex={1} />}
          {!!keyboardHeight && <Spacer.Column numberOfSpaces={2} />}
          <ButtonContainer paddingBottom={keyboardHeight ? 0 : bottom}>
            <ButtonPrimary title={t`Enregistrer`} onPress={submitEmailChange} disabled={disabled} />
          </ButtonContainer>
          <Spacer.Column numberOfSpaces={6} />
        </CenteredContainer>
      </StyledScrollView>
      <PageHeader title={t`Modifier mon e-mail`} />
    </React.Fragment>
  )
}

const StyledScrollView = styled(ScrollView)({
  paddingHorizontal: getSpacing(5),
})

const CenteredContainer = styled.View({
  flex: 1,
  alignItems: 'center',
})

const getScrollViewContentContainerStyle = (keyboardHeight: number): StyleProp<ViewStyle> => ({
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingBottom: Platform.OS === 'ios' ? keyboardHeight : 0,
  backgroundColor: ColorsEnum.WHITE,
})

const ButtonContainer = styled.View<{ paddingBottom: number }>(({ paddingBottom }) => ({
  paddingBottom,
  alignItems: 'center',
  width: '100%',
}))
