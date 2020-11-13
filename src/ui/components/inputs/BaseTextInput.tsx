import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, getSpacingString, fontWeight } from 'ui/theme'

export const BaseTextInput = styled.TextInput.attrs({
  placeholderTextColor: ColorsEnum.GREY_DARK,
})({
  flex: 1,
  padding: 0,
  color: ColorsEnum.BLACK,
  fontFamily: 'Montserrat-Regular',
  fontWeight: fontWeight.NORMAL,
  fontSize: getSpacing(3.75),
  lineHeight: getSpacingString(5),
})
