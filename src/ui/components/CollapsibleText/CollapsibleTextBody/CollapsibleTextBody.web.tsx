import React, { FunctionComponent, PropsWithChildren } from 'react'
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
  const textRef = React.useRef(null)

  const handleOnLayout = (event: LayoutChangeEvent) => {
    const elmt = textRef.current
    if (!elmt) {
      return
    }

    // Since we are on web side we have to force the type of the ref to HTMLElement
    const textElement = elmt as unknown as HTMLElement
    const lineHeight = parseFloat(getComputedStyle(textElement).lineHeight)
    const numberOfLines = Math.floor(event.nativeEvent.layout.height / lineHeight)

    onTextLayout?.({
      nativeEvent: {
        lines: Array.from({ length: numberOfLines }).map(() => ({ height: lineHeight })),
      },
    } as NativeSyntheticEvent<TextLayoutEventData>)
  }

  return (
    <Typo.Body onLayout={handleOnLayout} numberOfLines={numberOfLines} ref={textRef}>
      {children}
    </Typo.Body>
  )
}
