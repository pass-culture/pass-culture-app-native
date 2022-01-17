import { Chunk, findAll, FindChunksArgs } from 'highlight-words-core'
import React from 'react'

import { ExternalLink } from 'ui/components/buttons/externalLink/ExternalLink'

export type ParsedDescription = Array<string | React.ReactNode>

const externalUrlRegex = new RegExp(
  /((^|\s)|https?:\/\/)[a-z]([-a-z0-9@:%._+~#=]*[a-z0-9])?\.[a-z0-9]{1,6}([/?#]\S*)?(\s|$)/,
  'gmi'
)

export const customFindUrlChunks = ({ textToHighlight }: FindChunksArgs): Chunk[] => {
  // code adapted from https://github.com/bvaughn/highlight-words-core/blob/master/src/utils.js
  const chunks = []
  let match: RegExpExecArray | null
  while ((match = externalUrlRegex.exec(textToHighlight))) {
    const startWithSpace = /\s/.test(textToHighlight[match.index])
    const startIndexSpaceAdjustment = startWithSpace ? 1 : 0
    const start = match.index + startIndexSpaceAdjustment
    const endWithSpace = /\s/.test(textToHighlight[externalUrlRegex.lastIndex - 1])
    const endIndexSpaceAdjustment = endWithSpace ? 1 : 0
    const end = externalUrlRegex.lastIndex - endIndexSpaceAdjustment
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

const normalizeURL = (partialURL: string): string => {
  if (partialURL.startsWith('http://')) return partialURL
  if (partialURL.startsWith('https://')) return partialURL
  return `http://${partialURL}`
}

export const highlightLinks = (description: string): ParsedDescription => {
  const chunks = findAll({
    searchWords: [],
    findChunks: customFindUrlChunks,
    textToHighlight: description,
  })

  return chunks.map(({ start, end, highlight }, index) => {
    const url = normalizeURL(description.slice(start, end))
    return highlight ? (
      <ExternalLink key={`external-link-${index}`} url={url} />
    ) : (
      description.slice(start, end)
    )
  })
}
