import { Chunk, findAll, FindChunksArgs } from 'highlight-words-core'
import React from 'react'

import { ExternalLink } from 'ui/components/buttons/externalLink/ExternalLink'

export type ParsedDescription = Array<string | React.ReactNode>

const externalUrlRegex = new RegExp(
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
  'gi'
)

export const customFindUrlChunks = ({ textToHighlight }: FindChunksArgs): Chunk[] => {
  // code adapted from https://github.com/bvaughn/highlight-words-core/blob/master/src/utils.js
  const chunks = []
  let match: RegExpExecArray | null
  while ((match = externalUrlRegex.exec(textToHighlight))) {
    const start = match.index
    const end = externalUrlRegex.lastIndex
    // We do not return zero-length matches
    if (end > start) {
      chunks.push({ highlight: false, start, end })
    }
    // Prevent browsers like Firefox from getting stuck in an infinite loop
    // See http://www.regexguru.com/2008/04/watch-out-for-zero-length-matches/
    if (match.index === externalUrlRegex.lastIndex) {
      externalUrlRegex.lastIndex++
    }
  }

  return chunks
}

export const highlightLinks = (description: string): ParsedDescription => {
  const chunks = findAll({
    searchWords: [],
    findChunks: customFindUrlChunks,
    textToHighlight: description,
  })
  return chunks.map(({ start, end, highlight }, index) =>
    highlight ? (
      <ExternalLink key={`external-link-${index}`} url={description.slice(start, end)} />
    ) : (
      description.slice(start, end)
    )
  )
}
