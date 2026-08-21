import React from 'react'
import styled from 'styled-components'

// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'
import { TextColorKey } from 'theme/types'
import { isHeadingLevel } from 'ui/theme/isHeadingLevel'
import { TextSemanticLevel } from 'ui/theme/typographyAttrs/types'

const DEFAULT_COLOR_TEXT = 'default'

const createStyledText = (
  typographyStyle: keyof typeof theme.designSystem.typography,
  defaultLevel?: TextSemanticLevel
) => {
  const StyledText = styled.p<{ theme; color?: TextColorKey; numberOfLines?: number }>(
    ({ theme, color, numberOfLines }) => ({
      display: 'inline',
      textAlign: 'left',
      overflowWrap: 'anywhere',
      whiteSpace: 'pre-line',
      color: theme.designSystem.color.text[color ?? DEFAULT_COLOR_TEXT],
      ...theme.designSystem.typography[typographyStyle],
      ...(numberOfLines
        ? {
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: numberOfLines,
          }
        : {}),
    })
  )

  type Props = React.ComponentPropsWithoutRef<typeof StyledText> & {
    accessibilityLevel?: TextSemanticLevel
    numberOfLines?: number
    color?: TextColorKey
  }

  const Component = ({ accessibilityLevel, numberOfLines, ...props }: Props) => {
    const level = accessibilityLevel ?? defaultLevel
    let tag: React.ElementType = 'p'
    if (level === 'span') tag = 'span'
    else if (isHeadingLevel(level)) tag = level
    return <StyledText as={tag} numberOfLines={numberOfLines} {...props} />
  }

  Component.displayName = typographyStyle
  return Component
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
