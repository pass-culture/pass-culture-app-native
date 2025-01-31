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
    title="Schéma pluriannuel"
    type="navigable"
    navigateTo={{ screen: 'AccessibilityActionPlan' }}
  />,
  <StyledSectionRow
    key={3}
    title="Déclaration d’accessibilité des&nbsp;applications&nbsp;iOS&nbsp;et&nbsp;Android"
    type="navigable"
    navigateTo={{ screen: 'AccessibilityDeclarationMobile' }}
  />,
  <StyledSectionRow
    key={4}
    title="Déclaration d’accessibilité de&nbsp;la&nbsp;version&nbsp;web"
    type="navigable"
    navigateTo={{ screen: 'AccessibilityDeclarationWeb' }}
  />,
  <StyledSectionRow
    key={5}
    title="Parcours recommandés de&nbsp;la&nbsp;version&nbsp;web"
    type="navigable"
    navigateTo={{ screen: 'RecommendedPaths' }}
  />,
]

export function Accessibility() {
  return (
    <SecondaryPageWithBlurHeader title="Accessibilité" enableMaxWidth={false}>
      <AccessibleUnorderedList items={sections} Separator={<Separator.Horizontal />} />
    </SecondaryPageWithBlurHeader>
  )
}
