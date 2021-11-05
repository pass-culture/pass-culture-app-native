import * as React from 'react'
import styled from 'styled-components/native'

import { BicolorArrowRight } from './BicolorArrowRight'
import { BicolorIconInterface } from './types'

export const BicolorArrowLeft: React.FC<BicolorIconInterface> = React.memo(
  function NotMemoizedBicolorArrowLeft(props) {
    return <RotatedToLeftBicolorArrowRight {...props} />
  }
)

const RotatedToLeftBicolorArrowRight = styled(BicolorArrowRight)({ transform: 'rotate(180deg)' })
