import { AccessibilityActionItem } from 'features/profile/components/AccessibilityActionPlanSection/types'
import { TagVariant } from 'ui/components/Tag/types'

export const accessibility2025: AccessibilityActionItem[] = [
  {
    id: 'audit-parcours-web',
    text: 'Réaliser un audit interne sur les parcours clés de la version web',
    tag: { label: 'Prochainement', variant: TagVariant.WARNING },
  },
  {
    id: 'certification-sites-accessibles',
    text: 'Valider la certification “Développer des sites web accessibles” (tous les développeurs front-end)',
    tag: { label: 'En cours', variant: TagVariant.DEFAULT },
  },
  {
    id: 'formation-audit-mobile',
    text: 'Former un développeur à l’audit d’accessibilité numérique des applications mobiles',
    tag: { label: 'Prochainement', variant: TagVariant.WARNING },
  },
  {
    id: 'process-verification-rgaa',
    text: 'Mettre en place un process de vérification d’accessibilité RGAA pour les nouvelles fonctionnalités',
    tag: { label: 'Prochainement', variant: TagVariant.WARNING },
  },
  {
    id: 'accessibilite-mails',
    text: 'Revoir l’accessibilité de tous les mails transactionnels',
    tag: { label: 'Prochainement', variant: TagVariant.WARNING },
  },
  {
    id: 'objectif-web-100',
    text: 'Atteindre 100% d’accessibilité de la version web sur les parcours clés',
    tag: { label: 'Prochainement', variant: TagVariant.WARNING },
  },
  {
    id: 'modalites-accessibilite-offres',
    text: 'Informer des modalités de mises en accessibilité des offres',
    tag: { label: 'Prochainement', variant: TagVariant.WARNING },
  },
  {
    id: 'visibilite-pass-offres-accessibles',
    text: 'Renforcer la visibilité sur le pass d’offres accessibles auprès des publics concernés (partenariats et inscriptions d’AC spécialisées…)',
    tag: { label: 'Prochainement', variant: TagVariant.WARNING },
  },
  {
    id: 'mode-sombre',
    text: 'Proposer un mode sombre aux utilisateurs',
    tag: { label: 'Prochainement', variant: TagVariant.WARNING },
  },
  {
    id: 'design-system-accessible',
    text: 'Mettre en place un design system 100% accessible',
    tag: { label: 'Prochainement', variant: TagVariant.WARNING },
  },
]
