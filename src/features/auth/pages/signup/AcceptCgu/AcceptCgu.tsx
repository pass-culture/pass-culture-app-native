import React, { FunctionComponent, useState, useCallback } from 'react'
import styled from 'styled-components/native'

import { useSignupRecaptcha } from 'features/auth/helpers/useSignupRecaptcha'
import { PreValidationSignupLastStepProps } from 'features/auth/types'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { ReCaptcha } from 'libs/recaptcha/ReCaptcha'
import { useIsRecaptchaEnabled } from 'queries/settings/useSettings'
import { hiddenFromScreenReader } from 'shared/accessibility/hiddenFromScreenReader'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { CheckboxGroup } from 'ui/designSystem/CheckboxGroup/CheckboxGroup'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'

const PRIVACY_NOTICE_TEXT =
  'Lors de ton utilisation des services de la société pass Culture, nous sommes amenés à collecter et utiliser tes données personnelles pour assurer le bon fonctionnement de l’application et des services que nous proposons. Pour en savoir plus sur la gestion de tes données et pour exercer tes droits (ex\u00a0: demander l’accès à tes données ou leur suppression), tu peux te reporter à la charte des données personnelles. Tu peux également gérer certaines préférences concernant tes données depuis les paramètres de ton compte, comme par exemple le fait de ne plus souhaiter recevoir notre newsletter.'

export const AcceptCgu: FunctionComponent<PreValidationSignupLastStepProps> = ({
  previousSignupData,
  isSSOSubscription,
  signUp,
}) => {
  const { data: isRecaptchaEnabled, isLoading: areSettingsLoading } = useIsRecaptchaEnabled()
  const networkInfo = useNetInfoContext()

  const [isFetching, setIsFetching] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  const checkboxOptions: { label: string; value: string; required: boolean }[] = []

  if (isSSOSubscription) {
    checkboxOptions.push({
      label:
        'J’accepte de recevoir les newsletters, bons plans et les recommandations personnalisées du pass Culture.',
      value: 'marketingEmailSubscription',
      required: false,
    })
  }

  checkboxOptions.push(
    {
      label: 'J’ai lu et j’accepte les conditions générales d’utilisation',
      value: 'acceptCgu',
      required: true,
    },
    {
      label: 'J’ai lu la charte des données personnelles',
      value: 'acceptDataCharter',
      required: true,
    }
  )

  const isChecked = {
    marketingEmailSubscription: selectedValues.includes('marketingEmailSubscription'),
    acceptCgu: selectedValues.includes('acceptCgu'),
    acceptDataCharter: selectedValues.includes('acceptDataCharter'),
  }

  const handleSignup = useCallback(
    async (token: string, marketingEmailSubscription: boolean) => {
      setErrorMessage(null)
      try {
        const emailSubscription = isSSOSubscription
          ? marketingEmailSubscription
          : (previousSignupData.marketingEmailSubscription ?? false)
        setIsFetching(true)
        await signUp(token, emailSubscription)
      } catch {
        setErrorMessage('Un problème est survenu pendant l’inscription, réessaie plus tard.')
      } finally {
        setIsFetching(false)
      }
    },
    [isSSOSubscription, previousSignupData.marketingEmailSubscription, signUp]
  )

  const {
    isDoingReCaptchaChallenge,
    onReCaptchaClose,
    onReCaptchaError,
    onReCaptchaExpire,
    onReCaptchaSuccess,
    openReCaptchaChallenge,
  } = useSignupRecaptcha({
    handleSignup,
    setErrorMessage,
    isUserConnected: networkInfo.isConnected,
  })

  const onSubmit = useCallback(() => {
    analytics.logContinueCGU()
    if (!isChecked.acceptCgu || !isChecked.acceptDataCharter) {
      setErrorMessage('Tu dois accepter les CGU et la charte des données.')
      return
    }
    if (isRecaptchaEnabled) {
      openReCaptchaChallenge()
    } else {
      handleSignup('dummyToken', isChecked.marketingEmailSubscription)
    }
  }, [
    isChecked.acceptCgu,
    isChecked.acceptDataCharter,
    isChecked.marketingEmailSubscription,
    isRecaptchaEnabled,
    openReCaptchaChallenge,
    handleSignup,
  ])

  const disabled =
    isDoingReCaptchaChallenge ||
    isFetching ||
    !networkInfo.isConnected ||
    areSettingsLoading ||
    !isChecked.acceptCgu ||
    !isChecked.acceptDataCharter

  return (
    <Form.MaxWidth>
      {isRecaptchaEnabled ? (
        <ReCaptcha
          onClose={onReCaptchaClose}
          onError={onReCaptchaError}
          onExpire={onReCaptchaExpire}
          onSuccess={(token) => onReCaptchaSuccess(token, isChecked.marketingEmailSubscription)}
          isVisible={isDoingReCaptchaChallenge}
        />
      ) : null}
      <CheckboxGroup<string>
        label="CGU & Données"
        options={checkboxOptions}
        value={selectedValues}
        onChange={setSelectedValues}
      />
      <LinksContainer>
        <CaptionNeutralInfo>En cochant ces 2 cases tu assures avoir lu&nbsp;:</CaptionNeutralInfo>
        <ExternalTouchableLink
          as={ButtonQuaternaryBlack}
          wording="Nos conditions générales d’utilisation"
          externalNav={{ url: env.CGU_LINK }}
          icon={ExternalSiteFilled}
          justifyContent="flex-start"
          numberOfLines={2}
        />
        <ExternalTouchableLink
          as={ButtonQuaternaryBlack}
          wording="La charte des données personnelles"
          externalNav={{ url: env.PRIVACY_POLICY_LINK }}
          icon={ExternalSiteFilled}
          justifyContent="flex-start"
          numberOfLines={2}
        />
      </LinksContainer>
      <ButtonContainer>
        <Button
          variant="primary"
          fullWidth
          wording="S’inscrire"
          accessibilityLabel="S’inscrire et accepter les conditions générales d’utilisation et la politique de confidentialité"
          // Token needs to be a non-empty string even when ReCaptcha validation is deactivated
          // Cf. backend logic for token validation
          onPress={onSubmit}
          isLoading={isDoingReCaptchaChallenge || isFetching}
          disabled={disabled}
          accessibilityHint={
            errorMessage ? `${errorMessage} - ${PRIVACY_NOTICE_TEXT}` : PRIVACY_NOTICE_TEXT
          }
        />
      </ButtonContainer>
      <InputError visible={!!errorMessage} errorMessage={errorMessage} numberOfSpacesTop={5} />
      <BottomContainer>
        <CaptionNeutralInfo {...hiddenFromScreenReader()}>{PRIVACY_NOTICE_TEXT}</CaptionNeutralInfo>
      </BottomContainer>
    </Form.MaxWidth>
  )
}

const CaptionNeutralInfo = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const BottomContainer = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.xl,
}))

const LinksContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
}))

const ButtonContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xxxl,
}))
