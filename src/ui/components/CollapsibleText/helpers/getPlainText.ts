import { parseMarkdown } from 'libs/parsers/parseMarkdown/parseMarkdown'

export const getPlainText = (markdown: string): string =>
  parseMarkdown(markdown)
    .map(({ text }) => text)
    .join('')
