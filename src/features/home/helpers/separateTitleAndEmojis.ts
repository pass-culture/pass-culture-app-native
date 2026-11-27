const EMOJI_REGEX = /^\p{Emoji}$/u

export const separateTitleAndEmojis = (
  title: string
): { titleText: string; titleEmoji?: string } => {
  const titleWithoutEndSpace = title.trimEnd()
  const characters = Array.from(titleWithoutEndSpace)

  let emojisStartIndex = characters.length
  while (emojisStartIndex > 0 && EMOJI_REGEX.test(characters[emojisStartIndex - 1] ?? '')) {
    emojisStartIndex--
  }

  const hasTrailingEmojis = emojisStartIndex < characters.length
  const titleText = hasTrailingEmojis
    ? characters.slice(0, emojisStartIndex).join('').trimEnd()
    : titleWithoutEndSpace
  const titleEmoji = titleWithoutEndSpace.slice(titleText.length).trimStart()
  return { titleText, titleEmoji }
}
