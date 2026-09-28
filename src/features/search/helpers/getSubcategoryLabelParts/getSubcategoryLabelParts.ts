const MAX_LINE_LENGTH = 17

const LABEL_EXCEPTIONS: Record<string, readonly string[]> = {
  'Evènements cinéma': ['Evènements', 'cinéma'],
}

const splitBySeparator = (label: string): readonly string[] | undefined => {
  const match = /\s(&|et|aux)\s/i.exec(label)
  if (!match) return undefined

  const firstPart = label.slice(0, match.index).trim()
  const secondPart = label.slice(match.index).trim()

  if (firstPart.length <= MAX_LINE_LENGTH && secondPart.length <= MAX_LINE_LENGTH) {
    return [firstPart, secondPart]
  }

  return undefined
}

const wrapWords = (label: string): readonly string[] => {
  const lines: string[] = []
  let currentLine = ''

  for (const word of label.split(' ')) {
    const candidate = currentLine ? `${currentLine} ${word}` : word

    if (candidate.length <= MAX_LINE_LENGTH) {
      currentLine = candidate
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }
  if (currentLine) lines.push(currentLine)

  return lines
}

export const getSubcategoryLabelParts = (label: string): readonly string[] | undefined => {
  if (!label) return undefined
  if (LABEL_EXCEPTIONS[label]) return LABEL_EXCEPTIONS[label]
  if (label.length <= MAX_LINE_LENGTH) return undefined

  const partsFromSeparator = splitBySeparator(label)
  if (partsFromSeparator) return partsFromSeparator

  const lines = wrapWords(label)
  return lines.length > 1 ? lines : undefined
}
