import { AccessibilityActionItem } from 'features/profile/components/AccessibilityActionPlanSection/types'
import { renderAccessibilityExternalLink } from 'features/profile/helpers/renderAccessibilityExternalLink'
import { TagVariant } from 'ui/components/Tag/types'

export const accessibility2024: AccessibilityActionItem[] = [
  {
    text: 'Mise en place d’une solution permettant aux jeunes en situation de handicap de retrouver facilement les offres accessibles',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    text: 'Intégrer les données d’Acceslibre pour améliorer l’information sur l’accessibilité des lieux',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    text: 'Mener des actions de sensibilisation des partenaires culturels sur l’information d’accessibilité de leurs lieux',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    text: 'Publier la déclaration d’accessibilité du site',
    customContent: renderAccessibilityExternalLink('https://pass.culture.fr/'),

    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    text: 'Formation des Product Manager du site',
    customContent: renderAccessibilityExternalLink('https://passculture.pro/'),
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    text: 'Sensibilisation des équipes internes aux enjeux d’accessibilité',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    text: 'Rendre le site 100% accessible',
    customContent: renderAccessibilityExternalLink('https://passculture.app/'),
    tag: { label: 'En cours - poursuivi en 2025', variant: TagVariant.DEFAULT },
  },
  {
    text: 'Améliorer la lisibilité de l’accessibilité des offres avec la mise en place des modalités d’accessibilité par offre',
    tag: { label: 'En cours - poursuivi en 2025', variant: TagVariant.DEFAULT },
  },
  {
    text: 'Mettre en place une charte graphique 100% accessible',
    tag: { label: 'Prochainement - à faire en 2025', variant: TagVariant.WARNING },
  },
  {
    text: 'Réaliser un nouvel audit d’accessibilité du portail pro par un cabinet externe',
    tag: { label: 'Prochainement - à faire en 2025', variant: TagVariant.WARNING },
  },
]
