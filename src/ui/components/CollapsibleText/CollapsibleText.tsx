import React, { useEffect, useRef, useState } from 'react'
import { Platform, Text, View } from 'react-native'
import styled from 'styled-components/native'

import { focusElement } from 'shared/accessibility/helpers/focusElement'
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

export function CollapsibleText({ text, maxChars = 250, onAdditionalPress, children }: Props) {
  const [expanded, setExpanded] = useState(false)
  const expandedTextRef = useRef<Text>(null)

  const isTruncated = text.length > maxChars
  const cutIndex = getCutIndex(text, maxChars)
  const collapsedText = `${text.slice(0, cutIndex)}…`

  const buttonIcon = expanded ? ArrowUp : ArrowDown
  const buttonText = expanded ? 'Voir moins' : 'Voir plus'
  const buttonAccessibleHint = expanded ? 'Réduire le texte' : 'Déplier le texte'

  const onPress = () => {
    setExpanded((prev) => !prev)
    onAdditionalPress?.()
  }

  const focusExpandedText = () => {
    focusElement(expandedTextRef)
  }

  useEffect(
    function focusExpandedTextOnExpand() {
      if (!expanded || !isTruncated) return

      const timer = setTimeout(focusExpandedText, 150)
      return () => clearTimeout(timer)
    },
    [expanded, isTruncated]
  )

  return (
    <View>
      {expanded ? (
        // Make the text programmatically focusable on web without adding it to the tab order.
        <Markdown ref={expandedTextRef} tabIndex={Platform.OS === 'web' ? -1 : undefined}>
          {text}
        </Markdown>
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
