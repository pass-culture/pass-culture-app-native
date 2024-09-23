import React from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { AccessibilityFrame } from 'ui/components/accessibility/AccessibilityFrame'
import { Spacer, TypoDS } from 'ui/theme'

import {
  getAccessibilityCategoryAndIcon,
  HandicapCategory,
} from '../../../shared/accessibility/getAccessibilityCategoryAndIcon'

interface Props {
  handicap: HandicapCategory
  isAccessible: boolean
}

export const AccessibilityBadge: React.FC<Props> = ({ handicap, isAccessible }) => {
  const { Icon, wording } = getAccessibilityCategoryAndIcon(handicap)

  const isAccessibleLabel = isAccessible ? 'Accessible' : 'Non accessible'
  return (
    <Container
      accessibilityRole={AccessibilityRole.IMAGE}
      testID="accessibilityBadgeContainer"
      accessibilityLabel={`${wording}\u00a0: ${isAccessibleLabel}`}>
      <AccessibilityFrame Icon={Icon} isAccessible={isAccessible} />
      <Spacer.Column numberOfSpaces={4} />
      <StyledCaption>{wording}</StyledCaption>
    </Container>
  )
}

const Container = styled.View({
  alignItems: 'center',
})

const StyledCaption = styled(TypoDS.BodySemiBoldXs)({ textAlign: 'center', paddingHorizontal: 1 })
