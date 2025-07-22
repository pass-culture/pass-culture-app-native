import React from 'react'
import styled from 'styled-components/native'

import { OfferAccessibilityResponse } from 'api/gen'
import { HandicapCategory } from 'shared/accessibility/getAccessibilityCategoryAndIcon'
import { isNullOrUndefined } from 'shared/isNullOrUndefined/isNullOrUndefined'
import { AccessibilityBadge } from 'ui/components/accessibility/AccessibilityBadge'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { getSpacing } from 'ui/theme'

type Props = {
  accessibility: OfferAccessibilityResponse
}

export function BasicAccessibilityInfo({ accessibility }: Readonly<Props>) {
  const { visualDisability, audioDisability, mentalDisability, motorDisability } = accessibility
  if (
    isNullOrUndefined(visualDisability) &&
    isNullOrUndefined(audioDisability) &&
    isNullOrUndefined(mentalDisability) &&
    isNullOrUndefined(motorDisability)
  )
    return null

  return (
    <StyledUl testID="BasicAccessibilityInfo">
      {renderAccessibilityBadge(visualDisability, HandicapCategory.VISUAL)}
      {renderAccessibilityBadge(mentalDisability, HandicapCategory.MENTAL)}
      {renderAccessibilityBadge(motorDisability, HandicapCategory.MOTOR)}
      {renderAccessibilityBadge(audioDisability, HandicapCategory.AUDIO)}
    </StyledUl>
  )
}

const renderAccessibilityBadge = (
  disability: boolean | undefined | null,
  handicap: HandicapCategory
) =>
  disability !== null && disability !== undefined ? (
    <StyledLi>
      <AccessibilityBadge handicap={handicap} isAccessible={disability} />
    </StyledLi>
  ) : null

const StyledUl = styled(Ul)(({ theme }) => ({
  flexDirection: 'row',
  overflow: 'visible',
  width: theme.isMobileViewport ? '100%' : undefined,
  justifyContent: theme.isMobileViewport ? 'space-between' : 'flex-start',
  gap: getSpacing(theme.isMobileViewport ? 0 : 10),
}))

const StyledLi = styled(Li)<{ rightSpacingValue?: number }>(({ theme, rightSpacingValue }) => ({
  marginRight: theme.isDesktopViewport ? rightSpacingValue : undefined,
  maxWidth: getSpacing(18),
}))
