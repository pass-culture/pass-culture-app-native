import { getHighlightedParts, getPropertyByPath } from 'instantsearch.js/es/lib/utils'
import React from 'react'

import { decodeHTMLValue } from 'features/search/helpers/decodeHTMLValue/decodeHTMLValue'
import { Highlighted, HistoryItem } from 'features/search/types'
import { AlgoliaArtist, AlgoliaSuggestionHit, AlgoliaVenue } from 'libs/algolia/types'
import { Typo } from 'ui/theme'

// Inspired by https://www.algolia.com/doc/guides/building-search-ui/going-further/native/react-hooks/?client=Highlight.js#highlight-matches

type HighlightPartProps = {
  children: string
  isHighlighted: boolean
}

export const HighlightPart = ({ children, isHighlighted }: HighlightPartProps) => {
  return isHighlighted ? (
    <Typo.Body testID="highlightedText">{children}</Typo.Body>
  ) : (
    <Typo.BodyAccent testID="nonHighlightedText">{children}</Typo.BodyAccent>
  )
}

export const HighlightHistoryItemPart = ({ children, isHighlighted }: HighlightPartProps) => {
  return isHighlighted ? (
    <Typo.BodyItalic testID="highlightedHistoryItemText">{children}</Typo.BodyItalic>
  ) : (
    <Typo.BodyItalic testID="nonHighlightedHistoryItemText">{children}</Typo.BodyItalic>
  )
}

type WithSuggestionHitProps = {
  suggestionHit: AlgoliaSuggestionHit
  attribute: string
}

type WithVenueHitProps = {
  venueHit: AlgoliaVenue
}

type WithArtistHitProps = {
  artistHit: AlgoliaArtist
}

type WithHistoryItemProps = {
  historyItem: Highlighted<HistoryItem>
}

export const SuggestionHitHighlight = ({ suggestionHit, attribute }: WithSuggestionHitProps) => {
  const { value } = getPropertyByPath(suggestionHit._highlightResult, attribute)
  const attributeValue = value?.toString()

  return <Highlight attributeValue={attributeValue} />
}

export const VenueHitHighlight = ({ venueHit }: WithVenueHitProps) => {
  const attributeValue = venueHit._highlightResult?.name?.value?.toString() ?? ''

  return <Highlight attributeValue={attributeValue} />
}

export const ArtistHitHighlight = ({ artistHit }: WithArtistHitProps) => {
  const attributeValue = artistHit._highlightResult?.name?.value?.toString() ?? ''

  return <Highlight attributeValue={attributeValue} />
}

export const HistoryItemHighlight = ({ historyItem }: WithHistoryItemProps) => {
  const attributeValue = historyItem._highlightResult?.query?.value?.toString() ?? ''

  return <Highlight attributeValue={attributeValue} historyItem={!!historyItem} />
}

type HighlightProps = { attributeValue: string; historyItem?: boolean }

const Highlight = ({ attributeValue, historyItem }: HighlightProps) => {
  // it is necessary to have a good display when a search was executed and autocomplete redisplayed in iOS and Android
  const parts = getHighlightedParts(decodeHTMLValue(attributeValue))

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
