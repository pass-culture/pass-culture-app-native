import React from 'react'
import { View, ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing, getSpacingString, Typo } from 'ui/theme'

type TagProps = ViewProps & {
  label: string
}

const PADDING_VERTICAL = getSpacing(1)
const NUMBER_OF_SPACES_LINE_HEIGHT = 4
const LINE_HEIGHT = getSpacing(NUMBER_OF_SPACES_LINE_HEIGHT)

export const TAG_HEIGHT = PADDING_VERTICAL + LINE_HEIGHT + PADDING_VERTICAL

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
  paddingVertical: PADDING_VERTICAL,
  paddingHorizontal: getSpacing(2),
  alignSelf: 'baseline',
}))

const LabelText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.black,
  lineHeight: getSpacingString(NUMBER_OF_SPACES_LINE_HEIGHT),
}))
