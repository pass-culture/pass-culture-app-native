const MAX_LINE_LENGTH = 17

export const getSubcategoryLabelParts = (label: string): readonly string[] | undefined => {
  if (!label) return undefined

  // 2. Découpage sémantique prioritaire autour des séparateurs (ex: "Cinéma & Séries", "Musique et Concerts")
  const separatorMatch = /\s(&|et|aux)\s/i.exec(label)
  if (separatorMatch) {
    const firstPart = label.slice(0, separatorMatch.index).trim()
    const secondPart = label.slice(separatorMatch.index).trim()

    // Si les deux parties respectent déjà le max de 17 caractères, on valide ce découpage
    if (firstPart.length <= MAX_LINE_LENGTH && secondPart.length <= MAX_LINE_LENGTH) {
      return [firstPart, secondPart]
    }
  }

  // 3. Si le texte complet tient sur une ligne (<= 17 caractères), pas besoin de découper
  if (label.length <= MAX_LINE_LENGTH) {
    return undefined
  }

  // 4. Fallback : Découpage intelligent mot par mot sans dépasser 17 caractères par ligne
  const words = label.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word

    if (testLine.length <= MAX_LINE_LENGTH) {
      currentLine = testLine
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines.length > 1 ? lines : undefined
}
