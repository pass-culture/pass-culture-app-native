import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

interface Props {
  text: string
  width?: number
  height?: number
  slantAngle?: number
  testID?: string
  children?: never
}

export const SlantTag: React.FC<Props> = ({ text, width, height, testID, slantAngle }) => {
  return (
    <SlantTagContainer testID={testID} tagWidth={width} tagHeight={height} tagAngle={slantAngle}>
      <StyledPrice tagAngle={slantAngle}>{text}</StyledPrice>
    </SlantTagContainer>
  )
}

const StyledPrice = styled(Typo.Caption)<{
  tagAngle: number | undefined
}>(({ tagAngle, theme }) => ({
  color: theme.colors.white,
  transform: tagAngle ? `rotate(${-tagAngle}deg)` : `rotate(4.34deg)`,
  alignSelf: 'center',
}))

const SlantTagContainer = styled.View<{
  tagWidth: number | undefined
  tagHeight: number | undefined
  tagAngle: number | undefined
}>(({ tagWidth, tagHeight, tagAngle, theme }) => ({
  backgroundColor: theme.colors.secondary,
  justifyContent: 'center',
  borderRadius: theme.borderRadius.checkbox,
  width: tagWidth || 'auto',
  height: tagHeight || 'auto',
  paddingVertical: tagHeight ? 0 : getSpacing(0.5),
  paddingHorizontal: tagWidth ? 0 : getSpacing(2.5),
  transform: tagAngle ? `rotate(${tagAngle}deg)` : `rotate(-4.34deg)`,
}))
