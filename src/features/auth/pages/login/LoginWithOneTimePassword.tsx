import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { OtpStatusBanner } from 'features/auth/components/OtpStatusBanner'
import { RemainingCodeAttempts } from 'features/auth/components/RemainingCodeAttenpts'
import { useOneTimePassword } from 'features/auth/helpers/useOneTimePassword'
import { useOneTimePasswordAttempts } from 'features/auth/helpers/useOneTimePasswordAttempts'
import { useResendEmail } from 'features/auth/helpers/useResendEmail'
import { useNavigateToHomeWithReset } from 'features/navigation/helpers/useNavigateToHomeWithReset'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { Form } from 'ui/components/Form'
import { OneTimePasswordInput } from 'ui/components/inputs/OneTimePasswordInput/OneTimePasswordInput'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

const OTP_LENGTH = 6
const TEMPORARY_VALID_OTP_CODE = '123456'

export const LoginWithOneTimePassword = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { navigateToHomeWithReset } = useNavigateToHomeWithReset()

  const [isCodeExpired, setIsCodeExpired] = useState(false)

  const { code, isCodeComplete, handleCodeChange } = useOneTimePassword({
    numberOfInputs: OTP_LENGTH,
  })

  const {
    failedAttempts,
    codeError,
    remainingSeconds,
    registerFailedAttempt,
    clearCodeError,
    hasReachedMaxCodeAttempts,
    isLastAttempt,
    maxCodeAttempts,
    loginEmail,
  } = useOneTimePasswordAttempts()

  const {
    resendCountdown,
    isCooldownActive,
    isDisabled: isResendDisabled,
    handleResendEmail,
  } = useResendEmail()

  const handleCodeChangeWithErrorReset = (nextCode: string[]) => {
    if (hasReachedMaxCodeAttempts) return

    handleCodeChange(nextCode)
    clearCodeError()
    setIsCodeExpired(false)
  }

  const handleContinue = async () => {
    if (!isCodeComplete || hasReachedMaxCodeAttempts) return

    if (code.join('') === TEMPORARY_VALID_OTP_CODE) {
      navigateToHomeWithReset()
      return
    }

    const hasJustReachedLimit = await registerFailedAttempt()
    if (hasJustReachedLimit) navigate('OneTimePasswordLimit')
  }

  const handleResendEmailWithBannerReset = async () => {
    await handleResendEmail()
    setIsCodeExpired(false)
  }

  const oneTimePasswordInputLabel = loginEmail
    ? `Saisis le code de vérification que tu as reçu à l’adresse ${loginEmail}`
    : 'Saisis le code de vérification que tu as reçu à ton adresse e-mail'

  return (
    <PageWithHeader
      shouldLimitWidth
      title="Connexion"
      scrollChildren={
        <React.Fragment>
          <TitleContainer>
            <Typo.Title3 {...setTextSemantic('h2')}>Consulte ta boîte mail</Typo.Title3>
          </TitleContainer>
          <Form.MaxWidth>
            <OneTimePasswordInput
              label={oneTimePasswordInputLabel}
              code={code}
              onCodeChange={handleCodeChangeWithErrorReset}
              numberOfInputs={OTP_LENGTH}
              errorMessage={codeError}
              disabled={hasReachedMaxCodeAttempts}
            />
            <OtpStatusBanner
              isAccountLocked={hasReachedMaxCodeAttempts}
              isCodeExpired={isCodeExpired}
              isNewCodeSent={isCooldownActive}
              isLastAttempt={isLastAttempt}
              email={loginEmail}
              remainingSeconds={remainingSeconds}
              resendCountdown={resendCountdown}
            />
            <ButtonContainer gap={4}>
              <RemainingCodeAttempts
                failedAttempts={failedAttempts}
                maxAttempts={maxCodeAttempts}
                isAccountLocked={hasReachedMaxCodeAttempts}
              />
              <Button
                variant="primary"
                color="brand"
                wording="Continuer"
                disabled={!isCodeComplete || hasReachedMaxCodeAttempts}
                onPress={handleContinue}
              />
              <Button
                variant="tertiary"
                color="neutral"
                wording="Renvoyer l’email"
                disabled={isResendDisabled || hasReachedMaxCodeAttempts}
                onPress={handleResendEmailWithBannerReset}
              />
            </ButtonContainer>
          </Form.MaxWidth>
        </React.Fragment>
      }
    />
  )
}

const TitleContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const ButtonContainer = styled(ViewGap)(({ theme }) => ({
  width: '100%',
  maxWidth: theme.buttons.maxWidth,
  marginTop: theme.designSystem.size.spacing.l,
  marginBottom: theme.designSystem.size.spacing.l,
}))
