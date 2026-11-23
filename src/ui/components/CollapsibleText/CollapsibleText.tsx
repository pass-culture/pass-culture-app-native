import React, { useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ExpandedText } from 'ui/components/CollapsibleText/ExpandedText'
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

export function CollapsibleText({
  text: rawText,
  maxChars = 250,
  onAdditionalPress,
  children,
}: Props) {
  const [expanded, setExpanded] = useState(false)

  const text = rawText.trim()
  const isTruncated = text.length > maxChars
  const cutIndex = getCutIndex(text, maxChars)
  const firstPart = text.slice(0, cutIndex)
  const secondPart = text.slice(cutIndex)
  const collapsedText = `${firstPart}…`

  const buttonIcon = expanded ? ArrowUp : ArrowDown
  const buttonText = expanded ? 'Voir moins' : 'Voir plus'
  const buttonAccessibleHint = expanded ? 'Réduire le texte' : 'Déplier le texte'

  const onPress = () => {
    setExpanded((prev) => !prev)
    onAdditionalPress?.()
  }

  return (
    <View>
      {expanded ? (
        <ExpandedText firstPart={firstPart} secondPart={secondPart} />
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
