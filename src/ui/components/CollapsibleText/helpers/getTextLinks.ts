import { customFindUrlChunks } from 'libs/parsers/highlightLinks'

export const getTextLinks = (text: string): string[] =>
  customFindUrlChunks({ textToHighlight: text, searchWords: [] }).map(({ start, end }) =>
    text.slice(start, end)
  )
