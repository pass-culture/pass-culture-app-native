import { getHighlightedParts, getPropertyByPath } from 'instantsearch.js/es/lib/utils'
import React from 'react'
import styled from 'styled-components/native'

import { Highlighted, HistoryItem } from 'features/search/types'
import { AlgoliaSuggestionHit, AlgoliaVenue } from 'libs/algolia'
import { Typo } from 'ui/theme'

// Inspired by https://www.algolia.com/doc/guides/building-search-ui/going-further/native/react-hooks/?client=Highlight.js#highlight-matches

type HighlightPartProps = {
  children: string
  isHighlighted: boolean
}

export function HighlightPart({ children, isHighlighted }: HighlightPartProps) {
  return isHighlighted ? (
    <Typo.Body testID="highlightedText">{children}</Typo.Body>
  ) : (
    <Typo.ButtonText testID="nonHighlightedText">{children}</Typo.ButtonText>
  )
}

export function HighlightHistoryItemPart({ children, isHighlighted }: HighlightPartProps) {
  return isHighlighted ? (
    <ItalicText testID="highlightedHistoryItemText">{children}</ItalicText>
  ) : (
    <BoldItalicText testID="nonHighlightedHistoryItemText">{children}</BoldItalicText>
  )
}

type WithSuggestionHitProps = {
  suggestionHit: AlgoliaSuggestionHit
  venueHit?: never
  historyItem?: never
  attribute: string
}

type WithVenueHitProps = {
  venueHit: AlgoliaVenue
  suggestionHit?: never
  historyItem?: never
  attribute: string
}

type WithHistoryItemProps = {
  historyItem: Highlighted<HistoryItem>
  suggestionHit?: never
  venueHit?: never
  attribute?: never
}

type HighlightProps = WithSuggestionHitProps | WithVenueHitProps | WithHistoryItemProps

export function Highlight({ suggestionHit, venueHit, historyItem, attribute }: HighlightProps) {
  let attributeValue = ''

  if (suggestionHit) {
    const { value } = getPropertyByPath(suggestionHit._highlightResult, attribute)
    attributeValue = value?.toString()
  }
  if (venueHit) {
    attributeValue = venueHit._highlightResult?.name?.value?.toString() ?? ''
  }
  if (historyItem) {
    attributeValue = historyItem._highlightResult?.query?.value?.toString() ?? ''
  }

  // it is necessary to have a good display when a search was executed and autocomplete redisplayed in iOS and Android
  const attributeValueEncoded = attributeValue
    .replaceAll('&lt;em&gt;', '<mark>')
    .replaceAll('&lt;/em&gt;', '</mark>')
    .replaceAll('&#39;', "'")

  const parts = getHighlightedParts(attributeValueEncoded)

  return (
    <React.Fragment>
      {parts.map((part) => {
        return historyItem ? (
          <HighlightHistoryItemPart key={part.value} isHighlighted={part.isHighlighted}>
            {part.value}
          </HighlightHistoryItemPart>
        ) : (
          <HighlightPart key={part.value} isHighlighted={part.isHighlighted}>
            {part.value}
          </HighlightPart>
        )
      })}
    </React.Fragment>
  )
}

const ItalicText = styled(Typo.Body)(({ theme }) => ({
  ...theme.typography.placeholder,
  color: theme.colors.black,
}))

const BoldItalicText = styled(Typo.Body)(({ theme }) => theme.typography.bodyBoldItalic)
