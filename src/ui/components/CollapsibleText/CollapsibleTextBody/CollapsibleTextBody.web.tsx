import React, { FunctionComponent, PropsWithChildren, useRef } from 'react'
import { LayoutChangeEvent, NativeSyntheticEvent, TextLayoutEventData } from 'react-native'

import { Typo } from 'ui/theme'

type Props = {
  numberOfLines?: number
  onTextLayout?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void
} & PropsWithChildren

export const CollapsibleTextBody: FunctionComponent<Props> = ({
  children,
  onTextLayout,
  numberOfLines,
}) => {
  const textRef = useRef(null)
  const numLines = useRef(0)

  const handleOnLayout = (event: LayoutChangeEvent) => {
    const elmt = textRef.current

    if (!elmt || numLines.current) {
      return
    }

    // Since we are on web side we have to force the type of the ref to HTMLElement
    const textElement = elmt as unknown as HTMLElement
    const lineHeight = parseFloat(getComputedStyle(textElement).lineHeight)
    const numberOfLines = Math.round(event.nativeEvent.layout.height / lineHeight)

    onTextLayout?.({
      nativeEvent: {
        lines: Array.from({ length: numberOfLines }).map(() => ({ height: lineHeight })),
      },
      // We dont want all the properties of the event, just the lines, so we cast it to the specific type
    } as NativeSyntheticEvent<TextLayoutEventData>)

    numLines.current = numberOfLines
  }

  return (
    <Typo.Body onLayout={handleOnLayout} numberOfLines={numberOfLines} ref={textRef}>
      {children}
    </Typo.Body>
  )
}
