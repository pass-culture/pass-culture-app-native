import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Spacer } from '../../../ui/theme'
import { AccessibilityAtom, HandicapCategory } from '../atoms/AccessibilityAtom'

interface Props {
  visualDisability: boolean
  mentalDisability: boolean
  motorDisability: boolean
  audioDisability: boolean
}

export const AccessibilityBlock: React.FC<Props> = ({
  visualDisability,
  audioDisability,
  mentalDisability,
  motorDisability,
}) => {
  return (
    <Row>
      <AccessibilityAtom
        handicap={HandicapCategory.VISUAL}
        isAccessible={visualDisability}
        sideSpace={getSpacing(2)}
      />
      <Spacer.Row numberOfSpaces={4} />
      <AccessibilityAtom
        handicap={HandicapCategory.MENTAL}
        isAccessible={mentalDisability}
        sideSpace={getSpacing(2)}
      />
      <Spacer.Row numberOfSpaces={4} />
      <AccessibilityAtom
        handicap={HandicapCategory.MOTOR}
        isAccessible={motorDisability}
        sideSpace={getSpacing(2)}
      />
      <Spacer.Row numberOfSpaces={4} />
      <AccessibilityAtom
        handicap={HandicapCategory.AUDIO}
        isAccessible={audioDisability}
        sideSpace={getSpacing(2)}
      />
    </Row>
  )
}

const Row = styled.View({ flexDirection: 'row' })
