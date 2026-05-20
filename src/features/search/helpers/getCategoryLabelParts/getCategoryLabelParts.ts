export const getCategoryLabelParts = (label: string): readonly string[] | undefined => {
  const onlineEventLabelMatch = /^(év[èé]nements?)\s(en ligne)$/i.exec(label)

  if (onlineEventLabelMatch) {
    const firstPart = onlineEventLabelMatch[1]
    const secondPart = onlineEventLabelMatch[2]

    return firstPart && secondPart ? [firstPart, secondPart] : undefined
  }

  const separatorMatch = /\s(&|et)\s/i.exec(label)

  if (!separatorMatch) return undefined

  const firstPart = label.slice(0, separatorMatch.index).trim()
  const secondPart = label.slice(separatorMatch.index).trim()

  return firstPart && secondPart ? [firstPart, secondPart] : undefined
}
