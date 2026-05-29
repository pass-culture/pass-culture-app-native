import React, { useEffect, useRef, useState } from 'react'
import { AccessibilityInfo, findNodeHandle, View } from 'react-native'
import styled from 'styled-components/native'

import { Markdown } from 'ui/components/Markdown/Markdown'
import { Button } from 'ui/designSystem/Button/Button'
import { ArrowDown } from 'ui/svg/icons/ArrowDown'
import { ArrowUp } from 'ui/svg/icons/ArrowUp'

type Props = {
  text: string
  maxChars?: number
  onAdditionalPress?: () => void
  children?: React.ReactNode
}

function getCutIndex(text: string, maxChars: number) {
  if (text.length <= maxChars) return text.length
  const truncated = text.slice(0, maxChars)
  const lastSpace = truncated.lastIndexOf(' ')
  return lastSpace > 0 ? lastSpace : maxChars
}

function getContinuationA11yLabel(text: string, cutIndex: number) {
  const continuation = text.slice(cutIndex).trim()
  if (!continuation) return text
  return continuation
}

export function CollapsibleText({ text, maxChars = 250, onAdditionalPress, children }: Props) {
  const [expanded, setExpanded] = useState(false)
  const continuationFocusRef = useRef<View>(null)

  const isTruncated = text.length > maxChars
  const cutIndex = getCutIndex(text, maxChars)

  const firstPart = text.slice(0, cutIndex)
  const secondPart = text.slice(cutIndex)
  const collapsedText = `${firstPart}…`

  const continuationA11yLabel = getContinuationA11yLabel(text, cutIndex)

  const buttonIcon = expanded ? ArrowUp : ArrowDown
  const buttonText = expanded ? 'Voir moins' : 'Voir plus'
  const buttonAccessibleHint = expanded ? 'Réduire le texte' : 'Déplier le texte'

  const onPress = () => {
    setExpanded((prev) => !prev)
    if (onAdditionalPress) onAdditionalPress()
  }

  useEffect(() => {
    if (!expanded || !isTruncated) return

    const timer = setTimeout(() => {
      const reactTag = findNodeHandle(continuationFocusRef.current)
      if (reactTag) {
        AccessibilityInfo.setAccessibilityFocus(reactTag)
      }
    }, 150)

    return () => clearTimeout(timer)
  }, [expanded, isTruncated])

  return (
    <View>
      {expanded ? (
        <View>
          <Markdown>{firstPart}</Markdown>
          <View
            ref={continuationFocusRef}
            accessible
            accessibilityRole="text"
            accessibilityLabel={continuationA11yLabel}>
            <Markdown>{secondPart}</Markdown>
          </View>
        </View>
      ) : (
        <Markdown>{isTruncated ? collapsedText : text}</Markdown>
      )}

      {expanded && children ? children : null}

      {isTruncated ? (
        <ButtonContainer>
          <Button
            accessibilityHint={buttonAccessibleHint}
            wording={buttonText}
            onPress={onPress}
            icon={buttonIcon}
            variant="tertiary"
            color="neutral"
          />
        </ButtonContainer>
      ) : null}
    </View>
  )
}

const ButtonContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginTop: theme.designSystem.size.spacing.m,
}))
