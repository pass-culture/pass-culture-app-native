interface Props {
  buttonHeight: number
  borderRadius: number
}

export const getEffectiveBorderRadius = ({ buttonHeight, borderRadius }: Props) => {
  const effectiveBorderRadius = Math.min(borderRadius, buttonHeight / 2)
  return effectiveBorderRadius
}
