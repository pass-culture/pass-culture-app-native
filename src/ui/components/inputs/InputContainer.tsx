import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, getShadow, getSpacing, padding } from 'ui/theme'

type Props = {
  isError?: boolean
  isFocus?: boolean
}

export const InputContainer = styled.View(function ({ isError = false, isFocus = false }: Props) {
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
    height: getSpacing(10),
    maxWidth,
    flexDirection: 'row' as const, // for some reason we have an unsolvable type issue without this casting
    alignItems: 'center',
    ...padding(1, 4),
    borderRadius: 22,
    border: `solid 1px ${borderColor}`,
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
  }
})
