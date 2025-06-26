import { Platform } from 'react-native'

type HoverStyleOptions = {
  isHover?: boolean
  textColor?: string
  underlineColor?: string
  borderColor?: string
  backgroundColor?: string
}

type HoverCSSProperties = {
  color?: string
  textDecoration?: 'underline' | 'none'
  textDecorationColor?: string
  borderColor?: string
  backgroundColor?: string
}

export const getHoverStyle = ({
  isHover,
  textColor,
  underlineColor,
  borderColor,
  backgroundColor,
}: HoverStyleOptions) => {
  if (Platform.OS !== 'web') return {}

  const hasAtLeastOne = textColor || underlineColor || borderColor || backgroundColor

  if (!hasAtLeastOne) return {}

  const hoverStyle: HoverCSSProperties = {}

  if (textColor) {
    hoverStyle.color = textColor
  }

  if (underlineColor) {
    hoverStyle.textDecoration = 'underline'
    hoverStyle.textDecorationColor = underlineColor
  }

  if (borderColor) {
    hoverStyle.borderColor = borderColor
  }

  if (backgroundColor) {
    hoverStyle.backgroundColor = backgroundColor
  }

  if (isHover === undefined) {
    return {
      ['&:hover']: {
        ...hoverStyle,
        ['&:disabled']: {
          textDecoration: 'none',
          color: undefined,
          borderColor: undefined,
          backgroundColor: undefined,
        },
      },
    }
  }

  return isHover ? hoverStyle : {}
}
