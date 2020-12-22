import React from 'react'
import styled from 'styled-components/native'

import { OfferAccessibilityResponse } from 'api/gen'
import { getSpacing, Spacer } from 'ui/theme'

import { AccessibilityAtom, HandicapCategory } from '../atoms/AccessibilityAtom'

export const AccessibilityBlock: React.FC<OfferAccessibilityResponse> = ({
  visualDisability = false,
  audioDisability = false,
  mentalDisability = false,
  motorDisability = false,
}) => {
  return (
    <Row>
      <AccessibilityAtom
        handicap={HandicapCategory.VISUAL}
        isAccessible={visualDisability}
        sideSpace={getSpacing(4)}
      />
      <Spacer.Row numberOfSpaces={4} />
      <AccessibilityAtom
        handicap={HandicapCategory.MENTAL}
        isAccessible={mentalDisability}
        sideSpace={getSpacing(4)}
      />
      <Spacer.Row numberOfSpaces={4} />
      <AccessibilityAtom
        handicap={HandicapCategory.MOTOR}
        isAccessible={motorDisability}
        sideSpace={getSpacing(4)}
      />
      <Spacer.Row numberOfSpaces={4} />
      <AccessibilityAtom
        handicap={HandicapCategory.AUDIO}
        isAccessible={audioDisability}
        sideSpace={getSpacing(4)}
      />
    </Row>
  )
}

const Row = styled.View({ flexDirection: 'row' })
