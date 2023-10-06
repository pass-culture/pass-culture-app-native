import React from 'react'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import {
  Highlight,
  HighlightHistoryItemPart,
  HighlightPart,
} from 'features/search/components/Highlight/Highlight'
import { mockVenueHits } from 'features/search/fixtures/algolia'
import { mockedSearchHistory } from 'features/search/fixtures/mockedSearchHistory'
import { AlgoliaSuggestionHit } from 'libs/algolia'
import { env } from 'libs/environment'
import { render, screen } from 'tests/utils'

describe('Highlight component for a offer suggestion', () => {
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
    expect(render(<Highlight suggestionHit={hit} attribute="query" />)).toMatchSnapshot()
  })

  it('should use highlight part for display', () => {
    render(<Highlight suggestionHit={hit} attribute="query" />)

    expect(screen.getByTestId('nonHighlightedText')).toBeOnTheScreen()
  })

  it('should not use highlight history item part for display', () => {
    render(<Highlight suggestionHit={hit} attribute="query" />)

    expect(screen.queryByTestId('nonHighlightedHistoryItemText')).not.toBeOnTheScreen()
  })
})

describe('Highlight component for a venue suggestion', () => {
  const hit = mockVenueHits[0]

  it('should render Highlight', () => {
    expect(render(<Highlight venueHit={hit} attribute="name" />)).toMatchSnapshot()
  })

  it('should use highlight part for display', () => {
    render(<Highlight venueHit={hit} attribute="name" />)

    expect(screen.getByTestId('nonHighlightedText')).toBeOnTheScreen()
  })

  it('should not use highlight history item part for display', () => {
    render(<Highlight venueHit={hit} attribute="name" />)

    expect(screen.queryByTestId('nonHighlightedHistoryItemText')).not.toBeOnTheScreen()
  })
})

describe('Highlight component for an history item', () => {
  const historyItem = { ...mockedSearchHistory[0], _highlightResult: { query: { value: 'manga' } } }

  it('should render Highlight', () => {
    expect(render(<Highlight historyItem={historyItem} />)).toMatchSnapshot()
  })

  it('should use highlight history item part for display', () => {
    render(<Highlight historyItem={historyItem} />)

    expect(screen.getByTestId('nonHighlightedHistoryItemText')).toBeOnTheScreen()
  })

  it('should not use highlight part for display', () => {
    render(<Highlight historyItem={historyItem} />)

    expect(screen.queryByTestId('nonHighlightedText')).not.toBeOnTheScreen()
  })
})

describe('HighlightPart component', () => {
  const children = 'guerre et'

  it('should use body typo when the part of the hit is highlighted', () => {
    render(<HighlightPart isHighlighted>{children}</HighlightPart>)

    expect(screen.getByTestId('highlightedText')).toBeOnTheScreen()
  })

  it('should not use body typo when the part of the hit is not highlighted', () => {
    render(<HighlightPart isHighlighted={false}>{children}</HighlightPart>)

    expect(screen.queryByTestId('highlightedText')).not.toBeOnTheScreen()
  })

  it('should use button text typo when the part of the hit is not highlighted', () => {
    render(<HighlightPart isHighlighted={false}>{children}</HighlightPart>)

    expect(screen.getByTestId('nonHighlightedText')).toBeOnTheScreen()
  })

  it('should not use button text typo when the part of the hit is  highlighted', () => {
    render(<HighlightPart isHighlighted>{children}</HighlightPart>)

    expect(screen.queryByTestId('nonHighlightedText')).not.toBeOnTheScreen()
  })
})

describe('HighlightHistoryItemPart component', () => {
  const children = 'guerre et'

  it('should use placeholder typo when the part of the hit is highlighted', () => {
    render(<HighlightHistoryItemPart isHighlighted>{children}</HighlightHistoryItemPart>)

    expect(screen.getByTestId('highlightedHistoryItemText')).toBeOnTheScreen()
  })

  it('should not use placeholder typo when the part of the hit is not highlighted', () => {
    render(<HighlightHistoryItemPart isHighlighted={false}>{children}</HighlightHistoryItemPart>)

    expect(screen.queryByTestId('highlightedHistoryItemText')).not.toBeOnTheScreen()
  })

  it('should use body bold italic typo when the part of the hit is not highlighted', () => {
    render(<HighlightHistoryItemPart isHighlighted={false}>{children}</HighlightHistoryItemPart>)

    expect(screen.getByTestId('nonHighlightedHistoryItemText')).toBeOnTheScreen()
  })

  it('should not use body bold italic typo when the part of the hit is highlighted', () => {
    render(<HighlightHistoryItemPart isHighlighted>{children}</HighlightHistoryItemPart>)

    expect(screen.queryByTestId('nonHighlightedHistoryItemText')).not.toBeOnTheScreen()
  })
})
