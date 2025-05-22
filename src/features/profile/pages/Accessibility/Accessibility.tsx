import React from 'react'
import styled from 'styled-components/native'

import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'
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

const sections = [
  <StyledSectionRow
    key={1}
    title="Les engagements du pass Culture"
    type="navigable"
    navigateTo={getProfileNavConfig('AccessibilityEngagement')}
    noTopMargin
  />,
  <StyledSectionRow
    key={2}
    title="Plan du site"
    type="navigable"
    navigateTo={getProfileNavConfig('SiteMapScreen')}
  />,
  <StyledSectionRow
    key={2}
    title="Schéma pluriannuel"
    type="navigable"
    navigateTo={getProfileNavConfig('AccessibilityActionPlan')}
  />,
  <StyledSectionRow
    key={3}
    title="Déclaration d’accessibilité des&nbsp;applications&nbsp;iOS&nbsp;et&nbsp;Android"
    type="navigable"
    navigateTo={getProfileNavConfig('AccessibilityDeclarationMobile')}
  />,
  <StyledSectionRow
    key={4}
    title="Déclaration d’accessibilité de&nbsp;la&nbsp;version&nbsp;web"
    type="navigable"
    navigateTo={getProfileNavConfig('AccessibilityDeclarationWeb')}
  />,
  <StyledSectionRow
    key={5}
    title="Parcours recommandés de&nbsp;la&nbsp;version&nbsp;web"
    type="navigable"
    navigateTo={getProfileNavConfig('RecommendedPaths')}
  />,
]

export function Accessibility() {
  const { goBack } = useGoBack(...getTabNavConfig('Profile'))

  return (
    <SecondaryPageWithBlurHeader title="Accessibilité" enableMaxWidth={false} onGoBack={goBack}>
      <AccessibleUnorderedList items={sections} Separator={<Separator.Horizontal />} />
    </SecondaryPageWithBlurHeader>
  )
}
