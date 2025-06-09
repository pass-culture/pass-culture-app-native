import React, { PropsWithChildren, useState } from 'react'
import { NativeSyntheticEvent, TextLayoutEventData } from 'react-native'
import styled from 'styled-components/native'

import { CollapsibleTextBody } from 'ui/components/CollapsibleText/CollapsibleTextBody/CollapsibleTextBody'
import { CollapsibleTextButton } from 'ui/components/CollapsibleText/CollapsibleTextButton/CollapsibleTextButton'

type CollapsibleTextProps = {
  // Minimum number of lines when collapsible is collapsed.
  numberOfLines: number
} & PropsWithChildren

export function CollapsibleText({ numberOfLines, children }: Readonly<CollapsibleTextProps>) {
  const [defaultLinesCount, setDefaultLinesCount] = useState<number>()
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const handleOnTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    if (!defaultLinesCount && event.nativeEvent.lines.length) {
      setDefaultLinesCount(event.nativeEvent.lines.length)
    }
  }

  const handleExpandButtonPress = () => {
    setIsExpanded((prevExpanded) => !prevExpanded)
  }

  const getNumberOfLines = () => {
    if (!defaultLinesCount) {
      return undefined
    }
    return isExpanded ? undefined : numberOfLines
  }

  const isCollapsible = defaultLinesCount && defaultLinesCount > numberOfLines

  return (
    <Container visibility={defaultLinesCount ? 'visible' : 'hidden'}>
      <CollapsibleTextBody onTextLayout={handleOnTextLayout} numberOfLines={getNumberOfLines()}>
        {children}
      </CollapsibleTextBody>
      {isCollapsible ? (
        <CollapsibleTextButton expanded={isExpanded} onPress={handleExpandButtonPress} />
      ) : null}
    </Container>
  )
}

const Container = styled.View<{ visibility: 'hidden' | 'visible' }>(({ visibility }) => ({
  visibility,
  position: visibility === 'hidden' ? 'absolute' : 'relative',
  transform: visibility === 'hidden' ? 'translateX(-9999px)' : undefined,
}))
