import React from 'react'
import { styled } from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { ErrorIllustration } from 'ui/svg/icons/ErrorIllustration'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { SadFace } from 'ui/svg/icons/SadFace'
import { Typo } from 'ui/theme'

enum BonificationRefusedType {
  PARENT_NOT_FOUND = 'parent_not_found',
  CHILD_NOT_FOUND = 'child_not_found',
  FAMILY_QUOTIENT_TOO_HIGH = 'family_quotient_too_high',
  TOO_MANY_RETRIES = 'too_many_retries',
}

const PAGE_CONFIG = {
  [BonificationRefusedType.PARENT_NOT_FOUND]: {
    Illustration: ErrorIllustration,
    title: 'Ton dossier n’a pas pu être validé',
    firstText: 'Nous avons bien reçu ton dossier, mais on ne trouve pas ton parent.',
    secondText:
      'Il semble que nous n’ayons pas trouvé de parent lié à ton dossier. Pas de panique, c’est peut-être juste une petite erreur de saisie',
    bannerText:
      'Vérifie que tu as bien rempli les informations demandées sont écrites correctement comme sur les papiers officiels avant de réessayer.',
    primaryButton: { wording: 'Corriger les informations', navigateTo: navigateToHomeConfig },
    tertiaryButton: {
      wording: 'Annuler',
      navigateTo: navigateToHomeConfig,
      Icon: Invalidate,
    },
  },
  [BonificationRefusedType.CHILD_NOT_FOUND]: {
    Illustration: ErrorIllustration,
    title: 'Ton dossier n’a pas pu être validé',
    firstText:
      'Nous avons bien reçu ton dossier, mais il semblerait que tu ne sois pas associé à ce parent.',
    secondText:
      'D’après nos informations, ton parent n’a pas encore ajouté d’enfant à son dossier. C’est peut-être un oubli\u00a0?',
    bannerText: 'Vérifie que ton parent t’a bien déclaré dans son espace personnel.',
    primaryButton: { wording: 'Renouveler ma demande', navigateTo: navigateToHomeConfig },
    tertiaryButton: {
      wording: 'Annuler',
      navigateTo: navigateToHomeConfig,
      Icon: Invalidate,
    },
  },
  [BonificationRefusedType.FAMILY_QUOTIENT_TOO_HIGH]: {
    Illustration: SadFace,
    title: 'Ton dossier n’a pas pu être validé',
    firstText: 'Nous avons bien reçu ton dossier, mais il n’a pas été validé.',
    secondText:
      'Après vérification, tu ne fais malheureusement pas partie des jeunes pouvant bénéficier de ce bonus.',
    thirdText:
      'Mais pas d’inquiétude\u00a0! Tu peux toujours profiter de ton crédit habituel et découvrir plein d’offres culturelles.',
    bannerText: undefined,
    primaryButton: { wording: 'Revenir vers le catalogue', navigateTo: navigateToHomeConfig },
    tertiaryButton: {
      wording: 'Faire une demande',
      navigateTo: navigateToHomeConfig,
      Icon: ExternalSiteFilled,
    },
  },
  [BonificationRefusedType.TOO_MANY_RETRIES]: {
    Illustration: SadFace,
    title: 'Tu as atteint le nombre maximum d’essais',
    firstText:
      'Après plusieurs tentatives, nous ne pouvons plus traiter ta demande pour cette aide. Si tu souhaites contester cette décision ou obtenir plus d’informations, tu peux contacter notre support.',
    secondText: undefined,
    thirdText: undefined,
    bannerText: undefined,
    primaryButton: { wording: 'Retour à l’acceuil', navigateTo: navigateToHomeConfig },
    tertiaryButton: {
      wording: undefined,
      navigateTo: undefined,
      Icon: undefined,
    },
  },
}

export function BonificationRefused() {
  const pageConfig = PAGE_CONFIG[BonificationRefusedType.TOO_MANY_RETRIES] // refused code will come from back
  return (
    <GenericInfoPage
      illustration={pageConfig.Illustration}
      title={pageConfig.title}
      buttonPrimary={{
        wording: pageConfig.primaryButton.wording,
        navigateTo: pageConfig.primaryButton.navigateTo,
      }}
      buttonTertiary={
        pageConfig.tertiaryButton.Icon &&
        pageConfig.tertiaryButton.wording &&
        pageConfig.tertiaryButton.navigateTo
          ? {
              icon: pageConfig.tertiaryButton.Icon,
              wording: pageConfig.tertiaryButton.wording,
              navigateTo: pageConfig.tertiaryButton.navigateTo,
            }
          : undefined
      }>
      <ViewGap gap={5}>
        <CenteredBody>{pageConfig.firstText}</CenteredBody>
        <Typo.Body>{pageConfig.secondText}</Typo.Body>
        {pageConfig.thirdText ? <Typo.Body>{pageConfig.thirdText}</Typo.Body> : null}
        {pageConfig.bannerText ? <Banner label={pageConfig.bannerText} /> : null}
      </ViewGap>
    </GenericInfoPage>
  )
}

const CenteredBody = styled(Typo.Body)({
  textAlign: 'center',
})
