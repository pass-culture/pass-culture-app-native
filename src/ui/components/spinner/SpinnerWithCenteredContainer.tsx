import React from 'react'
import styled from 'styled-components/native'

import { Spinner } from 'ui/components/spinner/Spinner'
import { IconInterface } from 'ui/svg/icons/types'

export const SpinnerWithCenteredContainer = ({ size, color }: IconInterface) => (
  <SpinnerContainer>
    <Spinner size={size} color={color} />
  </SpinnerContainer>
)

const SpinnerContainer = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
})
