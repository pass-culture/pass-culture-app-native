import styled from 'styled-components/native'

import { ColorsEnum } from './colors'
import { getSpacing } from './spacing'

export enum fontWeight {
  EXTRA_BOLD = 800,
  BOLD = 'bold',
  SEMI_BOLD = 600,
  MEDIUM = 500,
  NORMAL = 'normal',
}
interface TextProp {
  color?: ColorsEnum
}
const ColoredText = styled.Text<TextProp>(({ color }) => ({
  color: color ?? ColorsEnum.BLACK,
}))

const Hero = styled(ColoredText)({
  fontFamily: 'Montserrat-Medium',
  fontSize: getSpacing(9.5),
  fontWeight: fontWeight.MEDIUM,
  lineHeight: getSpacing(12),
})

const Title1 = styled(ColoredText)({
  fontFamily: 'Montserrat-ExtraBoldItalic',
  fontSize: getSpacing(7),
  fontWeight: fontWeight.EXTRA_BOLD,
  lineHeight: getSpacing(8.5),
})

const Title2 = styled(ColoredText)({
  fontFamily: 'Montserrat-MediumItalic',
  fontSize: getSpacing(6),
  fontWeight: fontWeight.MEDIUM,
  lineHeight: getSpacing(7),
})

const Title3 = styled(ColoredText)({
  fontFamily: 'Montserrat-Bold',
  fontSize: getSpacing(5),
  fontWeight: fontWeight.BOLD,
  lineHeight: getSpacing(6),
})

const Title4 = styled(ColoredText)({
  fontFamily: 'Montserrat-Medium',
  fontSize: getSpacing(4.5),
  fontWeight: fontWeight.MEDIUM,
  lineHeight: getSpacing(5.5),
})

const ButtonText = styled(ColoredText)({
  fontFamily: 'Montserrat-Bold',
  fontSize: getSpacing(3.75),
  fontWeight: fontWeight.BOLD,
  lineHeight: getSpacing(5),
})

const Body = styled(ColoredText)({
  fontFamily: 'Montserrat-Regular',
  fontSize: getSpacing(3.75),
  fontWeight: fontWeight.NORMAL,
  lineHeight: getSpacing(5),
})
const Caption = styled(ColoredText)({
  fontFamily: 'Montserrat-SemiBold',
  fontSize: getSpacing(3),
  fontWeight: fontWeight.SEMI_BOLD,
  lineHeight: getSpacing(4),
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
