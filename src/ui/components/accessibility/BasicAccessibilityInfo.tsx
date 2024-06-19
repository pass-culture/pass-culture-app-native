import React from 'react'
import styled from 'styled-components/native'

import { OfferAccessibilityResponse } from 'api/gen'
import { HandicapCategory } from 'shared/accessibility/getAccessibilityCategoryAndIcon'
import { isNullOrUndefined } from 'shared/isNullOrUndefined/isNullOrUndefined'
import { AccessibilityAtom } from 'ui/components/accessibility/AccessibilityAtom'
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
      {renderAccessibilityAtom(visualDisability, HandicapCategory.VISUAL)}
      {renderAccessibilityAtom(mentalDisability, HandicapCategory.MENTAL)}
      {renderAccessibilityAtom(motorDisability, HandicapCategory.MOTOR)}
      {renderAccessibilityAtom(audioDisability, HandicapCategory.AUDIO)}
    </StyledUl>
  )
}

const renderAccessibilityAtom = (
  disability: boolean | undefined | null,
  handicap: HandicapCategory
) =>
  disability !== null && disability !== undefined ? (
    <StyledLi>
      <AccessibilityAtom handicap={handicap} isAccessible={disability} />
    </StyledLi>
  ) : null

const StyledUl = styled(Ul)(({ theme }) => ({
  flexDirection: 'row',
  overflow: 'visible',
  width: theme.isMobileViewport ? '100%' : undefined,
  justifyContent: theme.isMobileViewport ? 'space-between' : 'flex-start',
  gap: getSpacing(theme.isMobileViewport ? 0 : 10),
}))

const StyledLi = styled(Li)<{ rightSpacingValue: number }>(({ theme, rightSpacingValue }) => ({
  marginRight: theme.isDesktopViewport ? rightSpacingValue : undefined,
  maxWidth: getSpacing(18),
}))
