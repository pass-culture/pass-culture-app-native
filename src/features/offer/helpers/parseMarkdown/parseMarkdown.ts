import { MarkdownPartProps } from 'features/offer/types'

// Regular expression to detect bold and italic
const STYLES_REGEXP = /\*\*(.*?)\*\*|_(.*?)_/g

export function parseMarkdown(
  markdown: string,
  styles: Record<string, boolean> = {}
): MarkdownPartProps[] {
  const parts: MarkdownPartProps[] = []
  let lastIndex = 0

  if (!markdown) return parts

  markdown.replace(STYLES_REGEXP, (match, isBold, isItalic, offset) => {
    // Add plain text before the styled match
    if (lastIndex < offset) {
      parts.push({ text: markdown.slice(lastIndex, offset), ...styles })
    }

    // Determine the styles for the current match
    const newStyles: Record<string, boolean> = { ...styles }
    if (isBold) newStyles.isBold = true
    if (isItalic) newStyles.isItalic = true

    // Recursively parse styled content to handle nesting
    const styledText = isBold || isItalic
    parts.push(...parseMarkdown(styledText, newStyles))

    // Update the last index processed
    lastIndex = offset + match.length
    return match
  })

  // Add the rest of the plain text
  if (lastIndex < markdown.length) {
    parts.push({ text: markdown.slice(lastIndex), ...styles })
  }

  return parts
}
