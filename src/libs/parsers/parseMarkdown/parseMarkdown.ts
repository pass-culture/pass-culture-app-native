import { MarkdownPartProps } from 'ui/components/types'

// Regular expression to detect bold and italic
const STYLES_REGEXP = /\*\*(.*?)\*\*|_(.*?)_/g

type TextStyle = Record<string, boolean>

export function parseMarkdown(markdown: string, styles: TextStyle = {}): MarkdownPartProps[] {
  const parts: MarkdownPartProps[] = []
  let lastIndex = 0

  if (!markdown) return parts

  markdown.replace(STYLES_REGEXP, (match, isBold, isItalic, offset) => {
    // Add plain text before the styled match
    if (lastIndex < offset) {
      parts.push({ text: markdown.slice(lastIndex, offset), ...styles })
    }

    // Determine the styles for the current match
    const newStyles: TextStyle = { ...styles }
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
