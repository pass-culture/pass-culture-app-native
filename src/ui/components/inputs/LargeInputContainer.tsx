import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, padding } from 'ui/theme'

type Props = {
  isError?: boolean
  isFocus?: boolean
  inputHeight?: number
}

export const LargeInputContainer = styled.View(function ({
  isError = false,
  isFocus = false,
  inputHeight,
}: Props) {
  const screenWidth = Dimensions.get('screen').width
  const maxWidth = screenWidth * 0.9

  let borderColor = ColorsEnum.GREY_MEDIUM
  if (isFocus) {
    borderColor = ColorsEnum.PRIMARY
  } else if (isError) {
    borderColor = ColorsEnum.ERROR
  }

  return {
    width: '100%',
    height: inputHeight ?? getSpacing(23.5),
    maxWidth,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...padding(2, 3),
    borderRadius: 16,
    border: `solid 1px ${borderColor}`,
    backgroundColor: ColorsEnum.WHITE,
  }
})
