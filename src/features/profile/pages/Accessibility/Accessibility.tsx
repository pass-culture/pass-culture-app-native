import React from 'react'
import styled from 'styled-components/native'

import { PageProfileSection } from 'features/profile/components/PageProfileSection/PageProfileSection'
import { AccessibilityList } from 'ui/components/accessibility/AccessibilityList'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
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
    navigateTo={{ screen: 'AccessibilityEngagement' }}
    noTopMargin
  />,
  <StyledSectionRow
    key={2}
    title="Parcours recommandés"
    type="navigable"
    navigateTo={{ screen: 'RecommendedPaths' }}
  />,
  <StyledSectionRow
    key={3}
    title="Déclaration d’accessibilité"
    type="navigable"
    navigateTo={{ screen: 'AccessibilityDeclaration' }}
  />,
  <StyledSectionRow
    key={4}
    title="Schéma pluriannuel"
    type="navigable"
    navigateTo={{ screen: 'AccessibilityActionPlan' }}
  />,
]

export function Accessibility() {
  return (
    <PageProfileSection title="Accessibilité">
      <AccessibilityList items={sections} Separator={<Separator />} />
    </PageProfileSection>
  )
}
