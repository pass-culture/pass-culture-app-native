import { Text as RNText } from 'react-native'
import styled from 'styled-components/native'

// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'
import { TextColorKey } from 'theme/types'
import { isHeadingLevel } from 'ui/theme/isHeadingLevel'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { HeadingLevel } from 'ui/theme/typographyAttrs/types'

const DEFAULT_COLOR_TEXT = 'default'

type HeadingProps = {
  accessibilityLevel?: HeadingLevel
  noHeading?: boolean
}

const createStyledText = (
  typographyStyle: keyof typeof theme.designSystem.typography,
  defaultLevel?: HeadingLevel
) => {
  return styled(RNText).attrs<{ accessibilityLevel?: HeadingLevel }>(({ accessibilityLevel }) => {
    if (isHeadingLevel(accessibilityLevel)) return getHeadingAttrs(accessibilityLevel)
    else if (isHeadingLevel(defaultLevel)) return getHeadingAttrs(defaultLevel)
    return {}
  })<{ color?: TextColorKey }>(({ theme, color }) => ({
    ...theme.designSystem.typography[typographyStyle],
    color: theme.designSystem.color.text[color ?? DEFAULT_COLOR_TEXT],
  }))
}

export const Typo = {
  Title1: createStyledText('title1', 1),
  Title2: createStyledText('title2', 2),
  Title3: createStyledText('title3', 3),
  Title4: createStyledText('title4', 4),
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
