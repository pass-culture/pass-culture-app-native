import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, padding } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

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
  let borderColor = ColorsEnum.GREY_MEDIUM
  if (props.isFocus) {
    borderColor = ColorsEnum.PRIMARY
  } else if (props.isError) {
    borderColor = ColorsEnum.ERROR
  }

  return (
    <StyledView height={props.inputHeight} borderColor={borderColor}>
      {props.children}
    </StyledView>
  )
}

LargeInputContainer.defaultProps = defaultProps

const StyledView = styled.View<{
  height?: number
  borderColor: ColorsEnum
}>((props) => ({
  width: '100%',
  height: props.height || getSpacing(23.5),
  flexDirection: 'row',
  alignItems: 'flex-start',
  ...padding(2, 3),
  borderRadius: 16,
  border: `solid 1px ${props.borderColor}`,
  backgroundColor: ColorsEnum.WHITE,
}))
