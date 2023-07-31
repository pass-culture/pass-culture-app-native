import { getHighlightedParts, getPropertyByPath } from 'instantsearch.js/es/lib/utils'
import React, { FunctionComponent } from 'react'

import { AlgoliaSuggestionHit, AlgoliaVenue } from 'libs/algolia'
import { Typo } from 'ui/theme'

// Inspired by https://www.algolia.com/doc/guides/building-search-ui/going-further/native/react-hooks/?client=Highlight.js#highlight-matches

type HighlightPartProps = {
  children: string
  isHighlighted: boolean
}

export const HighlightPart: FunctionComponent<HighlightPartProps> = ({
  children,
  isHighlighted,
}) => {
  return isHighlighted ? (
    <Typo.Body testID="highlightedText">{children}</Typo.Body>
  ) : (
    <Typo.ButtonText testID="nonHighlightedText">{children}</Typo.ButtonText>
  )
}

type WithSuggestionHitProps = {
  suggestionHit: AlgoliaSuggestionHit
  venueHit?: never
}

type WithVenueHitProps = {
  venueHit: AlgoliaVenue
  suggestionHit?: never
}

type HighlightProps = (WithSuggestionHitProps | WithVenueHitProps) & {
  attribute: string
}

export function Highlight({ suggestionHit, venueHit, attribute }: HighlightProps) {
  let attributeValue = ''
  if (suggestionHit) {
    const { value } = getPropertyByPath(suggestionHit._highlightResult, attribute) || {}
    attributeValue = value.toString()
  }
  if (venueHit) {
    attributeValue = venueHit._highlightResult?.name?.value.toString() ?? ''
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
        return (
          <HighlightPart key={part.value} isHighlighted={part.isHighlighted}>
            {part.value}
          </HighlightPart>
        )
      })}
    </React.Fragment>
  )
}
