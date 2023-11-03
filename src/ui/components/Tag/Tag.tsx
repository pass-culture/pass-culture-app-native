import React from 'react'
import { View, ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

type TagProps = ViewProps & {
  label: string
}

export function Tag({ label, ...props }: TagProps) {
  return (
    <Wrapper {...props}>
      <LabelText>{label}</LabelText>
    </Wrapper>
  )
}

const Wrapper = styled(View)(({ theme }) => ({
  borderRadius: 6,
  backgroundColor: theme.colors.greyLight,
  paddingVertical: getSpacing(1),
  paddingHorizontal: getSpacing(2),
  alignSelf: 'baseline',
}))

const LabelText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.black,
}))
