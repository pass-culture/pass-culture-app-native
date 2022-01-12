import React from 'react'
import styled from 'styled-components/native'
import { useTheme } from 'styled-components/native'

import { OfferAccessibilityResponse } from 'api/gen'
import { AccessibilityAtom } from 'ui/components/accessibility/AccessibilityAtom'
import { HandicapCategory } from 'ui/components/accessibility/AccessibilityAtom.service'
import { getSpacing } from 'ui/theme'

export const AccessibilityBlock: React.FC<OfferAccessibilityResponse> = ({
  visualDisability,
  audioDisability,
  mentalDisability,
  motorDisability,
}) => {
  const { isMobileViewport } = useTheme()
  return (
    <Row>
      {renderAccessibilityAtom(visualDisability, HandicapCategory.VISUAL, true)}
      {renderAccessibilityAtom(mentalDisability, HandicapCategory.MENTAL, true)}
      {renderAccessibilityAtom(motorDisability, HandicapCategory.MOTOR, true)}
      {renderAccessibilityAtom(
        audioDisability,
        HandicapCategory.AUDIO,
        isMobileViewport ? false : true
      )}
    </Row>
  )
}

const renderAccessibilityAtom = (
  disability: boolean | undefined | null,
  handicap: HandicapCategory,
  addSpacer: boolean
) =>
  !!(disability !== null && disability !== undefined) && (
    <AccessibilityAtom
      handicap={handicap}
      isAccessible={disability}
      rightSpacingValue={addSpacer ? getSpacing(3) : 0}
    />
  )

const Row = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: theme.isMobileViewport ? 'space-between' : 'space-around',
}))
