import { ComponentForPathConfig } from 'features/navigation/ComponentForPathConfig'
import {
  AccessibilityRootStackParamList,
  GenericRoute,
} from 'features/navigation/RootNavigator/types'

export const accessibilityRoutes: GenericRoute<AccessibilityRootStackParamList>[] = [
  {
    name: 'Accessibility',
    component: ComponentForPathConfig,
    path: 'accessibilite',
    options: { title: 'Accessibilité' },
  },
  {
    name: 'AccessibilityEngagement',
    component: ComponentForPathConfig,
    path: 'accessibilite/engagements',
    options: { title: 'Engagement' },
  },
  {
    name: 'AccessibilityActionPlan',
    component: ComponentForPathConfig,
    path: 'accessibilite/plan-d-actions',
    options: { title: 'Plan d’actions' },
  },
  {
    name: 'AccessibilityDeclarationMobile',
    component: ComponentForPathConfig,
    path: 'accessibilite/declaration-accessibilite-mobile',
    options: { title: 'Déclaration d’accessibilité des applications iOS et Android' },
  },
  {
    name: 'AccessibilityDeclarationWeb',
    component: ComponentForPathConfig,
    path: 'accessibilite/declaration-accessibilite-web',
    options: { title: 'Déclaration d’accessibilité de la version web' },
  },
  {
    name: 'RecommendedPaths',
    component: ComponentForPathConfig,
    path: 'accessibilite/parcours-recommandes',
    options: { title: 'Parcours recommandés' },
  },
  {
    name: 'SiteMapScreen',
    component: ComponentForPathConfig,
    path: 'accessibilite/plan-du-site',
    options: { title: 'Plan du site' },
  },
]
