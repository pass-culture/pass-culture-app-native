import React from 'react'

import { AccessibilityActionItem } from 'features/profile/components/AccessibilityActionPlanSection/types'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { TagVariant } from 'ui/components/Tag/types'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'

export const accessibility2023: AccessibilityActionItem[] = [
  {
    id: 'formation-produits',
    text: 'Formation des équipes produit aux enjeux de l’accessibilité',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'formation-territoires',
    text: 'Formation des équipes territoires à l’accompagnement direct de jeunes en situation de handicap',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'formation-devs-site-pro',
    customContent: (
      <Typo.Body>
        Formation des développeurs du site{' '}
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
    id: 'audit-site-pro',
    customContent: (
      <Typo.Body>
        Réalisation d’un audit d’accessibilité du site{' '}
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
    id: 'diffusion-mdph',
    text: 'Diffusion d’information sur le pass Culture via les MDPH (Maisons départementales des personnes handicapées)',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'maquettage-nouveau-site',
    customContent: (
      <Typo.Body>
        Maquettage d’un nouveau site{' '}
        <ExternalTouchableLink
          as={ButtonInsideText}
          typography="BodyAccentXs"
          wording="https://pass.culture.fr/"
          icon={ExternalSiteFilled}
          externalNav={{ url: 'https://pass.culture.fr/' }}
        />{' '}
        100% accessible
      </Typo.Body>
    ),
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'partenariat-acceslibre',
    text: 'Mise en place d’un partenariat avec Acceslibre pour compléter les informations d’accessibilité des partenaires culturels',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
]
