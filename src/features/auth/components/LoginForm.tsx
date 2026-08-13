import React from 'react'
import { Control } from 'react-hook-form'
import styled from 'styled-components/native'

import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { PasswordInputController } from 'shared/forms/controllers/PasswordInputController'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Key } from 'ui/svg/icons/Key'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type LoginFormProps = {
  errorMessage: string | null
  control: Control<LoginFormData, string>
  onSubmit: () => void
  onForgottenPassword: () => void
  isLoginButtonDisabled: boolean
}
export type LoginFormData = { email: string; password: string }

export const LoginForm = ({
  errorMessage,
  control,
  onSubmit,
  onForgottenPassword,
  isLoginButtonDisabled,
}: LoginFormProps) => (
  <React.Fragment>
    <TitleContainer>
      <Typo.Title3 {...getHeadingAttrs(2)}>Connecte-toi</Typo.Title3>
    </TitleContainer>
    <Form.MaxWidth>
      <InputError
        visible={!!errorMessage}
        errorMessage={errorMessage}
        numberOfSpacesTop={5}
        accessibilityElementsHidden={false}
        centered
      />
      <EmailInputController
        label="Adresse e-mail"
        name="email"
        control={control}
        requiredIndicator="explicit"
      />
      <ButtonContainer>
        <ExternalTouchableLink
          as={Button}
          variant="tertiary"
          color="neutral"
          icon={StyledExternalSiteFilled}
          wording="Identifiants oubliés&nbsp;?"
          externalNav={{
            url: 'https://aide.passculture.app/hc/fr/articles/25838501009308--Jeunes-Tu-as-perdu-tes-identifiants-de-connexion-que-faire',
          }}
        />
      </ButtonContainer>
      <PasswordInputController
        label="Mot de passe"
        name="password"
        control={control}
        autocomplete="current-password"
        onSubmitEditing={onSubmit}
        requiredIndicator="explicit"
      />
      <ButtonContainer>
        <Button
          variant="tertiary"
          color="neutral"
          wording="Mot de passe oublié&nbsp;?"
          onPress={onForgottenPassword}
          icon={Key}
        />
      </ButtonContainer>
      <Button
        fullWidth
        wording="Se connecter"
        onPress={onSubmit}
        disabled={isLoginButtonDisabled}
      />
    </Form.MaxWidth>
  </React.Fragment>
)

const TitleContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const ButtonContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  width: '100%',
  maxWidth: theme.buttons.maxWidth,
  marginTop: theme.designSystem.size.spacing.l,
  marginBottom: theme.designSystem.size.spacing.l,
}))

const StyledExternalSiteFilled = styled(ExternalSiteFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
