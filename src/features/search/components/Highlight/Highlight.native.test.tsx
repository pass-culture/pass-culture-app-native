import React from 'react'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import {
  ArtistHitHighlight,
  HighlightText,
  HistoryItemHighlight,
  SuggestionHitHighlight,
  VenueHitHighlight,
} from 'features/search/components/Highlight/Highlight'
import { mockArtistHits, mockVenueHits } from 'features/search/fixtures/algolia'
import { mockedSearchHistory } from 'features/search/fixtures/mockedSearchHistory'
import { AlgoliaSuggestionHit } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { render, screen } from 'tests/utils'

describe('HighlightText component', () => {
  const children = 'guerre et'

  it('should render highlighted history text', () => {
    render(
      <HighlightText variant="history" isHighlighted>
        {children}
      </HighlightText>
    )

    expect(screen.getByTestId('highlightedHistoryItemText')).toBeOnTheScreen()
  })

  it('should render non-highlighted history text', () => {
    render(
      <HighlightText isHighlighted={false} variant="history">
        {children}
      </HighlightText>
    )

    expect(screen.getByTestId('nonHighlightedHistoryItemText')).toBeOnTheScreen()
  })

  it('should render highlighted default text', () => {
    render(<HighlightText isHighlighted>{children}</HighlightText>)

    expect(screen.getByTestId('highlightedText')).toBeOnTheScreen()
  })

  it('should render non-highlighted default text', () => {
    render(<HighlightText isHighlighted={false}>{children}</HighlightText>)

    expect(screen.getByTestId('nonHighlightedText')).toBeOnTheScreen()
  })
})

describe('SuggestionHitHighlight for a offer suggestion', () => {
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
        exact_matches: {
          'offer.nativeCategoryId': [],
          'offer.searchGroupNamev2': [],
        },
        analytics: {
          ['offer.searchGroupNamev2']: [
            {
              attribute: '',
              operator: '',
              value: SearchGroupNameEnumv2.CINEMA,
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

  it('should render highlighted default text', () => {
    render(<SuggestionHitHighlight suggestionHit={hit} attribute="query" />)

    expect(screen.getByTestId('highlightedText')).toBeOnTheScreen()
  })

  it('should not render highlighted history text', () => {
    render(<SuggestionHitHighlight suggestionHit={hit} attribute="query" />)

    expect(screen.queryByTestId('highlightedHistoryItemText')).not.toBeOnTheScreen()
  })
})

describe('VenueHitHighlight for a venue suggestion', () => {
  const venueHit = mockVenueHits[0]

  it('should render highlighted default text', () => {
    render(<VenueHitHighlight venueHit={venueHit} />)

    expect(screen.getByTestId('highlightedText')).toBeOnTheScreen()
  })

  it('should not render highlighted history text', () => {
    render(<VenueHitHighlight venueHit={venueHit} />)

    expect(screen.queryByTestId('highlightedHistoryItemText')).not.toBeOnTheScreen()
  })
})

describe('ArtistHitHighlight for an artist suggestion', () => {
  const artistHit = mockArtistHits[0]

  it('should render highlighted default text', () => {
    render(<ArtistHitHighlight artistHit={artistHit} />)

    expect(screen.getByTestId('highlightedText')).toBeOnTheScreen()
  })

  it('should not render highlighted history text', () => {
    render(<ArtistHitHighlight artistHit={artistHit} />)

    expect(screen.queryByTestId('highlightedHistoryItemText')).not.toBeOnTheScreen()
  })
})

describe('HistoryItemHighlight for an history item', () => {
  const historyItem = { ...mockedSearchHistory[0], _highlightResult: { query: { value: 'manga' } } }

  it('should render non-highlighted history text', () => {
    render(<HistoryItemHighlight historyItem={historyItem} />)

    expect(screen.getByTestId('nonHighlightedHistoryItemText')).toBeOnTheScreen()
  })

  it('should not render non-highlighted default text', () => {
    render(<HistoryItemHighlight historyItem={historyItem} />)

    expect(screen.queryByTestId('nonHighlightedText')).not.toBeOnTheScreen()
  })
})
