export type InlineSegment =
  { type: 'text' | 'bold'; text: string } | { type: 'link'; text: string; url: string }

type AnswerListItem = {
  segments: InlineSegment[]
  nested: InlineSegment[][]
}

type AnswerBlock =
  | { type: 'heading' | 'paragraph'; segments: InlineSegment[] }
  | { type: 'list'; items: AnswerListItem[] }

const INLINE_REGEX = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
const HEADING_REGEX = /^#{1,3}\s+(.+)$/
const BULLET_REGEX = /^(\s*)[*-]\s+(.+)$/
const NESTED_INDENT_LENGTH = 2

const toInlineSegment = (match: RegExpMatchArray): InlineSegment => {
  const [fullMatch, bold, label, url] = match
  if (bold !== undefined) return { type: 'bold', text: bold }
  if (label !== undefined && url !== undefined) return { type: 'link', text: label, url }
  return { type: 'text', text: fullMatch }
}

const parseInline = (line: string): InlineSegment[] => {
  const segments: InlineSegment[] = []
  let lastIndex = 0

  Array.from(line.matchAll(INLINE_REGEX)).forEach((match) => {
    const index = match.index
    if (index > lastIndex) segments.push({ type: 'text', text: line.slice(lastIndex, index) })
    segments.push(toInlineSegment(match))
    lastIndex = index + match[0].length
  })

  if (lastIndex < line.length) segments.push({ type: 'text', text: line.slice(lastIndex) })
  return segments
}

export const parseAnswerMarkdown = (text: string): AnswerBlock[] => {
  const blocks: AnswerBlock[] = []
  let paragraphLines: string[] = []

  const flushParagraph = () => {
    if (!paragraphLines.length) return
    blocks.push({ type: 'paragraph', segments: parseInline(paragraphLines.join('\n')) })
    paragraphLines = []
  }

  const addListItem = (indent: string, content: string) => {
    const lastBlock = blocks[blocks.length - 1]
    const list = lastBlock?.type === 'list' ? lastBlock : undefined
    const parentItem = list?.items[list.items.length - 1]

    if (indent.length >= NESTED_INDENT_LENGTH && parentItem) {
      parentItem.nested.push(parseInline(content))
      return
    }

    const item = { segments: parseInline(content), nested: [] }
    if (list) list.items.push(item)
    else blocks.push({ type: 'list', items: [item] })
  }

  text.split('\n').forEach((line) => {
    if (!line.trim()) {
      flushParagraph()
      return
    }

    const heading = HEADING_REGEX.exec(line.trim())
    if (heading) {
      flushParagraph()
      blocks.push({ type: 'heading', segments: parseInline(heading[1] ?? '') })
      return
    }

    const bullet = BULLET_REGEX.exec(line)
    if (bullet) {
      flushParagraph()
      addListItem(bullet[1] ?? '', bullet[2] ?? '')
      return
    }

    paragraphLines.push(line.trim())
  })

  flushParagraph()
  return blocks
}
