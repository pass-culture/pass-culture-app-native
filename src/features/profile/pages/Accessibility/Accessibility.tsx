import { useNavigation } from '@react-navigation/native'
import React from 'react'

import {
  AccessibilityRootStackParamList,
  UseNavigationType,
} from 'features/navigation/navigators/RootNavigator/types'
import { createAccessibilityRow } from 'features/profile/pages/Accessibility/createAccessibilityRow'
import { env } from 'libs/environment/env'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { Separator } from 'ui/components/Separator'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'

export type AccessibilityRowConfig =
  | { title: string; screen: keyof AccessibilityRootStackParamList }
  | { title: string; externalNav: { url: string } }

const sectionConfig: AccessibilityRowConfig[] = [
  {
    title: 'Plan du site',
    screen: 'SiteMapScreen',
  },
  {
    title: 'Les engagements du pass Culture',
    externalNav: { url: env.ACCESSIBILITY },
  },
  {
    title: 'Schéma pluriannuel',
    externalNav: { url: env.ACCESSIBILITY_PLAN },
  },
  {
    title: 'Déclaration d’accessibilité - Android',
    screen: 'AccessibilityDeclarationMobileAndroid',
  },
  {
    title: 'Déclaration d’accessibilité - iOS',
    screen: 'AccessibilityDeclarationMobileIOS',
  },
  {
    title: 'Déclaration d’accessibilité - web',
    screen: 'AccessibilityDeclarationWeb',
  },
  {
    title: 'Parcours recommandés - web',
    screen: 'RecommendedPaths',
  },
]

export const Accessibility = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const items = sectionConfig.map((item, index) => createAccessibilityRow(item, index, navigate))

  return (
    <SecondaryPageWithBlurHeader title="Accessibilité" enableMaxWidth={false}>
      <AccessibleUnorderedList items={items} Separator={<Separator.Horizontal />} withPadding />
    </SecondaryPageWithBlurHeader>
  )
}
