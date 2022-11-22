import {
  AccessibilityRootStackParamList,
  GenericRoute,
} from 'features/navigation/RootNavigator/types'
import { Accessibility } from 'features/profile/pages/Accessibility/Accessibility'
import { AccessibilityActionPlan } from 'features/profile/pages/Accessibility/AccessibilityActionPlan'
import { AccessibilityDeclaration } from 'features/profile/pages/Accessibility/AccessibilityDeclaration'
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
    name: 'RecommendedPaths',
    component: RecommendedPaths,
    path: 'accessibilite/parcours-recommandes',
    options: { title: 'Parcours recommandés' },
  },
  {
    name: 'AccessibilityDeclaration',
    component: AccessibilityDeclaration,
    path: 'accessibilite/declaration',
    options: { title: "Déclaration d'accessibilité" },
  },
  {
    name: 'AccessibilityActionPlan',
    component: AccessibilityActionPlan,
    path: 'accessibilite/plan-d-actions',
    options: { title: "Plan d'actions" },
  },
]
