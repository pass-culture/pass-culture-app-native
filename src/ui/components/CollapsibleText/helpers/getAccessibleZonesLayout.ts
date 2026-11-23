type TextLine = {
  text: string
  y: number
  height: number
}

export type ZoneLayout = {
  top: number
  height: number
}

export type AccessibleZonesLayout = {
  firstZone: ZoneLayout
  secondZone: ZoneLayout
}

export const getAccessibleZonesLayout = (
  lines: TextLine[],
  firstPartLength: number
): AccessibleZonesLayout | undefined => {
  const lastLine = lines.at(-1)
  if (!lastLine) return undefined

  const totalHeight = lastLine.y + lastLine.height

  let renderedLength = 0
  let cutLineIndex = lines.length - 1
  for (const [index, line] of lines.entries()) {
    renderedLength += line.text.length
    if (renderedLength >= firstPartLength) {
      cutLineIndex = index
      break
    }
  }

  const cutLine = lines[cutLineIndex] ?? lastLine
  const isCutAtLineEnd = renderedLength === firstPartLength
  const secondZoneFirstLine = isCutAtLineEnd ? (lines[cutLineIndex + 1] ?? cutLine) : cutLine

  const firstZoneHeight = cutLine.y + cutLine.height
  const secondZoneTop = secondZoneFirstLine.y

  return {
    firstZone: { top: 0, height: firstZoneHeight },
    secondZone: { top: secondZoneTop, height: totalHeight - secondZoneTop },
  }
}
