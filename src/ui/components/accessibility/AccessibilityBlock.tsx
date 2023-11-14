import React from 'react'
import styled from 'styled-components/native'

import { OfferAccessibilityResponse } from 'api/gen'
import { AccessibilityAtom } from 'ui/components/accessibility/AccessibilityAtom'
import { HandicapCategory } from 'ui/components/accessibility/AccessibilityAtom.service'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { getSpacing } from 'ui/theme'

const isNullOrUndefined = <T,>(value: T | undefined | null) => value === undefined || value === null

export const AccessibilityBlock: React.FC<OfferAccessibilityResponse> = ({
  visualDisability,
  audioDisability,
  mentalDisability,
  motorDisability,
}) => {
  if (
    isNullOrUndefined(visualDisability) &&
    isNullOrUndefined(audioDisability) &&
    isNullOrUndefined(mentalDisability) &&
    isNullOrUndefined(motorDisability)
  )
    return null

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
    <StyledLi rightSpacingValue={addSpacer ? getSpacing(3) : 0}>
      <AccessibilityAtom handicap={handicap} isAccessible={disability} />
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

const StyledLi = styled(Li)<{ rightSpacingValue: number }>(({ rightSpacingValue }) => ({
  flex: 1,
  marginRight: rightSpacingValue,
}))
