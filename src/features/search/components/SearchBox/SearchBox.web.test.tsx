import React, { useEffect, useId } from 'react'
import { AccessibilityInfo } from 'react-native'

import { SearchBox } from 'features/search/components/SearchBox/SearchBox'
import { SearchSuggestionsAnnouncer } from 'features/search/components/SearchSuggestionsStatus/SearchSuggestionsAnnouncer'
import { useSearchSuggestionsAccessibility } from 'features/search/helpers/useSearchSuggestionsAccessibility'
import {
  searchSuggestionsAccessibilityStore,
  SuggestionsStatus,
} from 'features/search/store/searchSuggestionsAccessibility.store'
import { act, render, screen } from 'tests/utils/web'

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: {
      ...jest.requireActual('features/search/context/reducer').initialSearchState,
      query: 'manga',
    },
    dispatch: jest.fn(),
    isFocusOnSuggestions: true,
    hideSuggestions: jest.fn(),
    showSuggestions: jest.fn(),
  }),
}))
jest.mock('features/search/helpers/useNavigateToSearch/useNavigateToSearch', () => ({
  useNavigateToSearch: () => ({ navigateToSearch: jest.fn() }),
}))
jest.mock('queries/settings/useSettings', () => ({
  useAppEnableAutocomplete: () => ({ data: true }),
}))
jest.mock('react-instantsearch-core', () => ({
  useSearchBox: () => ({ query: 'manga', refine: jest.fn(), clear: jest.fn() }),
}))
jest.mock('libs/firebase/analytics/analytics')

const firstStatus: SuggestionsStatus = {
  query: 'manga',
  key: 'first',
  message: '5 suggestions pour « manga ».',
  ready: true,
}

function Publisher({ status, id }: { status: SuggestionsStatus; id: string }) {
  const accessibility = useSearchSuggestionsAccessibility(id)
  const publish = accessibility.publish
  useEffect(() => {
    publish(status)
    return () => publish(null)
  }, [publish, status])
  return null
}

function Search({
  status = firstStatus,
  visible = true,
  query = 'manga',
}: {
  status?: SuggestionsStatus
  visible?: boolean
  query?: string
}) {
  const suggestionsDescriptionId = useId()
  return (
    <React.Fragment>
      <SearchBox
        suggestionsDescriptionId={suggestionsDescriptionId}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
      {visible ? <Publisher id={suggestionsDescriptionId} status={status} /> : null}
      <SearchSuggestionsAnnouncer id={suggestionsDescriptionId} query={query} visible={visible} />
    </React.Fragment>
  )
}

describe('SearchBox accessibility on the web', () => {
  beforeEach(() => jest.useFakeTimers())

  afterEach(() => jest.useRealTimers())

  it('associates both descriptions with the actual input and preserves its name, role and focus', () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility')
    const { rerender } = render(<Search />)
    const input = screen.getByRole('searchbox')
    const name = input.getAttribute('aria-label')
    const ids = input.getAttribute('aria-describedby')?.split(' ') ?? []

    expect(ids).toHaveLength(2)
    expect(document.getElementById(ids[0] ?? '')).toHaveTextContent('Indique le nom d’une offre')
    expect(document.getElementById(ids[1] ?? '')).toBe(screen.getByRole('status'))
    expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'true')

    act(() => input.focus())
    act(() => jest.advanceTimersByTime(200))

    expect(input).toHaveAccessibleDescription(expect.stringContaining(firstStatus.message))

    rerender(<Search status={{ ...firstStatus, key: 'second' }} />)
    act(() => jest.advanceTimersByTime(200))

    expect(screen.getByRole('status')).toHaveTextContent('Suggestions mises à jour.')
    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('aria-label', name)
    expect(input).toHaveAccessibleName(/Rechercher dans le catalogue/)
    expect(announce).not.toHaveBeenCalled()
  })

  it('keeps the status node mounted when the list disappears', () => {
    const { rerender } = render(<Search />)
    const input = screen.getByRole('searchbox')
    const status = screen.getByRole('status')
    act(() => input.focus())
    act(() => jest.advanceTimersByTime(200))

    rerender(<Search visible={false} />)
    act(() => jest.advanceTimersByTime(200))

    expect(screen.getByRole('status')).toBe(status)
    expect(status).toHaveTextContent('Suggestions masquées.')
    expect(input).toHaveFocus()
  })

  it('removes stale descriptions before the next response and after blur', () => {
    const { rerender } = render(<Search />)
    const input = screen.getByRole('searchbox')
    act(() => input.focus())
    act(() => jest.advanceTimersByTime(200))

    rerender(<Search query="mangas" />)

    expect(screen.getByRole('status')).toBeEmptyDOMElement()

    rerender(<Search />)
    act(() => input.blur())

    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('uses independent description identifiers for multiple search instances', () => {
    render(
      <React.Fragment>
        <Search />
        <Search />
      </React.Fragment>
    )

    const ids = screen
      .getAllByRole('searchbox')
      .flatMap((input) => input.getAttribute('aria-describedby')?.split(' ') ?? [])

    expect(new Set(ids).size).toBe(4)
    expect(ids.every((id) => document.getElementById(id))).toBe(true)
  })

  it('isolates announcements and cleans up only the unmounted search instance', () => {
    const secondStatus = { ...firstStatus, key: 'other', message: '2 suggestions pour « manga ».' }
    const { rerender, unmount } = render(
      <React.Fragment>
        <Search key="first" />
        <Search key="second" status={secondStatus} />
      </React.Fragment>
    )
    const inputs = screen.getAllByRole('searchbox')
    const statuses = screen.getAllByRole('status')
    act(() => inputs[0]?.focus())
    act(() => jest.advanceTimersByTime(200))

    expect(statuses[0]).toHaveTextContent(firstStatus.message)
    expect(statuses[1]).toBeEmptyDOMElement()

    act(() => inputs[1]?.focus())
    act(() => jest.advanceTimersByTime(200))

    expect(statuses[0]).toBeEmptyDOMElement()
    expect(statuses[1]).toHaveTextContent(secondStatus.message)

    rerender(
      <React.Fragment>
        <Search key="second" status={secondStatus} />
      </React.Fragment>
    )

    expect(screen.getByRole('status')).toBe(statuses[1])
    expect(screen.getByRole('status')).toHaveTextContent(secondStatus.message)
    expect(
      Object.keys(searchSuggestionsAccessibilityStore.store.getState().instances)
    ).toHaveLength(1)

    unmount()

    expect(searchSuggestionsAccessibilityStore.store.getState().instances).toEqual({})
  })
})
