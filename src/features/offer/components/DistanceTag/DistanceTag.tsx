import React from 'react'
import { View, ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

export type DistanceTagProps = ViewProps & {
  distance: string
}

export function DistanceTag({ distance, ...props }: DistanceTagProps) {
  return (
    <Wrapper {...props}>
      <DistanceText>À {distance}</DistanceText>
    </Wrapper>
  )
}

const Wrapper = styled(View)`
  border-radius: 6px;
  background-color: #c1a3ff33;
  padding-inline: ${getSpacing(2)}px;
  padding-block: ${getSpacing(1)}px;
  align-self: baseline;
`

const DistanceText = styled(Typo.Caption)`
  color: ${({ theme }) => theme.colors.secondary};
`
