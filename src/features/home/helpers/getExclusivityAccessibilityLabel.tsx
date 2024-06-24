type Args = {
  offerName: string
  offerCategory: string
  offerDate?: string
  offerPrice?: string
  offerDistance?: string
}

export const getExclusivityAccessibilityLabel = ({
  offerName,
  offerCategory,
  offerDate,
  offerPrice,
  offerDistance,
}: Args) => {
  const accessibilityLabel = `Découvre l’offre exclusive "${offerName}" de la catégorie "${offerCategory}".`

  const accessibilityLabelWithDate = offerDate
    ? `${accessibilityLabel} Date\u00a0: ${offerDate}.`
    : accessibilityLabel

  const labelWithDateAndPrice = offerPrice
    ? `${accessibilityLabelWithDate} Prix\u00a0: ${offerPrice}.`
    : accessibilityLabelWithDate

  const fullAccessibilityLabel = offerDistance
    ? `${labelWithDateAndPrice} Distance\u00a0: ${offerDistance}.`
    : labelWithDateAndPrice

  return fullAccessibilityLabel
}
