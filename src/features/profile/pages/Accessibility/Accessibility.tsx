import React from 'react'
import styled from 'styled-components/native'

import { PageProfileSection } from 'features/profile/pages/PageProfileSection/PageProfileSection'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { getSpacing } from 'ui/theme'

export function Accessibility() {
  return (
    <PageProfileSection title="Accessibilité">
      <SectionRow
        title="Les engagements du pass Culture"
        type="navigable"
        navigateTo={{ screen: 'AccessibilityEngagement' }}
      />
      <StyledSeparator />
      <SectionRow
        title="Parcours recommandés"
        type="navigable"
        navigateTo={{ screen: 'RecommendedPaths' }}
      />
      <StyledSeparator />
      <SectionRow
        title="Déclaration d’accessibilité"
        type="navigable"
        navigateTo={{ screen: 'AccessibilityDeclaration' }}
      />
      <StyledSeparator />
      <SectionRow
        title="Schéma pluriannuel"
        type="navigable"
        navigateTo={{ screen: 'AccessibilityActionPlan' }}
      />
    </PageProfileSection>
  )
}

const StyledSeparator = styled(Separator)({
  marginVertical: getSpacing(4),
})
