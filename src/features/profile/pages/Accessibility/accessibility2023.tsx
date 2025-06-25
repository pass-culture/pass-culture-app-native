import React from 'react'

import { AccessibilityActionItem } from 'features/profile/components/AccessibilityActionPlanSection/types'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { TagVariant } from 'ui/components/Tag/types'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'

export const accessibility2023: AccessibilityActionItem[] = [
  {
    text: 'Formation des équipes produit aux enjeux de l’accessibilité',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    text: 'Formation des équipes territoires à l’accompagnement direct de jeunes en situation de handicap',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    text: 'Formation des développeurs du site',
    customContent: (
      <ExternalTouchableLink
        as={ButtonInsideText}
        typography="Body"
        wording="https://passculture.pro/"
        icon={ExternalSiteFilled}
        externalNav={{ url: 'https://passculture.pro/' }}
      />
    ),
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    text: 'Réalisation d’un audit d’accessibilité du site',
    customContent: (
      <ExternalTouchableLink
        as={ButtonInsideText}
        typography="Body"
        wording="https://passculture.pro/"
        icon={ExternalSiteFilled}
        externalNav={{ url: 'https://passculture.pro/' }}
      />
    ),
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    text: 'Diffusion d’information sur le pass Culture via les MDPH (Maisons départementales des personnes handicapées)',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    text: 'Maquettage d’un nouveau site 100% accessible',
    customContent: (
      <ExternalTouchableLink
        as={ButtonInsideText}
        typography="Body"
        wording="https://pass.culture.fr/"
        icon={ExternalSiteFilled}
        externalNav={{ url: 'https://pass.culture.fr/' }}
      />
    ),
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    text: 'Mise en place d’un partenariat avec Acceslibre pour compléter les informations d’accessibilité des partenaires culturels',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
]
