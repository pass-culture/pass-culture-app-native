type Args = {
  title: string
  subtitle?: string
  label?: string
}

export const getHighlightAccessibilityLabel = ({ title, subtitle, label }: Args) => {
  const accessibilityLabel = `Découvre le temps fort "${title}"`

  const accessibilityLabelWithSubtitle = subtitle
    ? `${accessibilityLabel} ${subtitle}`
    : accessibilityLabel

  const fullAccessibilityLabel = label
    ? `${accessibilityLabelWithSubtitle} sur le thème "${label}"`
    : accessibilityLabelWithSubtitle

  return `${fullAccessibilityLabel}.`
}
