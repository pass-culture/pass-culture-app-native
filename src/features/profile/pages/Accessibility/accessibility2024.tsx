import React from 'react'

import { AccessibilityActionItem } from 'features/profile/components/AccessibilityActionPlanSection/types'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { TagVariant } from 'ui/components/Tag/types'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'

export const accessibility2024: AccessibilityActionItem[] = [
  {
    id: 'solution-offres-accessibles',
    text: 'Mise en place d’une solution permettant aux jeunes en situation de handicap de retrouver facilement les offres accessibles',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'declaration-accessibilite-pro',
    customContent: (
      <Typo.Body>
        Publier la déclaration d’accessibilité du site{' '}
        <ExternalTouchableLink
          as={ButtonInsideText}
          typography="BodyAccentXs"
          wording="https://passculture.pro/"
          icon={ExternalSiteFilled}
          externalNav={{ url: 'https://passculture.pro/' }}
        />
      </Typo.Body>
    ),
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'integration-acceslibre',
    text: 'Intégrer les données d’Acceslibre pour améliorer l’information sur l’accessibilité des lieux',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'sensibilisation-partenaires',
    text: 'Mener des actions de sensibilisation des partenaires culturels sur l’information d’accessibilité de leurs lieux',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'declaration-accessibilite-culture',
    customContent: (
      <Typo.Body>
        Publier la déclaration d’accessibilité du site{' '}
        <ExternalTouchableLink
          as={ButtonInsideText}
          typography="BodyAccentXs"
          wording="https://pass.culture.fr/"
          icon={ExternalSiteFilled}
          externalNav={{ url: 'https://pass.culture.fr/' }}
        />
      </Typo.Body>
    ),
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'formation-pm-pro',
    customContent: (
      <Typo.Body>
        Formation des Product Manager du site{' '}
        <ExternalTouchableLink
          as={ButtonInsideText}
          typography="BodyAccentXs"
          wording="https://passculture.pro/"
          icon={ExternalSiteFilled}
          externalNav={{ url: 'https://passculture.pro/' }}
        />
      </Typo.Body>
    ),
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'sensibilisation-equipes-internes',
    text: 'Sensibilisation des équipes internes aux enjeux d’accessibilité',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'accessibilite-site-app',
    customContent: (
      <Typo.Body>
        Rendre le site{' '}
        <ExternalTouchableLink
          as={ButtonInsideText}
          typography="BodyAccentXs"
          wording="https://passculture.app/"
          icon={ExternalSiteFilled}
          externalNav={{ url: 'https://passculture.app/' }}
        />{' '}
        100% accessible
      </Typo.Body>
    ),
    tag: { label: 'En cours - poursuivi en 2025', variant: TagVariant.DEFAULT },
  },
  {
    id: 'modalites-par-offre',
    text: 'Améliorer la lisibilité de l’accessibilité des offres avec la mise en place des modalités d’accessibilité par offre',
    tag: { label: 'En cours - poursuivi en 2025', variant: TagVariant.DEFAULT },
  },
  {
    id: 'charte-graphique-accessible',
    text: 'Mettre en place une charte graphique 100% accessible',
    tag: { label: 'Prochainement - à faire en 2025', variant: TagVariant.WARNING },
  },
  {
    id: 'nouvel-audit-pro',
    text: 'Réaliser un nouvel audit d’accessibilité du portail pro par un cabinet externe',
    tag: { label: 'Prochainement - à faire en 2025', variant: TagVariant.WARNING },
  },
]
