import { yupResolver } from '@hookform/resolvers/yup'
import React, { FunctionComponent, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { useSignupRecaptcha } from 'features/auth/helpers/useSignupRecaptcha'
import { acceptCGUSchema } from 'features/auth/pages/signup/AcceptCgu/acceptCguSchema'
import { PreValidationSignupLastStepProps } from 'features/auth/types'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { ReCaptcha } from 'libs/recaptcha/ReCaptcha'
import { CheckboxController } from 'shared/forms/controllers/CheckboxController'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValues = {
  acceptCgu: boolean
  acceptDataCharter: boolean
  marketingEmailSubscription: boolean
}

export const AcceptCgu: FunctionComponent<PreValidationSignupLastStepProps> = ({
  previousSignupData,
  isSSOSubscription,
  signUp,
}) => {
  const { data: settings, isLoading: areSettingsLoading } = useSettingsContext()
  const networkInfo = useNetInfoContext()
  const checkCGUErrorId = uuidv4()

  const [isFetching, setIsFetching] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValues>({
    defaultValues: {
      acceptCgu: false,
      acceptDataCharter: false,
      marketingEmailSubscription: false,
    },
    resolver: yupResolver(acceptCGUSchema),
    mode: 'onChange',
  })

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

  const onSubmit = useCallback(
    ({ marketingEmailSubscription }: FormValues) => {
      analytics.logContinueCGU()
      if (settings?.isRecaptchaEnabled) {
        openReCaptchaChallenge()
      } else {
        handleSignup('dummyToken', marketingEmailSubscription)
      }
    },
    [settings?.isRecaptchaEnabled, openReCaptchaChallenge, handleSignup]
  )

  const disabled =
    isDoingReCaptchaChallenge ||
    isFetching ||
    !networkInfo.isConnected ||
    areSettingsLoading ||
    !isValid

  // ReCaptcha needs previous callbacks
  return (
    <Form.MaxWidth>
      {settings?.isRecaptchaEnabled ? (
        <ReCaptcha
          onClose={onReCaptchaClose}
          onError={onReCaptchaError}
          onExpire={onReCaptchaExpire}
          onSuccess={(token) => {
            handleSubmit(({ marketingEmailSubscription }) =>
              onReCaptchaSuccess(token, marketingEmailSubscription)
            )()
          }}
          isVisible={isDoingReCaptchaChallenge}
        />
      ) : null}
      <Typo.Title3 {...getHeadingAttrs(2)}>CGU & Données</Typo.Title3>
      <Spacer.Column numberOfSpaces={10} />
      {isSSOSubscription ? (
        <React.Fragment>
          <CheckboxController
            control={control}
            label="J’accepte de recevoir les newsletters, bons plans et les recommandations personnalisées du pass Culture."
            name="marketingEmailSubscription"
          />
          <Spacer.Column numberOfSpaces={6} />
          <Separator.Horizontal />
          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      ) : null}
      <CheckboxController
        control={control}
        label="J’ai lu et j’accepte les conditions générales d’utilisation"
        name="acceptCgu"
        required
      />
      <Spacer.Column numberOfSpaces={6} />
      <CheckboxController
        control={control}
        label="J’ai lu la charte des données personnelles"
        name="acceptDataCharter"
        required
      />
      <Spacer.Column numberOfSpaces={6} />
      <CaptionNeutralInfo>
        <CaptionNeutralInfo accessibilityHidden>
          *obligatoires pour créer ton compte.{SPACE}
        </CaptionNeutralInfo>
        En cochant ces 2 cases tu assures avoir lu&nbsp;:
      </CaptionNeutralInfo>
      <Spacer.Column numberOfSpaces={2} />
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
      <Spacer.Column numberOfSpaces={10} />
      <ButtonPrimary
        wording="S’inscrire"
        accessibilityLabel="Accepter les conditions générales d’utilisation et la politique de confidentialité pour s’inscrire"
        // Token needs to be a non-empty string even when ReCaptcha validation is deactivated
        // Cf. backend logic for token validation
        onPress={handleSubmit(onSubmit)}
        isLoading={isDoingReCaptchaChallenge || isFetching}
        disabled={disabled}
        accessibilityDescribedBy={checkCGUErrorId}
      />
      <InputError
        visible={!!errorMessage}
        errorMessage={errorMessage}
        numberOfSpacesTop={5}
        relatedInputId={checkCGUErrorId}
      />
      <Spacer.Column numberOfSpaces={4} />
      <CaptionNeutralInfo>
        Lors de ton utilisation des services de la société pass Culture, nous sommes amenés à
        collecter et utiliser tes données personnelles pour assurer le bon fonctionnement de
        l’application et des services que nous proposons. Pour en savoir plus sur la gestion de tes
        données et pour exercer tes droits (ex&nbsp;: demander l’accès à tes données ou leur
        suppression), tu peux te reporter à la charte des données personnelles. Tu peux également
        gérer certaines préférences concernant tes données depuis les paramètres de ton compte,
        comme par exemple le fait de ne plus souhaiter recevoir notre newsletter.
      </CaptionNeutralInfo>
      <Spacer.Column numberOfSpaces={5} />
    </Form.MaxWidth>
  )
}

const CaptionNeutralInfo = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
