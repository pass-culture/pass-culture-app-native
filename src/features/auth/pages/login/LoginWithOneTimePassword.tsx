import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

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

const RESEND_COUNTDOWN = 2 * 60
const MAX_RESEND_ATTEMPTS = 5
const MAX_ATTEMPTS_COUNTDOWN = 60 * 60

const RESEND_COOLDOWN_KEY = 'login-one-time-password-resend-cooldown'
const RESEND_ATTEMPTS_KEY = 'login-one-time-password-resend-attempts'

export const LoginWithOneTimePassword = () => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
  const [resendCountdown, setResendCountdown] = useState(0)
  const [resendAttempts, setResendAttempts] = useState(0)
  const [resendCooldownEnd, setResendCooldownEnd] = useState<number | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const { navigateToHomeWithReset } = useNavigateToHomeWithReset()

  const onChange = (nextCode: string[]) => setCode(nextCode)

  const handleContinue = () => {
    if (isCodeComplete) navigateToHomeWithReset()
  }

  const initializeResendState = () => {
    async function loadResendState() {
      const [storedCooldown, storedAttempts] = await Promise.all([
        AsyncStorage.getItem(RESEND_COOLDOWN_KEY),
        AsyncStorage.getItem(RESEND_ATTEMPTS_KEY),
      ])

      const cooldownEnd = storedCooldown ? Number(storedCooldown) : null
      const attempts = storedAttempts ? Number(storedAttempts) : 0

      if (cooldownEnd) {
        const remainingSeconds = Math.max(Math.ceil((cooldownEnd - Date.now()) / 1000), 0)

        if (remainingSeconds > 0) {
          setResendCooldownEnd(cooldownEnd)
          setResendCountdown(remainingSeconds)

          if (attempts <= MAX_RESEND_ATTEMPTS) {
            setResendAttempts(attempts)
          }
        } else {
          await AsyncStorage.removeItem(RESEND_COOLDOWN_KEY)

          if (attempts >= MAX_RESEND_ATTEMPTS) {
            await AsyncStorage.removeItem(RESEND_ATTEMPTS_KEY)
            setResendAttempts(0)
          } else {
            setResendAttempts(attempts)
            await AsyncStorage.removeItem(RESEND_COOLDOWN_KEY)
          }
        }
      } else if (attempts < MAX_RESEND_ATTEMPTS) {
        setResendAttempts(attempts)
      }

      setIsInitialized(true)
    }

    void loadResendState()
  }

  useEffect(initializeResendState, [])

  const startResendCountdown = () => {
    if (!resendCooldownEnd) return

    const updateCountdown = () => {
      const remainingSeconds = Math.max(Math.ceil((resendCooldownEnd - Date.now()) / 1000), 0)

      setResendCountdown(remainingSeconds)

      if (remainingSeconds === 0) {
        setResendCooldownEnd(null)

        if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
          setResendAttempts(0)
          void AsyncStorage.removeItem(RESEND_ATTEMPTS_KEY)
          void AsyncStorage.removeItem(RESEND_COOLDOWN_KEY)
        }
      }
    }

    updateCountdown()

    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }

  useEffect(startResendCountdown, [resendCooldownEnd, resendAttempts])

  const handleResendEmail = async () => {
    if (resendCountdown > 0 || resendAttempts >= MAX_RESEND_ATTEMPTS) {
      return
    }

    const nextAttempts = resendAttempts + 1
    const isLastAttempt = nextAttempts === MAX_RESEND_ATTEMPTS

    const cooldownDuration = isLastAttempt ? MAX_ATTEMPTS_COUNTDOWN : RESEND_COUNTDOWN

    const cooldownEnd = Date.now() + cooldownDuration * 1000

    await Promise.all([
      AsyncStorage.setItem(RESEND_COOLDOWN_KEY, String(cooldownEnd)),
      AsyncStorage.setItem(RESEND_ATTEMPTS_KEY, String(nextAttempts)),
    ])

    setResendAttempts(nextAttempts)
    setResendCooldownEnd(cooldownEnd)
    setResendCountdown(cooldownDuration)
  }

  const isCooldownActive = resendCountdown > 0
  const hasReachedMaxAttempts = resendAttempts >= MAX_RESEND_ATTEMPTS
  const isDisabled = isCooldownActive || hasReachedMaxAttempts

  const isCodeComplete = code.length === 6 && code.every((value) => /^\d$/.test(value))

  const remainingAttempts = MAX_RESEND_ATTEMPTS - resendAttempts

  const numberOfAttempts = plural(remainingAttempts, {
    singular: '# tentative',
    plural: '# tentatives',
  })

  const countdownMinutes = Math.ceil(resendCountdown / 60)

  const countdownText =
    resendCountdown >= 60
      ? plural(countdownMinutes, {
          singular: '# minute',
          plural: '# minutes',
        })
      : plural(resendCountdown, {
          singular: '# seconde',
          plural: '# secondes',
        })

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
                {hasReachedMaxAttempts
                  ? `Tu as effectué trop de demandes. Tu pourras effectuer une nouvelle demande dans${SPACE}`
                  : `Tu pourras effectuer une nouvelle demande dans${SPACE}`}
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
                {hasReachedMaxAttempts
                  ? 'Tu as effectué trop de demandes.'
                  : `Attention, il te reste${SPACE}`}
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
