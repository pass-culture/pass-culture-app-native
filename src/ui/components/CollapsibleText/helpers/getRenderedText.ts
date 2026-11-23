import { customFindUrlChunks, normalizeURL } from 'libs/parsers/highlightLinks'
import { parseMarkdown } from 'libs/parsers/parseMarkdown/parseMarkdown'

const normalizeLinks = (text: string): string =>
  customFindUrlChunks({ textToHighlight: text, searchWords: [] }).reduceRight(
    (result, { start, end }) =>
      `${result.slice(0, start)}${normalizeURL(text.slice(start, end))}${result.slice(end)}`,
    text
  )

export const getRenderedText = (markdown: string): string =>
  parseMarkdown(markdown)
    .map(({ text }) => normalizeLinks(text))
    .join('')
