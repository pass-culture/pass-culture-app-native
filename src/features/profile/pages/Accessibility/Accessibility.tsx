import React from 'react'
import styled from 'styled-components/native'

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
    <SecondaryPageWithBlurHeader title="Accessibilité" noMaxWidth>
      <AccessibleUnorderedList items={sections} Separator={<Separator.Horizontal />} />
    </SecondaryPageWithBlurHeader>
  )
}
