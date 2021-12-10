import React from 'react'
import styled from 'styled-components/native'

import { Spinner } from 'ui/components/spinner/Spinner'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme'

export const SpinnerWithCenteredContainer = ({
  size,
  color = ColorsEnum.GREY_DARK,
}: IconInterface) => (
  <SpinnerContainer>
    <Spinner size={size} color={color} />
  </SpinnerContainer>
)

const SpinnerContainer = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
})
