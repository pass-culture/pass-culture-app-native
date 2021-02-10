import React from 'react'
import styled from 'styled-components/native'

import { OfferAccessibilityResponse } from 'api/gen'
import { getSpacing, Spacer } from 'ui/theme'

import { AccessibilityAtom } from '../atoms/AccessibilityAtom'
import { HandicapCategory } from '../atoms/AccessibilityAtom.service'

export const AccessibilityBlock: React.FC<OfferAccessibilityResponse> = ({
  visualDisability,
  audioDisability,
  mentalDisability,
  motorDisability,
}) => {
  return (
    <Row>
      {renderAccessibilityAtom(visualDisability, HandicapCategory.VISUAL, true)}
      {renderAccessibilityAtom(mentalDisability, HandicapCategory.MENTAL, true)}
      {renderAccessibilityAtom(motorDisability, HandicapCategory.MOTOR, true)}
      {renderAccessibilityAtom(audioDisability, HandicapCategory.AUDIO, false)}
    </Row>
  )
}

const renderAccessibilityAtom = (
  disability: boolean | undefined | null,
  handicap: HandicapCategory,
  addSpacer: boolean
) =>
  disability !== null &&
  disability !== undefined && (
    <React.Fragment>
      <AccessibilityAtom handicap={handicap} isAccessible={disability} sideSpace={getSpacing(4)} />
      {addSpacer && <Spacer.Row numberOfSpaces={4} />}
    </React.Fragment>
  )

const Row = styled.View({ flexDirection: 'row' })
