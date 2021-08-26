import React from 'react'
import styled from 'styled-components/native'

import { ColorsEnum, getShadow, getSpacing, padding } from 'ui/theme'

type Props = {
  isError?: boolean
  isFocus?: boolean
  inputHeight?: 'small' | 'tall'
}

const defaultProps: Props = {
  isError: false,
  isFocus: false,
  inputHeight: 'small',
}

export const InputContainer: React.FC<Props> = (props) => {
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

InputContainer.defaultProps = defaultProps

const StyledView = styled.View<{
  height: Props['inputHeight']
  borderColor: ColorsEnum
}>((props) => ({
  width: '100%',
  height: props.height === 'tall' ? getSpacing(12) : getSpacing(10),
  flexDirection: 'row',
  alignItems: 'center',
  ...padding(1, 4),
  borderRadius: 22,
  border: `solid 1px ${props.borderColor}`,
  backgroundColor: ColorsEnum.WHITE,
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 6,
    shadowColor: ColorsEnum.BLACK,
    shadowOpacity: 0.15,
  }),
}))
