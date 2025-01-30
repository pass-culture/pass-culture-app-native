import {
  AccessibilityRootStackParamList,
  GenericRoute,
} from 'features/navigation/RootNavigator/types'
import { Accessibility } from 'features/profile/pages/Accessibility/Accessibility'
import { AccessibilityActionPlan } from 'features/profile/pages/Accessibility/AccessibilityActionPlan'
import { AccessibilityDeclarationMobile } from 'features/profile/pages/Accessibility/AccessibilityDeclarationMobile'
import { AccessibilityDeclarationWeb } from 'features/profile/pages/Accessibility/AccessibilityDeclarationWeb'
import { AccessibilityEngagement } from 'features/profile/pages/Accessibility/AccessibilityEngagement'
import { RecommendedPaths } from 'features/profile/pages/Accessibility/RecommendedPaths'

export const accessibilityRoutes: GenericRoute<AccessibilityRootStackParamList>[] = [
  {
    name: 'Accessibility',
    component: Accessibility,
    path: 'accessibilite',
    options: { title: 'Accessibilité' },
  },
  {
    name: 'AccessibilityEngagement',
    component: AccessibilityEngagement,
    path: 'accessibilite/engagements',
    options: { title: 'Engagement' },
  },
  {
    name: 'AccessibilityActionPlan',
    component: AccessibilityActionPlan,
    path: 'accessibilite/plan-d-actions',
    options: { title: 'Plan d’actions' },
  },
  {
    name: 'AccessibilityDeclarationMobile',
    component: AccessibilityDeclarationMobile,
    path: 'accessibilite/declaration-accessibilite-mobile',
    options: { title: 'Déclaration d’accessibilité des applications iOS et Android' },
  },
  {
    name: 'AccessibilityDeclarationWeb',
    component: AccessibilityDeclarationWeb,
    path: 'accessibilite/declaration-accessibilite-web',
    options: { title: 'Déclaration d’accessibilité de la version web' },
  },
  {
    name: 'RecommendedPaths',
    component: RecommendedPaths,
    path: 'accessibilite/parcours-recommandes',
    options: { title: 'Parcours recommandés' },
  },
]
