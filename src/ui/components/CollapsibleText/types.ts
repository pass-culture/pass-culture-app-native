import { LayoutChangeEvent, NativeSyntheticEvent, TextLayoutEventData } from 'react-native'

export type IsTextEllipsisOutput = {
  isTextEllipsis: boolean
  onTextLayout?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void
  onLayout?: (event: LayoutChangeEvent) => void
}
