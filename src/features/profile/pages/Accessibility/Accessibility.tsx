import React from 'react'
import styled from 'styled-components/native'

import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'
import { ProfileStackParamList } from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
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
  screen: keyof ProfileStackParamList
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

const sections = sectionConfig.map(({ title, screen, noTopMargin }) => (
  <StyledSectionRow
    key={title}
    title={title}
    type="navigable"
    navigateTo={getProfileNavConfig(screen)}
    noTopMargin={noTopMargin}
  />
))

export function Accessibility() {
  const { goBack } = useGoBack(...getTabNavConfig('Profile'))

  return (
    <SecondaryPageWithBlurHeader title="Accessibilité" enableMaxWidth={false} onGoBack={goBack}>
      <AccessibleUnorderedList items={sections} Separator={<Separator.Horizontal />} />
    </SecondaryPageWithBlurHeader>
  )
}
