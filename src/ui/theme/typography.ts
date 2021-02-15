import styled from 'styled-components/native'

import { ColorsEnum } from './colors'
import { getGrid, Axis } from './grid'
import { getSpacing, getSpacingString } from './spacing'

interface TextProp {
  color?: ColorsEnum
}
const ColoredText = styled.Text<TextProp>(({ color }) => ({
  color: color ?? ColorsEnum.BLACK,
}))

const Hero = styled(ColoredText)({
  fontFamily: 'Montserrat-Medium',
  fontSize: getSpacing(9.5),
  lineHeight: getSpacingString(12),
})

const Title1 = styled(ColoredText)({
  fontFamily: 'Montserrat-ExtraBoldItalic',
  fontSize: getSpacing(getGrid({ default: 7, sm: 6 }, Axis.HEIGHT)),
  lineHeight: getSpacingString(8.5),
})

const Title2 = styled(ColoredText)({
  fontFamily: 'Montserrat-MediumItalic',
  fontSize: getSpacing(getGrid({ default: 6, sm: 5.5 }, Axis.HEIGHT)),
  lineHeight: getSpacingString(7),
})

const Title3 = styled(ColoredText)({
  fontFamily: 'Montserrat-Bold',
  fontSize: getSpacing(5),
  lineHeight: getSpacingString(6),
})

const Title4 = styled(ColoredText)({
  fontFamily: 'Montserrat-Medium',
  fontSize: getSpacing(4.5),
  lineHeight: getSpacingString(5.5),
})

const ButtonText = styled(ColoredText)({
  fontFamily: 'Montserrat-Bold',
  fontSize: getSpacing(3.75),
  lineHeight: getSpacingString(5),
})

const Body = styled(ColoredText)({
  fontFamily: 'Montserrat-Regular',
  fontSize: getSpacing(3.75),
  lineHeight: getSpacingString(5),
})

const Caption = styled(ColoredText)({
  fontFamily: 'Montserrat-SemiBold',
  fontSize: getSpacing(3),
  lineHeight: getSpacingString(4),
})

export const Typo = {
  Hero,
  Title1,
  Title2,
  Title3,
  Title4,
  ButtonText,
  Body,
  Caption,
}
