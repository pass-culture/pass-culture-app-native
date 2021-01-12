import React from 'react'
import styled from 'styled-components/native'

import { OfferAccessibilityResponse } from 'api/gen'
import { getSpacing, Spacer } from 'ui/theme'

import { AccessibilityAtom, HandicapCategory } from '../atoms/AccessibilityAtom'

export const AccessibilityBlock: React.FC<OfferAccessibilityResponse> = ({
  visualDisability,
  audioDisability,
  mentalDisability,
  motorDisability,
}) => {
  return (
    <Row>
      {visualDisability !== undefined && <AccessibilityAtom
        handicap={HandicapCategory.VISUAL}
        isAccessible={visualDisability}
        sideSpace={getSpacing(4)}
      />}
      <Spacer.Row numberOfSpaces={4} />
      {mentalDisability !== undefined && <AccessibilityAtom
        handicap={HandicapCategory.MENTAL}
        isAccessible={mentalDisability}
        sideSpace={getSpacing(4)}
      />}
      <Spacer.Row numberOfSpaces={4} />
      {motorDisability !== undefined && <AccessibilityAtom
        handicap={HandicapCategory.MOTOR}
        isAccessible={motorDisability}
        sideSpace={getSpacing(4)}
      />}
      <Spacer.Row numberOfSpaces={4} />
      {audioDisability !== undefined && <AccessibilityAtom
        handicap={HandicapCategory.AUDIO}
        isAccessible={audioDisability}
        sideSpace={getSpacing(4)}
      />}
    </Row>
  )
}

const Row = styled.View({ flexDirection: 'row' })
