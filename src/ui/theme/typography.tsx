import { Text as RNText } from 'react-native'
import styled from 'styled-components/native'

// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'
import { TextColorKey } from 'theme/types'
import { getHeadingAttrs, HeadingLevel } from 'ui/theme/typographyAttrs/getHeadingAttrs'

// Function to validate if a value is a HeadingLevel valid to correct typing
const isHeadingLevel = (level: unknown): level is HeadingLevel => {
  return typeof level === 'number' && [1, 2, 3, 4, 5, 6].includes(level)
}

const DEFAULT_COLOR_TEXT = 'default'

const createStyledText = (
  typographyStyle: keyof typeof theme.designSystem.typography,
  defaultLevel?: HeadingLevel
) => {
  return styled(RNText).attrs<{ accessibilityLevel?: HeadingLevel }>(({ accessibilityLevel }) => {
    if (isHeadingLevel(accessibilityLevel)) {
      return getHeadingAttrs(accessibilityLevel)
    } else if (isHeadingLevel(defaultLevel)) {
      return getHeadingAttrs(defaultLevel)
    }
    return {}
  })<{ color?: TextColorKey }>(({ theme, color }) => ({
    ...theme.designSystem.typography[typographyStyle],
    color: theme.designSystem.color.text[color ?? DEFAULT_COLOR_TEXT],
  }))
}

const Title1 = createStyledText('title1', 1)
const Title2 = createStyledText('title2', 2)
const Title3 = createStyledText('title3', 3)
const Title4 = createStyledText('title4', 4)
const Body = createStyledText('body')
const BodyS = createStyledText('bodyS')
const BodyXs = createStyledText('bodyXs')
const BodyAccent = createStyledText('bodyAccent')
const BodyAccentS = createStyledText('bodyAccentS')
const BodyAccentXs = createStyledText('bodyAccentXs')
const BodyItalic = createStyledText('bodyItalic')
const BodyItalicAccent = createStyledText('bodyItalicAccent')
const Button = createStyledText('button')
const ButtonS = createStyledText('buttonS')

export const Typo = {
  Title1,
  Title2,
  Title3,
  Title4,
  Body,
  BodyS,
  BodyXs,
  BodyAccent,
  BodyAccentS,
  BodyAccentXs,
  BodyItalic,
  BodyItalicAccent,
  Button,
  ButtonS,
}
