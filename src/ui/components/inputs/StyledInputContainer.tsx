import React from 'react'
import styled from 'styled-components/native'

import { ColorsEnum, getShadow, getSpacing, padding } from 'ui/theme'

type Props = {
  isError?: boolean
  isFocus?: boolean
  inputHeight?: 'small' | 'tall'
  isInputDisabled?: boolean
}

const defaultProps: Props = {
  isError: false,
  isFocus: false,
  inputHeight: 'small',
  isInputDisabled: false,
}

export const StyledInputContainer: React.FC<Props> = (props) => {
  let borderColor = ColorsEnum.GREY_MEDIUM
  if (props.isFocus) {
    borderColor = ColorsEnum.PRIMARY
  } else if (props.isError) {
    borderColor = ColorsEnum.ERROR
  }

  return (
    <StyledView
      height={props.inputHeight}
      borderColor={borderColor}
      isInputDisabled={props.isInputDisabled}>
      {props.children}
    </StyledView>
  )
}

StyledInputContainer.defaultProps = defaultProps

const StyledView = styled.View<{
  height: Props['inputHeight']
  borderColor: ColorsEnum
  isInputDisabled?: boolean
}>(({ height, borderColor, isInputDisabled, theme }) => ({
  width: '100%',
  height: height === 'tall' ? getSpacing(12) : getSpacing(10),
  flexDirection: 'row',
  alignItems: 'center',
  ...padding(1, 4),
  borderRadius: 22,
  border: isInputDisabled ? undefined : `solid 1px ${borderColor}`,
  backgroundColor: isInputDisabled ? theme.colors.greyLight : theme.colors.white,
  ...(!isInputDisabled
    ? getShadow({
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowRadius: 6,
        shadowColor: theme.colors.black,
        shadowOpacity: 0.15,
      })
    : {}),
}))
