import React, { useEffect } from 'react'
import { AccessibilityInfo } from 'react-native'

import {
  SearchSuggestionsAccessibilityProvider,
  SuggestionsSnapshot,
  useSearchSuggestionsAccessibility,
} from 'features/search/context/SearchSuggestionsAccessibilityProvider'
import { mockedSearchHistory } from 'features/search/fixtures/mockedSearchHistory'
import { act, render } from 'tests/utils'

import { SearchSuggestions } from './SearchSuggestions'

let mockOffers: SuggestionsSnapshot
let mockVenues: SuggestionsSnapshot
let mockArtists: SuggestionsSnapshot
let mockSearchStatus = 'idle'
let mockArtistsEnabled = false
const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility')

function MockSection({
  snapshot,
  onSuggestionsChange,
}: {
  snapshot: SuggestionsSnapshot
  onSuggestionsChange: (snapshot: SuggestionsSnapshot) => void
}) {
  useEffect(() => onSuggestionsChange(snapshot), [snapshot, onSuggestionsChange])
  return null
}

jest.mock('features/search/components/AutocompleteOffer/AutocompleteOffer', () => ({
  AutocompleteOffer: (props: { onSuggestionsChange: (snapshot: SuggestionsSnapshot) => void }) => (
    <MockSection {...props} snapshot={mockOffers} />
  ),
}))
jest.mock('features/search/components/AutocompleteVenue/AutocompleteVenue', () => ({
  AutocompleteVenue: (props: { onSuggestionsChange: (snapshot: SuggestionsSnapshot) => void }) => (
    <MockSection {...props} snapshot={mockVenues} />
  ),
}))
jest.mock('features/search/components/AutocompleteArtist/AutocompleteArtist', () => ({
  AutocompleteArtist: (props: { onSuggestionsChange: (snapshot: SuggestionsSnapshot) => void }) => (
    <MockSection {...props} snapshot={mockArtists} />
  ),
}))
jest.mock('features/search/components/SearchHistory/SearchHistory', () => ({
  SearchHistory: () => null,
}))
jest.mock('react-instantsearch-core', () => ({
  useInstantSearch: () => ({ status: mockSearchStatus }),
  Index: ({ children }: React.PropsWithChildren) => children,
  Configure: () => null,
}))
jest.mock('libs/firebase/firestore/featureFlags/useFeatureFlag', () => ({
  useFeatureFlag: () => mockArtistsEnabled,
}))
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: {}, dispatch: jest.fn(), hideSuggestions: jest.fn() }),
}))
jest.mock('features/search/helpers/useNavigateToSearch/useNavigateToSearch', () => ({
  useNavigateToSearch: () => ({ navigateToSearch: jest.fn() }),
}))
jest.mock('libs/firebase/analytics/analytics')

function FocusInput({ focused }: { focused: boolean }) {
  const setInputFocused = useSearchSuggestionsAccessibility()?.setInputFocused
  useEffect(() => setInputFocused?.(focused), [setInputFocused, focused])
  return null
}

function Search({
  query = 'manga',
  visible = true,
  focused = true,
  history = false,
}: {
  query?: string
  visible?: boolean
  focused?: boolean
  history?: boolean
}) {
  return (
    <SearchSuggestionsAccessibilityProvider query={query} visible={visible}>
      <FocusInput focused={focused} />
      {visible ? (
        <SearchSuggestions
          queryHistory={query}
          addToHistory={jest.fn()}
          removeFromHistory={jest.fn()}
          filteredHistory={
            history
              ? mockedSearchHistory.filter((item) => item.query.includes(query)).slice(0, 2)
              : []
          }
        />
      ) : null}
    </SearchSuggestionsAccessibilityProvider>
  )
}

describe('SearchSuggestions announcements', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockOffers = { query: 'manga', itemKeys: ['offer-1', 'offer-2'] }
    mockVenues = { query: 'manga', itemKeys: ['venue-1'] }
    mockArtists = { query: 'manga', itemKeys: ['artist-1'] }
    mockArtistsEnabled = false
    mockSearchStatus = 'idle'
  })

  afterEach(() => jest.useRealTimers())

  it('announces the visible sections once and includes artists only when enabled', () => {
    const { rerender } = render(<Search />)
    act(() => jest.advanceTimersByTime(200))

    expect(announce).toHaveBeenLastCalledWith('3 suggestions pour « manga ».')

    mockArtistsEnabled = true
    rerender(<Search />)
    act(() => jest.advanceTimersByTime(200))

    expect(announce).toHaveBeenLastCalledWith('4 suggestions pour « manga ».')

    mockArtistsEnabled = false
    rerender(<Search />)
    act(() => jest.advanceTimersByTime(200))

    expect(announce).toHaveBeenLastCalledWith('3 suggestions pour « manga ».')
    expect(announce).toHaveBeenCalledTimes(3)
  })

  it('waits for all active sections to match the new query', () => {
    const { rerender } = render(<Search query="mangas" />)
    act(() => jest.advanceTimersByTime(1000))

    expect(announce).not.toHaveBeenCalled()

    mockOffers = { query: 'mangas', itemKeys: [] }
    rerender(<Search query="mangas" />)
    act(() => jest.advanceTimersByTime(1000))

    expect(announce).not.toHaveBeenCalled()

    mockVenues = { query: 'mangas', itemKeys: [] }
    rerender(<Search query="mangas" />)
    act(() => jest.advanceTimersByTime(200))

    expect(announce).toHaveBeenCalledTimes(1)
    expect(announce).toHaveBeenCalledWith('Aucune suggestion pour « mangas ».')
  })

  it('does not announce zero results while a request is loading', () => {
    mockSearchStatus = 'loading'
    mockOffers = { query: 'manga', itemKeys: [] }
    mockVenues = { query: 'manga', itemKeys: [] }
    const { rerender } = render(<Search />)
    act(() => jest.advanceTimersByTime(1000))

    expect(announce).not.toHaveBeenCalled()

    mockSearchStatus = 'idle'
    rerender(<Search />)
    act(() => jest.advanceTimersByTime(200))

    expect(announce).toHaveBeenCalledTimes(1)
    expect(announce).toHaveBeenCalledWith('Aucune suggestion pour « manga ».')
  })

  it('waits through debounce and loading before announcing a new query with the same count', () => {
    mockArtistsEnabled = true
    const { rerender } = render(<Search />)
    act(() => jest.advanceTimersByTime(200))

    expect(announce).toHaveBeenLastCalledWith('4 suggestions pour « manga ».')

    rerender(<Search query="vinyle" />)
    act(() => jest.advanceTimersByTime(500))

    expect(announce).toHaveBeenCalledTimes(1)

    mockSearchStatus = 'loading'
    mockOffers = { query: 'vinyle', itemKeys: ['offer-3', 'offer-4'] }
    mockVenues = { query: 'vinyle', itemKeys: ['venue-2'] }
    rerender(<Search query="vinyle" />)
    act(() => jest.advanceTimersByTime(1000))

    expect(announce).toHaveBeenCalledTimes(1)

    mockSearchStatus = 'idle'
    rerender(<Search query="vinyle" />)
    act(() => jest.advanceTimersByTime(200))

    expect(announce).toHaveBeenCalledTimes(1)

    mockArtists = { query: 'vinyle', itemKeys: ['artist-2'] }
    rerender(<Search query="vinyle" />)
    act(() => jest.advanceTimersByTime(200))

    expect(announce).toHaveBeenCalledTimes(2)
    expect(announce).toHaveBeenLastCalledWith('4 suggestions pour « vinyle ».')
  })

  it('includes matching history when a nonempty query has no suggestions', () => {
    mockOffers = { query: 'manga', itemKeys: [] }
    mockVenues = { query: 'manga', itemKeys: [] }
    render(<Search history />)
    act(() => jest.advanceTimersByTime(200))

    expect(announce).toHaveBeenCalledTimes(1)
    expect(announce).toHaveBeenCalledWith(
      'Aucune suggestion pour « manga ». Historique de recherche : 1 élément.'
    )
  })

  it('announces a replacement with the same count but ignores identical renders', () => {
    const { rerender } = render(<Search />)
    act(() => jest.advanceTimersByTime(200))
    mockOffers = { query: 'manga', itemKeys: ['offer-3', 'offer-4'] }
    rerender(<Search />)
    act(() => jest.advanceTimersByTime(200))

    expect(announce).toHaveBeenLastCalledWith(
      'Suggestions mises à jour. 3 suggestions pour « manga ».'
    )

    mockOffers = { ...mockOffers, itemKeys: [...mockOffers.itemKeys] }
    rerender(<Search />)
    act(() => jest.advanceTimersByTime(200))

    expect(announce).toHaveBeenCalledTimes(2)
  })

  it('announces history after clearing and ignores late suggestions', () => {
    const { rerender } = render(<Search />)
    act(() => jest.advanceTimersByTime(200))
    rerender(<Search query="" history />)
    act(() => jest.advanceTimersByTime(200))
    mockOffers = { query: 'manga', itemKeys: ['late-result'] }
    rerender(<Search query="" history />)
    act(() => jest.advanceTimersByTime(200))

    expect(announce).toHaveBeenLastCalledWith(
      'Aucune suggestion de recherche. Historique de recherche : 2 éléments.'
    )
    expect(announce).toHaveBeenCalledTimes(2)
  })

  it('replaces pending results with one closing announcement', () => {
    const { rerender } = render(<Search />)
    rerender(<Search visible={false} />)
    act(() => jest.advanceTimersByTime(200))

    expect(announce).toHaveBeenCalledTimes(1)
    expect(announce).toHaveBeenCalledWith('Suggestions masquées.')
  })

  it('does not announce pending results after the input loses focus', () => {
    const { rerender } = render(<Search />)
    rerender(<Search focused={false} />)
    act(() => jest.advanceTimersByTime(200))

    expect(announce).not.toHaveBeenCalled()
  })

  it('announces the current suggestions when returning to the input', () => {
    const { rerender } = render(<Search />)
    act(() => jest.advanceTimersByTime(200))
    rerender(<Search focused={false} />)
    rerender(<Search />)
    act(() => jest.advanceTimersByTime(200))

    expect(announce).toHaveBeenCalledTimes(2)
    expect(announce).toHaveBeenLastCalledWith('3 suggestions pour « manga ».')
  })
})
