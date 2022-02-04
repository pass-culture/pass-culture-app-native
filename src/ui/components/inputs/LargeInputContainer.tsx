import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, padding } from 'ui/theme'

type Props = {
  isError?: boolean
  isFocus?: boolean
  inputHeight?: number
}

const defaultProps: Props = {
  isError: false,
  isFocus: false,
}

export const LargeInputContainer: React.FC<Props> = (props) => {
  return (
    <StyledView height={props.inputHeight} isError={props.isError} isFocus={props.isFocus}>
      {props.children}
    </StyledView>
  )
}

LargeInputContainer.defaultProps = defaultProps

const StyledView = styled.View<{
  height?: number
  isFocus?: boolean
  isError?: boolean
}>(({ theme, height, isFocus, isError }) => ({
  width: '100%',
  height: height || getSpacing(23.5),
  flexDirection: 'row',
  alignItems: 'flex-start',
  ...padding(2, 3),
  borderRadius: 16,
  border: `solid 1px ${
    isFocus ? theme.colors.primary : isError ? theme.colors.error : theme.colors.greyMedium
  }`,
  backgroundColor: theme.colors.white,
}))
