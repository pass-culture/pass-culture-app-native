import React from 'react'
import styled from 'styled-components/native'

import { OfferAccessibilityResponse } from 'api/gen'
import { AccessibilityAtom } from 'ui/components/accessibility/AccessibilityAtom'
import { HandicapCategory } from 'ui/components/accessibility/AccessibilityAtom.service'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { getSpacing } from 'ui/theme'

export const AccessibilityBlock: React.FC<OfferAccessibilityResponse> = ({
  visualDisability,
  audioDisability,
  mentalDisability,
  motorDisability,
}) => {
  return (
    <Row>
      <StyledUl>
        {renderAccessibilityAtom(visualDisability, HandicapCategory.VISUAL, true)}
        {renderAccessibilityAtom(mentalDisability, HandicapCategory.MENTAL, true)}
        {renderAccessibilityAtom(motorDisability, HandicapCategory.MOTOR, true)}
        {renderAccessibilityAtom(audioDisability, HandicapCategory.AUDIO, false)}
      </StyledUl>
    </Row>
  )
}

const renderAccessibilityAtom = (
  disability: boolean | undefined | null,
  handicap: HandicapCategory,
  addSpacer: boolean
) =>
  !!(disability !== null && disability !== undefined) && (
    <StyledLi>
      <AccessibilityAtom
        handicap={handicap}
        isAccessible={disability}
        rightSpacingValue={addSpacer ? getSpacing(3) : 0}
      />
    </StyledLi>
  )

const Row = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: theme.isMobileViewport ? 'space-between' : 'space-around',
}))

const StyledUl = styled(Ul)({
  flex: 1,
  overflow: 'visible',
})

const StyledLi = styled(Li)({
  flex: 1,
})
