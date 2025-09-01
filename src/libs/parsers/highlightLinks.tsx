import { Chunk, findAll, FindChunksArgs } from 'highlight-words-core'
import React from 'react'

import { ExternalLink } from 'ui/components/buttons/externalLink/ExternalLink'

type ParsedDescription = Array<string | React.ReactNode>
type ChunkType = { highlight: boolean; start: number; end: number }

const tlds = [
  'com',
  'fr',
  'org',
  'net',
  'io',
  'app',
  'dev',
  'info',
  'biz',
  'gov',
  'edu',
  'ca',
  'uk',
  'us',
  'de',
  'be',
  'ch',
  'tv',
  'ai',
]
const externalNavRegex = new RegExp(
  `((^|\\s)|https?:\\/\\/)[a-z]([-a-z0-9:%._+~#=]*[a-z0-9])?\\.(${tlds.join('|')})([/?#]\\S*)?(\\s|$)`,
  'gm'
)

export const customFindUrlChunks = ({ textToHighlight }: FindChunksArgs): Chunk[] => {
  // code adapted from https://github.com/bvaughn/highlight-words-core/blob/master/src/utils.js
  const chunks: ChunkType[] = []
  let match: RegExpExecArray | null
  while ((match = externalNavRegex.exec(textToHighlight))) {
    const startWithSpace = /\s/.test(textToHighlight[match.index] ?? '')
    const startIndexSpaceAdjustment = startWithSpace ? 1 : 0
    const start = match.index + startIndexSpaceAdjustment
    const endWithSpace = /\s/.test(textToHighlight[externalNavRegex.lastIndex - 1] ?? '')
    const endIndexSpaceAdjustment = endWithSpace ? 1 : 0
    const end = externalNavRegex.lastIndex - endIndexSpaceAdjustment
    // We do not return zero-length matches
    if (end > start) {
      chunks.push({ highlight: false, start, end })
    }
    // Prevent browsers like Firefox from getting stuck in an infinite loop
    // See http://www.regexguru.com/2008/04/watch-out-for-zero-length-matches/
    if (match.index === externalNavRegex.lastIndex) {
      externalNavRegex.lastIndex++
    }
  }

  return chunks
}

const normalizeURL = (partialURL: string): string => {
  if (partialURL.startsWith('http://')) return partialURL
  if (partialURL.startsWith('https://')) return partialURL
  return `http://${partialURL}`
}

export const highlightLinks = (description: string, withIcon?: boolean): ParsedDescription => {
  const chunks = findAll({
    searchWords: [],
    findChunks: customFindUrlChunks,
    textToHighlight: description,
  })

  return chunks.map(({ start, end, highlight }, index) => {
    const url = normalizeURL(description.slice(start, end))
    return highlight ? (
      <ExternalLink key={`external-link-${index}`} url={url} withIcon={withIcon} />
    ) : (
      description.slice(start, end)
    )
  })
}
