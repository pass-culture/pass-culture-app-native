import React from 'react'
import { View, ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

type DistanceTagProps = ViewProps & {
  distance: string
}

export function DistanceTag({ distance, ...props }: DistanceTagProps) {
  return (
    <Wrapper {...props}>
      <DistanceText>à {distance}</DistanceText>
    </Wrapper>
  )
}

const Wrapper = styled(View)(({ theme }) => ({
  borderRadius: 6,
  backgroundColor: theme.colors.black,
  paddingVertical: getSpacing(1),
  paddingHorizontal: getSpacing(2),
  alignSelf: 'baseline',
}))

const DistanceText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.white,
}))
