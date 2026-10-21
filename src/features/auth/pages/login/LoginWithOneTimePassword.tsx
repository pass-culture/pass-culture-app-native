import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { OtpStatusBanner } from 'features/auth/components/OtpBannerStatus'
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

export const MAX_CODE_ATTEMPTS = 5
const OTP_LENGTH = 6
const TEMPORARY_VALID_OTP_CODE = '123456'

type LoginWithOneTimePasswordProps = { email?: string }

export const LoginWithOneTimePassword = ({ email }: LoginWithOneTimePasswordProps) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { navigateToHomeWithReset } = useNavigateToHomeWithReset()

  const [isCodeExpired, setIsCodeExpired] = useState(false)

  const computedEmail = email ?? ''

  const { code, isCodeComplete, handleCodeChange } = useOneTimePassword({
    numberOfInputs: OTP_LENGTH,
  })

  const {
    failedAttempts,
    codeError,
    hasReachedMaxCodeAttempts,
    remainingSeconds,
    isInitialized: areCodeAttemptsInitialized,
    registerFailedAttempt,
    clearCodeError,
  } = useOneTimePasswordAttempts(MAX_CODE_ATTEMPTS)

  const {
    resendCountdown,
    isInitialized: isResendInitialized,
    isCooldownActive,
    isDisabled: isResendDisabled,
    handleResendEmail,
  } = useResendEmail()

  const isAccountLocked = hasReachedMaxCodeAttempts
  const isLastAttempt = failedAttempts === MAX_CODE_ATTEMPTS - 1

  const handleCodeChangeWithErrorReset = (nextCode: string[]) => {
    if (isAccountLocked) return

    handleCodeChange(nextCode)
    clearCodeError()
    setIsCodeExpired(false)
  }

  const handleContinue = async () => {
    if (!isCodeComplete || !areCodeAttemptsInitialized || isAccountLocked) return

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

  if (!areCodeAttemptsInitialized || !isResendInitialized) return null

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
              label={`Saisis le code de vérification que tu as reçu à l’adresse ${computedEmail}`}
              code={code}
              onCodeChange={handleCodeChangeWithErrorReset}
              numberOfInputs={OTP_LENGTH}
              errorMessage={codeError}
              disabled={isAccountLocked}
            />
          </Form.MaxWidth>
          <OtpStatusBanner
            isAccountLocked={isAccountLocked}
            isCodeExpired={isCodeExpired}
            isCooldownActive={isCooldownActive}
            isLastAttempt={isLastAttempt}
            email={computedEmail}
            remainingSeconds={remainingSeconds}
            resendCountdown={resendCountdown}
          />
        </React.Fragment>
      }
      fixedBottomChildren={
        <ViewGap gap={4}>
          <RemainingCodeAttempts
            failedAttempts={failedAttempts}
            maxAttempts={MAX_CODE_ATTEMPTS}
            isAccountLocked={isAccountLocked}
          />
          <Button
            variant="primary"
            color="brand"
            wording="Continuer"
            disabled={!isCodeComplete || isAccountLocked}
            onPress={handleContinue}
          />
          <Button
            variant="tertiary"
            color="neutral"
            wording="Renvoyer l’email"
            disabled={isResendDisabled || isAccountLocked}
            onPress={handleResendEmailWithBannerReset}
          />
        </ViewGap>
      }
    />
  )
}

const TitleContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))
