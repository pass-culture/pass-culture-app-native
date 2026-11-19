import React, { useId } from 'react'

import { SearchBox } from 'features/search/components/SearchBox/SearchBox'
import { SearchSuggestions } from 'features/search/components/SearchSuggestions/SearchSuggestions'
import { mockVenueHits } from 'features/search/fixtures/algolia'
import { mockedSearchHistory } from 'features/search/fixtures/mockedSearchHistory'
import { HistoryItem } from 'features/search/types'
import {
  act,
  checkAccessibilityFor,
  fireEvent,
  render,
  screen,
  userEvent,
  within,
} from 'tests/utils/web'

let mockQuery = ''
jest.mock('react-instantsearch-core', () => ({
  useInstantSearch: () => ({ status: 'idle' }),
  useSearchBox: () => ({ query: mockQuery, refine: jest.fn(), clear: jest.fn() }),
  useInfiniteHits: () => ({
    hits: mockQuery ? mockVenueHits : [],
    sendEvent: jest.fn(),
    results: { query: mockQuery },
  }),
  Index: ({ children }: React.PropsWithChildren) => children,
  Configure: () => null,
}))
jest.mock('features/search/components/AutocompleteOffer/AutocompleteOffer', () => ({
  AutocompleteOffer: () => null,
}))
jest.mock('libs/firebase/firestore/featureFlags/useFeatureFlag', () => ({
  useFeatureFlag: () => false,
}))
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: jest.requireActual('features/search/context/reducer').initialSearchState,
    dispatch: jest.fn(),
    isFocusOnSuggestions: true,
    showSuggestions: jest.fn(),
    hideSuggestions: jest.fn(),
  }),
}))
jest.mock('queries/settings/useSettings', () => ({
  useAppEnableAutocomplete: () => ({ data: true }),
}))
jest.mock('features/search/helpers/useNavigateToSearch/useNavigateToSearch', () => ({
  useNavigateToSearch: () => ({ navigateToSearch: jest.fn() }),
}))
jest.mock('libs/firebase/analytics/analytics')

function Suggestions({
  query,
  history,
  withSearchBox = false,
}: {
  query: string
  history: HistoryItem[]
  withSearchBox?: boolean
}) {
  const suggestionsId = useId()
  return (
    <React.Fragment>
      {withSearchBox ? (
        <SearchBox
          suggestionsId={suggestionsId}
          addSearchHistory={jest.fn()}
          searchInHistory={jest.fn()}
        />
      ) : null}
      <SearchSuggestions
        suggestionsId={suggestionsId}
        queryHistory={query}
        addToHistory={jest.fn()}
        removeFromHistory={jest.fn()}
        filteredHistory={history}
      />
    </React.Fragment>
  )
}

const renderSuggestions = (query: string, { withSearchBox = false } = {}) => {
  mockQuery = query
  const history = mockedSearchHistory.filter((item) => item.query.includes(query)).slice(0, 2)
  return render(<Suggestions query={query} history={history} withSearchBox={withSearchBox} />)
}

describe('SearchSuggestions on the web', () => {
  describe('without query', () => {
    it('should display the search history as a list of buttons with their remove button', () => {
      renderSuggestions('')

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      expect(screen.queryByRole('option')).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Historique de recherche' })).toBeInTheDocument()

      const historyList = screen.getByRole('list', { name: 'Historique de recherche' })
      const [firstItem] = within(historyList).getAllByRole('listitem')
      const [entryButton, removeButton] = firstItem ? within(firstItem).getAllByRole('button') : []

      expect(entryButton).toHaveTextContent('manga')
      expect(removeButton).toHaveAccessibleName('Supprimer manga de l’historique')
    })

    it('should not have basic accessibility issues', async () => {
      const { container } = renderSuggestions('')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })

  describe('with query', () => {
    it('should display the history and the suggestions as grouped options of a listbox', () => {
      renderSuggestions('man')

      const listbox = screen.getByRole('listbox', { name: 'Suggestions de recherche' })
      const historyGroup = within(listbox).getByRole('group', { name: 'Historique de recherche' })
      const venuesGroup = within(listbox).getByRole('group', { name: 'Lieux culturels' })

      expect(within(historyGroup).getAllByRole('option')[0]).toHaveTextContent('manga')
      expect(within(venuesGroup).getAllByRole('option')).toHaveLength(mockVenueHits.length)
      expect(within(listbox).queryByRole('button')).not.toBeInTheDocument()
      expect(within(listbox).queryByRole('heading')).not.toBeInTheDocument()
    })

    it('should not have basic accessibility issues', async () => {
      const { container } = renderSuggestions('man')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })

  describe('with the search input', () => {
    beforeAll(() => {
      Element.prototype.scrollIntoView = jest.fn()
    })

    it('should keep the focus and the active option when the active option is scrolled into view', async () => {
      renderSuggestions('man', { withSearchBox: true })
      const input = screen.getByRole('combobox')
      act(() => input.focus())
      await userEvent.keyboard('{ArrowDown}')
      const activeOptionId = input.getAttribute('aria-activedescendant')

      fireEvent.scroll(screen.getByTestId('autocompleteScrollView'))

      expect(activeOptionId).toBeTruthy()
      expect(input).toHaveFocus()
      expect(input).toHaveAttribute('aria-activedescendant', activeOptionId)
    })

    it('should still dismiss the keyboard when the user drags the suggestions', () => {
      renderSuggestions('man', { withSearchBox: true })
      const input = screen.getByRole('combobox')
      act(() => input.focus())

      const scrollView = screen.getByTestId('autocompleteScrollView')
      const touch = { identifier: 0, clientX: 0, clientY: 0, force: 1 }
      const touchEvent = { touches: [touch], changedTouches: [touch] }
      fireEvent.touchStart(scrollView, touchEvent)
      fireEvent.touchMove(scrollView, touchEvent)

      expect(input).not.toHaveFocus()
    })
  })
})
