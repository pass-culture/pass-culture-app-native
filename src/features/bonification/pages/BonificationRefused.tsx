import { useRoute } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import { styled } from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { env } from 'libs/environment/env'
import { LinkInsideText } from 'ui/components/buttons/linkInsideText/LinkInsideText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner, BannerLink } from 'ui/designSystem/Banner/Banner'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { ErrorIllustration } from 'ui/svg/icons/ErrorIllustration'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { SadFace } from 'ui/svg/icons/SadFace'
import { AccessibleIcon, AccessibleRectangleIcon } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

export enum BonificationRefusedType {
  CUSTODIAN_NOT_FOUND = 'custodian_not_found',
  NOT_IN_TAX_HOUSEHOLD = 'not_in_tax_household',
  QUOTIENT_FAMILY_TOO_HIGH = 'quotient_family_too_high',
  TOO_MANY_RETRIES = 'too_many_retries',
}

interface PrimaryButtonConfig {
  wording: string
  navigateTo: InternalNavigationProps['navigateTo']
}
interface TertiaryButtonConfig {
  wording?: string
  navigateTo?: InternalNavigationProps['navigateTo']
  externalNav?: ExternalNavigationProps['externalNav']
  Icon?: React.FunctionComponent<AccessibleIcon>
}

interface PageConfigEntry {
  Illustration: React.FC<AccessibleIcon | AccessibleRectangleIcon>
  title: string
  firstText: React.ReactNode
  secondText?: string
  bannerText?: string
  bannerLinks?: BannerLink[]
  primaryButton: PrimaryButtonConfig
  tertiaryButton: TertiaryButtonConfig
}
type PageConfigMap = Record<BonificationRefusedType, PageConfigEntry>

export const PAGE_CONFIG: PageConfigMap = {
  [BonificationRefusedType.CUSTODIAN_NOT_FOUND]: {
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
      navigateTo: getSubscriptionPropConfig('BonificationExplanations'),
    },
    tertiaryButton: {
      wording: 'Annuler',
      navigateTo: navigateToHomeConfig,
      Icon: Invalidate,
    },
  },
  [BonificationRefusedType.NOT_IN_TAX_HOUSEHOLD]: {
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
      navigateTo: getSubscriptionPropConfig('BonificationExplanations'),
    },
    tertiaryButton: {
      wording: 'Annuler',
      navigateTo: navigateToHomeConfig,
      Icon: Invalidate,
    },
  },
  [BonificationRefusedType.QUOTIENT_FAMILY_TOO_HIGH]: {
    Illustration: SadFace,
    title: 'Ton dossier est refusé',
    firstText:
      'Après vérification, tu ne réponds pas aux critères d’éligibilité permettant de bénéficier de ce bonus.',
    secondText:
      'Tu as toujours accès à ton crédit habituel pour découvrir de nouvelles offres culturelles.',
    bannerText: undefined,
    bannerLinks: undefined,
    primaryButton: { wording: 'Revenir au catalogue', navigateTo: navigateToHomeConfig },
    tertiaryButton: {
      wording: 'Accéder à l’annuaire CAF',
      externalNav: { url: env.FAMILY_QUOTIENT_TOO_HIGH_LINK },
      Icon: ExternalSiteFilled,
    },
  },
  [BonificationRefusedType.TOO_MANY_RETRIES]: {
    Illustration: SadFace,
    title: 'Tu as atteint le nombre maximum d’essais',
    firstText: (
      // eslint-disable-next-line local-rules/no-raw-text
      <React.Fragment>
        Après plusieurs tentatives, nous ne pouvons plus traiter ta demande pour ce bonus. Si tu
        souhaites obtenir plus d’informations, tu peux{SPACE}
        <ExternalTouchableLink
          as={LinkInsideText}
          typography="BodyAccent"
          wording="contacter notre support"
          externalNav={{ url: env.SUPPORT_ACCOUNT_ISSUES_FORM }}
          accessibilityRole={AccessibilityRole.LINK}
        />
        .
      </React.Fragment>
    ),
    secondText: undefined,
    bannerText: undefined,
    bannerLinks: undefined,
    primaryButton: { wording: 'Retour à l’acceuil', navigateTo: navigateToHomeConfig },
    tertiaryButton: {
      wording: undefined,
      navigateTo: undefined,
      Icon: undefined,
    },
  },
}

export function BonificationRefused() {
  const { params } = useRoute<UseRouteType<'BonificationRefused'>>()
  const bonificationRefusedType =
    params?.bonificationRefusedType ?? BonificationRefusedType.CUSTODIAN_NOT_FOUND // fallback if param is undefined (which should never happen) but is necessary in SubscriptionStackTypes.ts to put BonificationRefused?: { ... } to satify typing of components using navigateTo

  const pageConfig = PAGE_CONFIG[bonificationRefusedType] // refused code will come from back
  const { Icon, wording, navigateTo, externalNav } = pageConfig.tertiaryButton
  return (
    <GenericInfoPage
      illustration={pageConfig.Illustration}
      title={pageConfig.title}
      buttonPrimary={{
        wording: pageConfig.primaryButton.wording,
        navigateTo: pageConfig.primaryButton.navigateTo,
      }}
      buttonTertiary={
        Icon && wording && navigateTo
          ? {
              icon: Icon,
              wording: wording,
              navigateTo: navigateTo,
            }
          : Icon && wording && externalNav
            ? {
                icon: Icon,
                wording: wording,
                externalNav: externalNav,
              }
            : undefined
      }>
      <ViewGap gap={5}>
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

const CenteredBody = styled(Typo.Body)({
  textAlign: 'center',
})
