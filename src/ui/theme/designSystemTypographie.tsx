import { Text as RNText } from 'react-native'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { getHeadingAttrs, HeadingLevel } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const createStyledText = (
  typographyStyle: keyof typeof theme.designSystem.typography,
  headingLevel?: HeadingLevel
) => {
  const getAttributes =
    headingLevel === undefined ? () => ({}) : () => getHeadingAttrs(headingLevel)

  return styled(RNText).attrs(getAttributes)(
    ({ theme }) => theme.designSystem.typography[typographyStyle]
  )
}

const Title1 = createStyledText('title1', 1)
const Title2 = createStyledText('title2', 2)
const Title3 = createStyledText('title3', 3)
const Title4 = createStyledText('title4', 4)
const Body = createStyledText('body')
const BodyS = createStyledText('bodyS')
const BodyXs = createStyledText('bodyXs')
const BodySemiBold = createStyledText('bodySemiBold')
const BodySemiBoldS = createStyledText('bodySemiBoldS')
const BodySemiBoldXs = createStyledText('bodySemiBoldXs')
const BodyItalic = createStyledText('bodyItalic')
const BodyItalicSemiBold = createStyledText('bodyItalicSemiBold')
const Button = createStyledText('button')

export const TypoDS = {
  Title1,
  Title2,
  Title3,
  Title4,
  Body,
  BodyS,
  BodyXs,
  BodySemiBold,
  BodySemiBoldS,
  BodySemiBoldXs,
  BodyItalic,
  BodyItalicSemiBold,
  Button,
}
