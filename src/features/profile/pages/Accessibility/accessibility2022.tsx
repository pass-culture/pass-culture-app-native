import { AccessibilityActionItem } from 'features/profile/components/AccessibilityActionPlanSection/types'
import { TagVariant } from 'ui/components/Tag/types'

export const accessibility2022: AccessibilityActionItem[] = [
  {
    id: 'pole-accessibilite',
    text: 'Constitution du pôle Accessibilité',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'nomination-referents',
    text: 'Nomination de 2 personnes référentes sur l’accessibilité numérique',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'formation-devs',
    text: 'Formation de l’ensemble des développeurs travaillant sur le présent site',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'journee-accessibilite',
    text: 'Organisation d’une journée dédiée à l’accessibilité numérique avec les développeurs travaillant sur le présent site',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'audit-site',
    text: 'Audit d’accessibilité pour le présent site',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'declaration-conformite',
    text: 'Publication de la déclaration de mise en conformité pour le présent site',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'rencontre-utilisateurs',
    text: 'Rencontre avec des utilisateurs en situation de handicap',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
  {
    id: 'formation-com-marketing',
    text: 'Formation du pôle Communication, Marketing, Recherche',
    tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
  },
]
