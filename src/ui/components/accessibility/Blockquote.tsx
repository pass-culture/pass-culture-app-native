import React from 'react'
import { Platform } from 'react-native'

import { Typo } from 'ui/theme'

type Props = {
  text: string
  cite?: string
  TextComponent: (typeof Typo)[keyof typeof Typo]
}

export const Blockquote = ({ text, cite, TextComponent }: Props) => {
  const quote = <TextComponent>{text}</TextComponent>

  return Platform.OS === 'web' ? <blockquote cite={cite}>{quote}</blockquote> : quote
}
