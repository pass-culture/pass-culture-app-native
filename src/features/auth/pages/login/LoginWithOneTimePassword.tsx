import React, { useState } from 'react'
import styled from 'styled-components/native'

import { MAX_RESEND_ATTEMPTS, ONE_MINUTE } from 'features/auth/helpers/resendEmail'
import { useResendEmail } from 'features/auth/helpers/useResendEmail'
import { useNavigateToHomeWithReset } from 'features/navigation/helpers/useNavigateToHomeWithReset'
import { plural } from 'libs/plural'
import { Form } from 'ui/components/Form'
import { OneTimePasswordInput } from 'ui/components/inputs/OneTimePasswordInput/OneTimePasswordInput'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Button } from 'ui/designSystem/Button/Button'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

export const LoginWithOneTimePassword = () => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])

  const { navigateToHomeWithReset } = useNavigateToHomeWithReset()

  const {
    resendCountdown,
    resendAttempts,
    isInitialized,
    isCooldownActive,
    hasReachedMaxAttempts,
    isDisabled,
    handleResendEmail,
  } = useResendEmail()

  const onChange = (nextCode: string[]) => setCode(nextCode)

  const isCodeComplete = code.length === 6 && code.every((value) => /^\d$/.test(value))

  const handleContinue = () => {
    if (isCodeComplete) navigateToHomeWithReset()
  }

  const remainingAttempts = MAX_RESEND_ATTEMPTS - resendAttempts

  const numberOfAttempts = plural(remainingAttempts, {
    singular: '# tentative',
    plural: '# tentatives',
  })

  const defaultReachedMaxAttemptTexte = 'Tu as effectué trop de demandes.'
  const reachedMaxAttempt = hasReachedMaxAttempts
    ? {
        subBannerText: `${defaultReachedMaxAttemptTexte}${SPACE}Tu pourras effectuer une nouvelle demande dans${SPACE}`,
        surButtonText: defaultReachedMaxAttemptTexte,
      }
    : {
        subBannerText: `Tu pourras effectuer une nouvelle demande dans${SPACE}`,
        surButtonText: `Attention, il te reste${SPACE}`,
      }

  const countdownMinutes = Math.ceil(resendCountdown / ONE_MINUTE)

  const countdownText =
    resendCountdown >= ONE_MINUTE
      ? plural(countdownMinutes, { singular: '# minute', plural: '# minutes' })
      : plural(resendCountdown, { singular: '# seconde', plural: '# secondes' })

  if (!isInitialized) return null

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
              label="Saisis le code de vérification que tu as reçu à l’adresse adresse@mail.com"
              code={code}
              onCodeChange={onChange}
              disabled={isDisabled}
            />
          </Form.MaxWidth>
          {isCooldownActive ? (
            <BannerContainer gap={4}>
              <Banner label="Un nouveau code t’a été envoyé." />
              <Typo.BodyXs>
                {reachedMaxAttempt.subBannerText}
                <Typo.BodyAccentXs>{countdownText}</Typo.BodyAccentXs>
              </Typo.BodyXs>
            </BannerContainer>
          ) : null}
        </React.Fragment>
      }
      fixedBottomChildren={
        <ViewGap gap={4}>
          {resendAttempts > 0 ? (
            <TextContainer>
              <Typo.BodyXs>
                {reachedMaxAttempt.surButtonText}
                {hasReachedMaxAttempts ? null : (
                  <Typo.BodyAccentXs>{numberOfAttempts}</Typo.BodyAccentXs>
                )}
              </Typo.BodyXs>
            </TextContainer>
          ) : null}
          <Button
            variant="primary"
            color="brand"
            wording="Continuer"
            disabled={isDisabled || !isCodeComplete}
            onPress={handleContinue}
          />
          <Button
            variant="tertiary"
            color="neutral"
            wording="Renvoyer l’email"
            disabled={isDisabled}
            onPress={handleResendEmail}
          />
        </ViewGap>
      }
    />
  )
}

const TitleContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const TextContainer = styled.View({
  alignItems: 'center',
})

const BannerContainer = styled(ViewGap)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
