import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import { styled } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { BonificationType } from 'features/bonification/enums'
import { getBonificationTertiaryButtonProps } from 'features/bonification/pages/getBonificationTertiaryButtonProps'
import {
  PageConfigEntry,
  PageConfigMap,
} from 'features/bonification/types/BonificationFamilyQuotientRefusedType'
import { BonificationQFRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionPropConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { env } from 'libs/environment/env'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { plural } from 'libs/plural'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Link } from 'ui/designSystem/Link/Link'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { ErrorIllustration } from 'ui/svg/icons/ErrorIllustration'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { SadFace } from 'ui/svg/icons/SadFace'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

const notFoundPageConfig: PageConfigEntry = {
  Illustration: ErrorIllustration,
  title: 'Ton dossier est refusé',
  firstText:
    'Nous avons bien reçu ton dossier, mais nous ne trouvons pas ton parent ou représentant légal.',
  secondText: undefined,
  bannerText:
    'Cela peut venir d’une erreur de saisie. Vérifie que les informations correspondent bien à celles des papiers officiels avant de réessayer.',
  bannerLinks: undefined,
  primaryButton: {
    wording: 'Renouveler ma demande',
    navigateTo: getSubscriptionPropConfig('BonificationRequiredInformation', {
      bonificationType: BonificationType.FAMILY_QUOTIENT,
    }),
  },
  tertiaryButton: {
    button: {
      wording: 'Fermer',
      navigation: { type: 'goBack' },
      icon: Invalidate,
    },
  },
}

const notInTaxHouseholdConfig: PageConfigEntry = {
  Illustration: ErrorIllustration,
  title: 'Ton dossier est refusé',
  firstText:
    'Nous avons bien reçu ton dossier, mais tu n’es pas associé au dossier CAF de ce parent ou représentant légal.',
  secondText: undefined,
  bannerText:
    'Essaie avec ton autre parent ou responsable légal, ou contacte-nous si tu as un doute.',
  bannerLinks: [
    {
      onPress: () => openUrl(env.SUPPORT_ACCOUNT_ISSUES_FORM),
      wording: 'Contacter notre support',
      icon: PlainArrowNext,
    },
  ],
  primaryButton: {
    wording: 'Renouveler ma demande',
    navigateTo: getSubscriptionPropConfig('BonificationRequiredInformation', {
      bonificationType: BonificationType.FAMILY_QUOTIENT,
    }),
  },
  tertiaryButton: {
    button: {
      wording: 'Fermer',
      navigation: { type: 'goBack' },
      icon: Invalidate,
    },
  },
}

const quotientFamilyTooHighConfig: PageConfigEntry = {
  Illustration: SadFace,
  title: 'Ton dossier est refusé',
  firstText:
    'Après vérification, tu ne réponds pas aux critères d’éligibilité permettant de bénéficier de ce bonus.',
  secondText:
    'Tu as toujours accès à ton crédit habituel pour découvrir de nouvelles offres culturelles.',
  bannerText: undefined,
  bannerLinks: undefined,
  primaryButton: {
    wording: 'Revenir au catalogue',
    navigateTo: navigateToHomeConfig,
  },
  tertiaryButton: {
    button: {
      wording: 'Accéder à l’annuaire CAF',
      navigation: {
        type: 'externalNav',
        externalNav: { url: env.FAMILY_QUOTIENT_TOO_HIGH_LINK },
      },
      icon: ExternalSiteFilled,
    },
  },
}

const tooManyRetryConfig: PageConfigEntry = {
  Illustration: SadFace,
  title: 'Tu as atteint le nombre maximum d’essais',
  firstText: (
    <Typo.Body>
      Après plusieurs tentatives, nous ne pouvons plus traiter ta demande pour ce bonus. Si tu
      souhaites obtenir plus d’informations, tu peux{SPACE}
      <ExternalTouchableLink
        as={Link}
        isInsideText
        wording="contacter notre support"
        externalNav={{ url: env.SUPPORT_ACCOUNT_ISSUES_FORM }}
        accessibilityRole={AccessibilityRole.LINK}
      />
      .
    </Typo.Body>
  ),
  secondText: undefined,
  bannerText: undefined,
  bannerLinks: undefined,
  primaryButton: { wording: 'Retour à l’accueil', navigateTo: navigateToHomeConfig },
  tertiaryButton: {},
}

export const PAGE_CONFIG: PageConfigMap = {
  [BonificationQFRefusedType.APPLICATION_NOT_FOUND]: notFoundPageConfig,
  [BonificationQFRefusedType.CUSTODIAN_NOT_FOUND]: notFoundPageConfig,
  [BonificationQFRefusedType.KO]: notFoundPageConfig,
  [BonificationQFRefusedType.NOT_IN_TAX_HOUSEHOLD]: notInTaxHouseholdConfig,
  [BonificationQFRefusedType.QUOTIENT_FAMILY_TOO_HIGH]: quotientFamilyTooHighConfig,
  [BonificationQFRefusedType.TOO_MANY_RETRIES]: tooManyRetryConfig,
}

export const BonificationFamilyQuotientRefused = () => {
  const { goBack } = useNavigation<UseNavigationType>()
  const disableQFBonificationManualRequest = useFeatureFlag(
    RemoteStoreFeatureFlags.DISABLE_QF_BONIFICATION_MANUAL_REQUEST
  )
  const { params } = useRoute<UseRouteType<'BonificationFamilyQuotientRefused'>>()
  const { user } = useAuthContext()

  const remainingBonusAttempts = user?.remainingBonusAttempts

  // Fallback if param is undefined (which should never happen) but is necessary in SubscriptionStackTypes.ts to put BonificationFamilyQuotientRefused?: { ... } to satify typing of components using navigateTo
  const bonificationRefuseTypeFallback = BonificationQFRefusedType.CUSTODIAN_NOT_FOUND
  const bonificationRefusedType = params?.bonificationRefusedType ?? bonificationRefuseTypeFallback

  const RETRY_REFUSED_TYPES = [
    BonificationQFRefusedType.APPLICATION_NOT_FOUND,
    BonificationQFRefusedType.CUSTODIAN_NOT_FOUND,
    BonificationQFRefusedType.KO,
    BonificationQFRefusedType.NOT_IN_TAX_HOUSEHOLD,
  ]

  const showNumberOfRemainingRetries =
    RETRY_REFUSED_TYPES.includes(bonificationRefusedType) &&
    remainingBonusAttempts &&
    remainingBonusAttempts <= 5

  const lastRemainingRetry = remainingBonusAttempts == 1

  const buttonsSurtitle = showNumberOfRemainingRetries ? (
    <StyledBodyXs>
      Attention, il te reste&nbsp;:{SPACE}
      <StyledBodyXsDark lastRemainingRetry={lastRemainingRetry} {...setTextSemantic('span')}>
        {remainingBonusAttempts}
        {remainingBonusAttempts
          ? plural(remainingBonusAttempts, { plural: ' demandes', singular: ' demande' })
          : undefined}
      </StyledBodyXsDark>
    </StyledBodyXs>
  ) : disableQFBonificationManualRequest ? (
    <StyledBodyXs>La demande de bonus est temporairement indisponible</StyledBodyXs>
  ) : undefined

  const pageConfig = PAGE_CONFIG[bonificationRefusedType]
  const { button: tertiaryButton } = pageConfig.tertiaryButton

  return (
    <GenericInfoPage
      illustration={pageConfig.Illustration}
      title={pageConfig.title}
      buttonsSurtitle={buttonsSurtitle}
      buttonPrimary={{
        wording: pageConfig.primaryButton.wording,
        navigateTo: pageConfig.primaryButton.navigateTo,
        disabled: disableQFBonificationManualRequest,
      }}
      buttonTertiary={
        tertiaryButton
          ? getBonificationTertiaryButtonProps({ button: tertiaryButton, onGoBack: goBack })
          : undefined
      }>
      <ViewGap gap={4}>
        <CenteredBody>{pageConfig.firstText}</CenteredBody>
        <View>
          <CenteredBody>{pageConfig.secondText}</CenteredBody>
          {pageConfig.bannerText ? (
            <Banner label={pageConfig.bannerText} links={pageConfig.bannerLinks} />
          ) : null}
        </View>
      </ViewGap>
    </GenericInfoPage>
  )
}
type StyledBodyXsProps = {
  lastRemainingRetry?: boolean
}

const CenteredBody = styled(Typo.Body)({
  textAlign: 'center',
})

const StyledBodyXs = styled(Typo.BodyXs)(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.disabled,
}))

const StyledBodyXsDark = styled(Typo.BodyXs)<StyledBodyXsProps>(
  ({ theme, lastRemainingRetry }) => ({
    textAlign: 'center',
    color: lastRemainingRetry
      ? theme.designSystem.color.text.error
      : theme.designSystem.color.text.disabled,
  })
)
