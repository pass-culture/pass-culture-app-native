import React from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, padding } from 'ui/theme'

type Props = {
  isError?: boolean
  isFocus?: boolean
  inputHeight?: number
}

const MAX_WIDTH = getSpacing(120)

const defaultProps: Props = {
  isError: false,
  isFocus: false,
}

export const LargeInputContainer: React.FC<Props> = (props) => {
  const windowWidth = useWindowDimensions().width
  const maxWidth = Math.min(windowWidth * 0.9, MAX_WIDTH)

  let borderColor = ColorsEnum.GREY_MEDIUM
  if (props.isFocus) {
    borderColor = ColorsEnum.PRIMARY
  } else if (props.isError) {
    borderColor = ColorsEnum.ERROR
  }

  return (
    <StyledView height={props.inputHeight} maxWidth={maxWidth} borderColor={borderColor}>
      {props.children}
    </StyledView>
  )
}

LargeInputContainer.defaultProps = defaultProps

const StyledView = styled.View<{
  height?: number
  maxWidth: number
  borderColor: ColorsEnum
}>((props) => ({
  width: '100%',
  height: props.height || getSpacing(23.5),
  maxWidth: props.maxWidth,
  flexDirection: 'row',
  alignItems: 'flex-start',
  ...padding(2, 3),
  borderRadius: 16,
  border: `solid 1px ${props.borderColor}`,
  backgroundColor: ColorsEnum.WHITE,
}))
