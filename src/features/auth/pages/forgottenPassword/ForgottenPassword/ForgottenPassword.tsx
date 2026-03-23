import React from 'react'
import styled from 'styled-components/native'

import { useForgottenPasswordForm } from 'features/auth/helpers/useForgottenPasswordForm'
import { ReCaptcha } from 'libs/recaptcha/ReCaptcha'
import { useIsRecaptchaEnabled } from 'queries/settings/useSettings'
import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { Form } from 'ui/components/Form'
import { Button } from 'ui/designSystem/Button/Button'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const ForgottenPassword = () => {
  const { data: isRecaptchaEnabled, isLoading: areSettingsLoading } = useIsRecaptchaEnabled()

  const {
    control,
    isDoingReCaptchaChallenge,
    isFetching,
    onReCaptchaClose,
    onReCaptchaError,
    onReCaptchaExpire,
    onReCaptchaSuccess,
    openReCaptchaChallenge,
    requestPasswordReset,
    shouldDisableValidateButton,
  } = useForgottenPasswordForm(!!isRecaptchaEnabled)

  return (
    <PageWithHeader
      title="Oubli de mot de passe"
      shouldDisplayBackButton
      scrollChildren={
        <React.Fragment>
          {isRecaptchaEnabled ? (
            <ReCaptcha
              onClose={onReCaptchaClose}
              onError={onReCaptchaError}
              onExpire={onReCaptchaExpire}
              onSuccess={onReCaptchaSuccess}
              isVisible={isDoingReCaptchaChallenge}
            />
          ) : null}
          <Typo.Title3 {...getHeadingAttrs(2)}>Mot de passe oublié&nbsp;?</Typo.Title3>
          <Container>
            <Typo.Body>
              Saisis ton adresse e-mail pour recevoir un lien qui te permettra de réinitialiser ton
              mot de passe&nbsp;!
            </Typo.Body>
          </Container>
          <Form.MaxWidth>
            <EmailInputController label="Adresse e-mail" control={control} name="email" />
            <ButtonContainer>
              <Button
                wording="Valider"
                onPress={isRecaptchaEnabled ? openReCaptchaChallenge : requestPasswordReset}
                isLoading={isDoingReCaptchaChallenge || isFetching || areSettingsLoading}
                disabled={shouldDisableValidateButton}
              />
            </ButtonContainer>
          </Form.MaxWidth>
        </React.Fragment>
      }
    />
  )
}

const ButtonContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xxl,
}))

const Container = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.s,
  marginBottom: theme.designSystem.size.spacing.xxl,
}))
