import { AccessibilityActionItem } from 'features/profile/components/AccessibilityActionPlanSection/types'
import { renderAccessibilityExternalLink } from 'features/profile/helpers/renderAccessibilityExternalLink'
import { TagVariant } from 'ui/designSystem/Tag/types'

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
    customContent: renderAccessibilityExternalLink('https://passculture.pro/'),
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    text: 'Réalisation d’un audit d’accessibilité du site',
    customContent: renderAccessibilityExternalLink('https://passculture.pro/'),
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    text: 'Diffusion d’information sur le pass Culture via les MDPH (Maisons départementales des personnes handicapées)',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    text: 'Maquettage d’un nouveau site 100% accessible',
    customContent: renderAccessibilityExternalLink('https://pass.culture.fr/'),
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    text: 'Mise en place d’un partenariat avec Acceslibre pour compléter les informations d’accessibilité des partenaires culturels',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
]
