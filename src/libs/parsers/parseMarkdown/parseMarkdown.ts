import { MarkdownPartProps } from 'ui/components/types'

// Regular expression to detect bold and italic
const MARKDOWN_REGEXP = /\*\*(.*?)\*\*|_(.*?)_/g

// Regular expression to detect URL
const URL_REGEX = /https?:\/\/[^\s]+/g

type TextStyle = Record<string, boolean>

export function parseMarkdown(markdown: string, styles: TextStyle = {}): MarkdownPartProps[] {
  const parts: MarkdownPartProps[] = []
  let lastIndex = 0

  if (!markdown) return parts

  // Temporarily replace URLs with a unique marker
  const urls: string[] = []
  const textWithoutUrls = markdown.replace(URL_REGEX, (match) => {
    urls.push(match) // Store URL
    return `{URL-${urls.length}}` // Temporary marker
  })

  // Replace Markdown
  textWithoutUrls.replace(MARKDOWN_REGEXP, (match, isBold, isItalic, offset) => {
    // Add plain text before the styled match
    if (lastIndex < offset) {
      parts.push({ text: textWithoutUrls.slice(lastIndex, offset), ...styles })
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
  if (lastIndex < textWithoutUrls.length) {
    parts.push({ text: textWithoutUrls.slice(lastIndex), ...styles })
  }

  // Restore URLs
  return parts.map((partObject) => {
    const regex = /{URL-(\d+)}/g
    if (!partObject.text.match(regex)) {
      return partObject
    }

    const url = urls.shift() ?? ''
    return {
      ...partObject,
      text: partObject.text.replace(/{URL-(\d+)}/g, url),
    }
  })
}
