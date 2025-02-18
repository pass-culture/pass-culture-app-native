import React from 'react'
import styled from 'styled-components/native'

import { ArrowRight } from './ArrowRight'
import { AccessibleIcon } from './types'

export const ArrowLeft: React.FC<AccessibleIcon> = React.memo(function NotMemoizedArrowLeft(props) {
  return <RotatedToLeftArrowRight {...props} />
})

const RotatedToLeftArrowRight = styled(ArrowRight)({ transform: 'rotate(180deg)' })
