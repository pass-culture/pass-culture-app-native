import React, { useRef } from 'react'
import { Text } from 'react-native'

import { ExpandedTextProps } from 'ui/components/CollapsibleText/types'
import { useFocusOnMount } from 'ui/components/CollapsibleText/useFocusOnMount'
import { Markdown } from 'ui/components/Markdown/Markdown'

export function ExpandedText({ firstPart, secondPart }: ExpandedTextProps) {
  const continuationRef = useRef<Text>(null)
  useFocusOnMount(continuationRef)

  return (
    <Text>
      <Markdown>{firstPart}</Markdown>
      <Markdown ref={continuationRef} tabIndex={-1}>
        {secondPart}
      </Markdown>
    </Text>
  )
}
