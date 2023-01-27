import React from 'react'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { Highlight, HighlightPart } from 'features/search/components/Highlight/Highlight'
import { AlgoliaSuggestionHit } from 'libs/algolia'
import { env } from 'libs/environment'
import { render, screen } from 'tests/utils'

describe('Highlight component', () => {
  const hit = {
    query: 'guerre et youpi matin',
    objectID: 'guerre et youpi matin',
    _highlightResult: {
      query: {
        value: '<mark>guerre</mark> et youpi matin',
        matchLevel: 'full',
        fullyHighlighted: false,
        matchedWords: ['guerre'],
      },
    },
    __position: 123,
    [env.ALGOLIA_OFFERS_INDEX_NAME]: {
      exact_nb_hits: 2,
      facets: {
        analytics: {
          ['offer.searchGroupNamev2']: [
            {
              attribute: '',
              operator: '',
              value: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
              count: 10,
            },
          ],
          ['offer.nativeCategoryId']: [
            {
              attribute: '',
              operator: '',
              value: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
              count: 10,
            },
          ],
        },
      },
    },
  } as AlgoliaSuggestionHit

  it('should render Highlight', () => {
    expect(render(<Highlight hit={hit} attribute="query" />)).toMatchSnapshot()
  })
})

describe('HighlightPart component', () => {
  const children = 'guerre et'

  it('should use body typo when the part of the hit is highlighted', () => {
    render(<HighlightPart isHighlighted>{children}</HighlightPart>)

    expect(screen.queryByTestId('highlightedText')).toBeTruthy()
  })

  it('should use button text typo when the part of the hit is not highlighted', () => {
    render(<HighlightPart isHighlighted={false}>{children}</HighlightPart>)

    expect(screen.queryByTestId('nonHighlightedText')).toBeTruthy()
  })
})
