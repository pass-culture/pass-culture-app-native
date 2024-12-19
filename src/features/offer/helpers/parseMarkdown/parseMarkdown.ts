import { MarkdownPartProps } from 'features/offer/types'

// Regular expression to detect bold and italic
const STYLES_REGEXP = /\*\*(.*?)\*\*|_(.*?)_/g

export function parseMarkdown(markdown: string) {
  function parse(markdown: string, styles: Record<string, boolean> = {}) {
    const parts: MarkdownPartProps[] = []
    let lastIndex = 0

    markdown.replace(STYLES_REGEXP, (match, isBold, isItalic, offset) => {
      // Add plain text before matching
      if (lastIndex < offset) {
        parts.push({ text: markdown.slice(lastIndex, offset), ...styles })
      }

      const newStyles: Record<string, boolean> = { ...styles }
      if (isBold) newStyles.isBold = true
      if (isItalic) newStyles.isItalic = true

      // Recursively parse styled content to handle nesting
      const styledText = isBold || isItalic
      parts.push(...parse(styledText, newStyles))

      lastIndex = offset + match.length
      return match
    })

    // Add the rest of the plain text
    if (lastIndex < markdown.length) {
      parts.push({ text: markdown.slice(lastIndex), ...styles })
    }

    return parts
  }

  return parse(markdown)
}
