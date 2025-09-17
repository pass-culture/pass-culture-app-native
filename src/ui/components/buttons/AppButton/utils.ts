interface Props {
  buttonHeight: number
  borderRadius: number
  shouldConvertRemToPx?: boolean
}

export const getEffectiveBorderRadius = ({ buttonHeight, borderRadius }: Props) => {
  return Math.min(borderRadius, buttonHeight / 2)
}
