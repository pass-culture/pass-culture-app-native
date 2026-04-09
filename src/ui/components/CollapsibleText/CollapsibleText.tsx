import React, { useState } from 'react'
import { View } from 'react-native'
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

function truncateText(text: string, maxChars: number) {
  if (text.length <= maxChars) return text
  const truncated = text.slice(0, maxChars)
  const lastSpace = truncated.lastIndexOf(' ')
  return truncated.slice(0, lastSpace) + '…'
}

export function CollapsibleText({ text, maxChars = 250, onAdditionalPress, children }: Props) {
  const [expanded, setExpanded] = useState(false)
  const isTruncated = text.length > maxChars
  const collapsedText = truncateText(text, maxChars)

  const buttonIcon = expanded ? ArrowUp : ArrowDown
  const buttonText = expanded ? 'Voir moins' : 'Voir plus'
  const buttonAccessibleHint = expanded
    ? 'Réduire le texte'
    : 'Une fois déplié, revenir en arrière pour lire tout le texte'

  const onPress = () => {
    setExpanded((prev) => !prev)
    if (onAdditionalPress) onAdditionalPress()
  }

  return (
    <View>
      {expanded ? <Markdown>{text}</Markdown> : <Markdown>{collapsedText}</Markdown>}

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
