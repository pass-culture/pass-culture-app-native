export const separateTitleAndEmojis = (
  title: string
): { titleText: string; titleEmoji?: string } => {
  const titleWithoutEndSpace = title.trimEnd()
  const emojiRegex = /\s*\p{Emoji}+$/u
  const titleText = titleWithoutEndSpace.replace(emojiRegex, '')
  const titleEmoji = titleWithoutEndSpace.slice(titleText.length).trimStart()
  return { titleText, titleEmoji }
}
