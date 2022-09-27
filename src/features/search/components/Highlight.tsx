// We import getHighlightedParts and getPropertyByPath from instantsearch.js
// until this is resolved https://github.com/algolia/instantsearch.js/discussions/5116
import getHighlightedParts from 'instantsearch.js/es/lib/utils/getHighlightedParts'
import getPropertyByPath from 'instantsearch.js/es/lib/utils/getPropertyByPath'
import React, { FunctionComponent } from 'react'

import { AlgoliaSuggestionHit } from 'libs/algolia'
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

type HighlightProps = {
  hit: AlgoliaSuggestionHit
  attribute: string
}

export const Highlight: FunctionComponent<HighlightProps> = ({ hit, attribute }) => {
  const { value } = getPropertyByPath(hit._highlightResult, attribute) || {}
  const attributeValue = value.toString()
  const parts = getHighlightedParts(
    // it is necessary to have a good display when a search was executed and autocomplete redisplayed in iOS and Android
    attributeValue.replaceAll('&lt;em&gt;', '<mark>').replaceAll('&lt;/em&gt;', '</mark>')
  )

  return (
    <React.Fragment>
      {parts.map((part, partIndex) => {
        return (
          <HighlightPart key={partIndex} isHighlighted={part.isHighlighted}>
            {part.value}
          </HighlightPart>
        )
      })}
    </React.Fragment>
  )
}
