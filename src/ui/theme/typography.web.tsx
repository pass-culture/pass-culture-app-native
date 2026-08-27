import React, { useCallback, useRef } from 'react'
import styled from 'styled-components'

// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'
import { TextColorKey } from 'theme/types'
import { isHeadingLevel } from 'ui/theme/isHeadingLevel'
import { TextSemanticLevel } from 'ui/theme/typographyAttrs/types'

type WebLayoutChangeEvent = {
  nativeEvent: { layout: { x: number; y: number; width: number; height: number } }
}

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
    onLayout?: (event: WebLayoutChangeEvent) => void
  }

  const Component = ({ accessibilityLevel, numberOfLines, onLayout, ...props }: Props) => {
    const level = accessibilityLevel ?? defaultLevel
    let tag: React.ElementType = 'p'
    if (level === 'span') tag = 'span'
    else if (isHeadingLevel(level)) tag = level

    const observerRef = useRef<ResizeObserver | null>(null)

    const setRef = useCallback(
      (node: HTMLElement | null) => {
        if (observerRef.current) {
          observerRef.current.disconnect()
          observerRef.current = null
        }

        if (node && onLayout) {
          const emit = () => {
            const rect = node.getBoundingClientRect()
            onLayout({
              nativeEvent: {
                layout: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
              },
            })
          }
          emit() // equivalent to the first onLayout call upon mounting on the RN side
          observerRef.current = new ResizeObserver(emit)
          observerRef.current.observe(node)
        }
      },
      [onLayout]
    )

    return <StyledText as={tag} ref={setRef} numberOfLines={numberOfLines} {...props} />
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
