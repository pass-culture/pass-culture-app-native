import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { AsyncError } from 'features/errors/pages/AsyncErrorBoundary'
import { NavigateToHomeWithoutModalOptions } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const ForgottenPassword: FunctionComponent = () => {
  const [email, setEmail] = useState('')
  const [hasError, setHasError] = useState(false)
  const shouldDisableValidateButton = isValueEmpty(email)
  const { navigate } = useNavigation<UseNavigationType>()
  const { refetch, isFetching } = useQuery('forgottenPassword', forgottenPasswordQuery, {
    cacheTime: 0,
    enabled: false,
    onSuccess: () => {
      navigate('ResetPasswordEmailSent', { email })
    },
  })
  async function forgottenPasswordQuery() {
    try {
      await api.postnativev1requestPasswordReset({ email })
    } catch (err) {
      throw new AsyncError('NETWORK_REQUEST_FAILED', refetch)
    }
  }
  function onBackNavigation() {
    navigate('Login')
  }

  function onClose() {
    navigate('Home', NavigateToHomeWithoutModalOptions)
  }

  function onChangeEmail(email: string) {
    if (hasError) {
      setHasError(false)
    }
    setEmail(email)
  }

  async function validateEmail() {
    if (isEmailValid(email)) {
      await refetch()
    } else {
      setHasError(true)
    }
  }

  return (
    <BottomContentPage>
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
            autoCapitalize="none"
            autoFocus={true}
            keyboardType="email-address"
            onChangeText={onChangeEmail}
            placeholder={_(/*i18n: email placeholder */ t`tonadresse@email.com`)}
            textContentType="emailAddress"
            value={email}
          />
          <InputError
            visible={hasError}
            messageId="Format de l'e-mail incorrect"
            numberOfSpacesTop={1}
          />
        </StyledInput>
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary
          title={_(t`Valider`)}
          onPress={validateEmail}
          disabled={shouldDisableValidateButton || isFetching}
        />
      </ModalContent>
    </BottomContentPage>
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
