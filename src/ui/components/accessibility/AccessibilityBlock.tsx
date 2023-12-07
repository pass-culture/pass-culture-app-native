import React from 'react'
import styled from 'styled-components/native'

import { OfferAccessibilityResponse } from 'api/gen'
import { isNullOrUndefined } from 'shared/isNullOrUndefined/isNullOrUndefined'
import { AccessibilityAtom } from 'ui/components/accessibility/AccessibilityAtom'
import { HandicapCategory } from 'ui/components/accessibility/AccessibilityAtom.service'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { getSpacing } from 'ui/theme'

export function AccessibilityBlock({
  visualDisability,
  audioDisability,
  mentalDisability,
  motorDisability,
}: Readonly<OfferAccessibilityResponse>) {
  if (
    isNullOrUndefined(visualDisability) &&
    isNullOrUndefined(audioDisability) &&
    isNullOrUndefined(mentalDisability) &&
    isNullOrUndefined(motorDisability)
  )
    return null

  return (
    <StyledUl>
      {renderAccessibilityAtom(visualDisability, HandicapCategory.VISUAL, true)}
      {renderAccessibilityAtom(mentalDisability, HandicapCategory.MENTAL, true)}
      {renderAccessibilityAtom(motorDisability, HandicapCategory.MOTOR, true)}
      {renderAccessibilityAtom(audioDisability, HandicapCategory.AUDIO, false)}
    </StyledUl>
  )
}

const renderAccessibilityAtom = (
  disability: boolean | undefined | null,
  handicap: HandicapCategory,
  addSpacer: boolean
) =>
  !!(disability !== null && disability !== undefined) && (
    <StyledLi rightSpacingValue={addSpacer ? getSpacing(10) : 0}>
      <AccessibilityAtom handicap={handicap} isAccessible={disability} />
    </StyledLi>
  )

const StyledUl = styled(Ul)(({ theme }) => ({
  flexDirection: 'row',
  overflow: 'visible',
  width: theme.isMobileViewport ? '100%' : undefined,
  justifyContent: theme.isMobileViewport ? 'space-between' : 'flex-start',
}))

const StyledLi = styled(Li)<{ rightSpacingValue: number }>(({ theme, rightSpacingValue }) => ({
  marginRight: theme.isDesktopViewport ? rightSpacingValue : undefined,
  maxWidth: getSpacing(16),
}))
