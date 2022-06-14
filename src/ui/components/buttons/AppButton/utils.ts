interface Props {
  buttonHeight: number
  borderRadius: number
}

export const getEffectiveBorderRadius = ({ buttonHeight, borderRadius }: Props) => {
  return Math.min(borderRadius, buttonHeight / 2)
}
