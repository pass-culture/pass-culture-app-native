export function extractExternalLinkParts(text: string): [string, string] {
  text = text.trim()

  const firstSpaceOccurrence = text.indexOf(' ')
  const hasOccurrence = firstSpaceOccurrence > 0

  const firstWord = (hasOccurrence ? '\u00a0' : '') + text.substring(0, firstSpaceOccurrence)
  const remainingWords =
    (hasOccurrence ? ' ' : '\u00a0') + text.substring(firstSpaceOccurrence + 1, text.length)
  return [firstWord, remainingWords]
}
