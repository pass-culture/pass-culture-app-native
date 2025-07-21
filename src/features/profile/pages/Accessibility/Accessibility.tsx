import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import {
  AccessibilityRootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator/types'
import { getTabHookConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { getSpacing } from 'ui/theme'

const StyledSectionRow = styled(SectionRow)<{ noTopMargin?: boolean }>(({ noTopMargin }) => ({
  marginBottom: getSpacing(6),
  marginTop: noTopMargin ? 0 : getSpacing(6),
}))

const sectionConfig: {
  title: string
  screen: keyof AccessibilityRootStackParamList
  noTopMargin?: boolean
}[] = [
  {
    title: 'Plan du site',
    screen: 'SiteMapScreen',
    noTopMargin: true,
  },
  {
    title: 'Les engagements du pass Culture',
    screen: 'AccessibilityEngagement',
  },
  {
    title: 'Schéma pluriannuel',
    screen: 'AccessibilityActionPlan',
  },
  {
    title: 'Déclaration d’accessibilité des applications iOS et Android',
    screen: 'AccessibilityDeclarationMobile',
  },
  {
    title: 'Déclaration d’accessibilité de la version web',
    screen: 'AccessibilityDeclarationWeb',
  },
  {
    title: 'Parcours recommandés de la version web',
    screen: 'RecommendedPaths',
  },
]

export function Accessibility() {
  const { goBack } = useGoBack(...getTabHookConfig('Profile'))
  const { push } = useNavigation<UseNavigationType>()

  return (
    <SecondaryPageWithBlurHeader title="Accessibilité" enableMaxWidth={false} onGoBack={goBack}>
      <AccessibleUnorderedList
        items={sectionConfig.map(({ title, screen, noTopMargin }) => (
          <StyledSectionRow
            key={title}
            title={title}
            type="navigable"
            onPress={() =>
              push('ProfileStackNavigator', {
                screen: screen,
              })
            }
            noTopMargin={noTopMargin}
          />
        ))}
        Separator={<Separator.Horizontal />}
      />
    </SecondaryPageWithBlurHeader>
  )
}
