import { Text as RNText } from 'react-native'
import styled from 'styled-components/native'

// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'
import { TextColorKey } from 'theme/types'
import { isHeadingLevel } from 'ui/theme/isHeadingLevel'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'
import { TextSemanticLevel } from 'ui/theme/typographyAttrs/types'

const DEFAULT_COLOR_TEXT = 'default'

const createStyledText = (
  typographyStyle: keyof typeof theme.designSystem.typography,
  defaultLevel?: TextSemanticLevel
) => {
  return styled(RNText).attrs<{ accessibilityLevel?: TextSemanticLevel }>(
    ({ accessibilityLevel }) => {
      const level = accessibilityLevel ?? defaultLevel
      if (isHeadingLevel(level)) return setTextSemantic(level)
      return setTextSemantic('p')
    }
  )<{ color?: TextColorKey }>(({ theme, color }) => ({
    ...theme.designSystem.typography[typographyStyle],
    color: theme.designSystem.color.text[color ?? DEFAULT_COLOR_TEXT],
  }))
}

export const Typo = {
  Title1: createStyledText('title1', 'h1'),
  Title2: createStyledText('title2', 'h2'),
  Title3: createStyledText('title3', 'h3'),
  Title4: createStyledText('title4', 'h4'),
  Body: createStyledText('body'),
  BodyS: createStyledText('bodyS'),
  BodyXs: createStyledText('bodyXs'),
  BodyAccent: createStyledText('bodyAccent'),
  BodyAccentS: createStyledText('bodyAccentS'),
  BodyAccentXs: createStyledText('bodyAccentXs'),
  BodyItalic: createStyledText('bodyItalic'),
  BodyItalicAccent: createStyledText('bodyItalicAccent'),
  Button: createStyledText('button'),
  ButtonS: createStyledText('buttonS'),
}
