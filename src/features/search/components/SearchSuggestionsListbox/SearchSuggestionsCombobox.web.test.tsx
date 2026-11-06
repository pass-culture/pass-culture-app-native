import React, { useId } from 'react'
import { Text } from 'react-native'

import { SearchBox } from 'features/search/components/SearchBox/SearchBox'
import { SearchSuggestionOption } from 'features/search/components/SearchSuggestionsListbox/SearchSuggestionOption'
import {
  SearchSuggestionsGroup,
  SearchSuggestionsGroupItem,
} from 'features/search/components/SearchSuggestionsListbox/SearchSuggestionsGroup'
import { SearchSuggestionsListbox } from 'features/search/components/SearchSuggestionsListbox/SearchSuggestionsListbox'
import { searchSuggestionsAccessibilityStore } from 'features/search/store/searchSuggestionsAccessibility.store'
import { act, checkAccessibilityFor, fireEvent, render, screen, userEvent } from 'tests/utils/web'

let mockIsFocusOnSuggestions = true
const mockShowSuggestions = jest.fn()
const mockHideSuggestions = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: jest.requireActual('features/search/context/reducer').initialSearchState,
    dispatch: jest.fn(),
    isFocusOnSuggestions: mockIsFocusOnSuggestions,
    hideSuggestions: mockHideSuggestions,
    showSuggestions: mockShowSuggestions,
  }),
}))
jest.mock('features/search/helpers/useNavigateToSearch/useNavigateToSearch', () => ({
  useNavigateToSearch: () => ({ navigateToSearch: jest.fn() }),
}))
jest.mock('queries/settings/useSettings', () => ({
  useAppEnableAutocomplete: () => ({ data: true }),
}))
jest.mock('react-instantsearch-core', () => ({
  useSearchBox: () => ({ query: '', refine: jest.fn(), clear: jest.fn() }),
}))
jest.mock('libs/firebase/analytics/analytics')

const mockAddSearchHistory = jest.fn()
const mockSelect = jest.fn()

const HISTORY = ['manga']
const SUGGESTIONS = ['mangaka', 'manga one piece']

function Options({ labels }: { labels: string[] }) {
  return (
    <React.Fragment>
      {labels.map((label) => (
        <SearchSuggestionsGroupItem key={label}>
          <SearchSuggestionOption onPress={() => mockSelect(label)}>
            <Text>{label}</Text>
          </SearchSuggestionOption>
        </SearchSuggestionsGroupItem>
      ))}
    </React.Fragment>
  )
}

function Search({
  history = HISTORY,
  suggestions = SUGGESTIONS,
  disabled = false,
}: {
  history?: string[]
  suggestions?: string[]
  disabled?: boolean
}) {
  const suggestionsId = useId()
  return (
    <React.Fragment>
      <SearchBox
        suggestionsId={suggestionsId}
        addSearchHistory={mockAddSearchHistory}
        searchInHistory={jest.fn()}
      />
      {mockIsFocusOnSuggestions ? (
        <SearchSuggestionsListbox suggestionsId={suggestionsId} disabled={disabled}>
          {history.length > 0 ? (
            <SearchSuggestionsGroup title="Historique de recherche">
              <Options labels={history} />
            </SearchSuggestionsGroup>
          ) : null}
          {suggestions.length > 0 ? (
            <SearchSuggestionsGroup title="Suggestions">
              <Options labels={suggestions} />
            </SearchSuggestionsGroup>
          ) : null}
        </SearchSuggestionsListbox>
      ) : null}
    </React.Fragment>
  )
}

const getInput = () => screen.getByRole('combobox')
const getOption = (name: string) => screen.getByRole('option', { name })

const focusInput = () => act(() => getInput().focus())

describe('Search suggestions combobox on the web', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = jest.fn()
  })

  beforeEach(() => {
    mockIsFocusOnSuggestions = true
    searchSuggestionsAccessibilityStore.store.setState({ instances: {} })
  })

  it('exposes the combobox pattern on the search input', () => {
    render(<Search />)
    const input = getInput()
    const listbox = screen.getByRole('listbox', { name: 'Suggestions de recherche' })

    expect(input).toHaveAccessibleName(/Rechercher dans le catalogue/)
    expect(input).toHaveAttribute('aria-autocomplete', 'list')
    expect(input).toHaveAttribute('aria-controls', listbox.id)
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(input).toHaveAttribute('autocomplete', 'off')
    expect(input).not.toHaveAttribute('aria-activedescendant')
  })

  it('is collapsed but still references the listbox when the suggestions are hidden', () => {
    mockIsFocusOnSuggestions = false
    render(<Search />)
    const input = getInput()

    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(input.getAttribute('aria-controls')).toMatch(/-listbox$/)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('is collapsed when the displayed list has no suggestion', () => {
    render(<Search history={[]} suggestions={[]} />)

    expect(getInput()).toHaveAttribute('aria-expanded', 'false')
  })

  it('groups the options under named groups with unique ids and an unselected state', () => {
    render(<Search />)

    expect(screen.getByRole('group', { name: 'Historique de recherche' })).toContainElement(
      getOption('manga')
    )
    expect(screen.getByRole('group', { name: 'Suggestions' })).toContainElement(
      getOption('mangaka')
    )

    const options = screen.getAllByRole('option')
    const ids = options.map((option) => option.id)

    expect(options).toHaveLength(3)
    expect(new Set(ids).size).toBe(3)

    options.forEach((option) => {
      expect(option).toHaveAttribute('aria-selected', 'false')
      expect(option).toHaveAttribute('tabindex', '-1')
    })
  })

  it('keeps a plain list of buttons when the listbox is disabled', async () => {
    render(<Search disabled />)
    const input = getInput()
    focusInput()

    await userEvent.keyboard('{ArrowDown}')

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Historique de recherche' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'manga' })).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(input).not.toHaveAttribute('aria-activedescendant')
  })

  it('moves the active option with the arrow keys without moving the focus', async () => {
    render(<Search />)
    const input = getInput()
    focusInput()

    await userEvent.keyboard('{ArrowDown}')

    expect(input).toHaveAttribute('aria-activedescendant', getOption('manga').id)
    expect(getOption('manga')).toHaveAttribute('aria-selected', 'true')
    expect(input).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')

    expect(input).toHaveAttribute('aria-activedescendant', getOption('mangaka').id)
    expect(getOption('manga')).toHaveAttribute('aria-selected', 'false')
    expect(getOption('mangaka')).toHaveAttribute('aria-selected', 'true')
    expect(Element.prototype.scrollIntoView).toHaveBeenLastCalledWith({ block: 'nearest' })
  })

  it('wraps around the list in both directions', async () => {
    render(<Search />)
    const input = getInput()
    focusInput()

    await userEvent.keyboard('{ArrowUp}')

    expect(input).toHaveAttribute('aria-activedescendant', getOption('manga one piece').id)

    await userEvent.keyboard('{ArrowDown}')

    expect(input).toHaveAttribute('aria-activedescendant', getOption('manga').id)

    await userEvent.keyboard('{ArrowUp}')

    expect(input).toHaveAttribute('aria-activedescendant', getOption('manga one piece').id)
  })

  it('opens the suggestions with the down arrow when they are hidden', async () => {
    mockIsFocusOnSuggestions = false
    render(<Search />)
    focusInput()
    mockShowSuggestions.mockClear()

    await userEvent.keyboard('{ArrowDown}')

    expect(mockShowSuggestions).toHaveBeenCalledTimes(1)
  })

  it('selects the active option with Enter instead of submitting the query', async () => {
    render(<Search />)
    const input = getInput()
    focusInput()
    await userEvent.type(input, 'man')

    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}')

    expect(mockSelect).toHaveBeenCalledWith('mangaka')
    expect(mockAddSearchHistory).not.toHaveBeenCalled()
    expect(input).not.toHaveAttribute('aria-activedescendant')
  })

  it('submits the typed query with Enter when no option is active', async () => {
    render(<Search />)
    const input = getInput()
    focusInput()

    await userEvent.type(input, 'manga{Enter}')

    expect(mockAddSearchHistory).toHaveBeenCalledWith({ query: 'manga' })
    expect(mockSelect).not.toHaveBeenCalled()
  })

  it('closes the suggestions with Escape without changing the value or the focus', async () => {
    render(<Search />)
    const input = getInput()
    focusInput()
    await userEvent.type(input, 'man')
    await userEvent.keyboard('{ArrowDown}')

    await userEvent.keyboard('{Escape}')

    expect(mockHideSuggestions).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('man')
    expect(input).toHaveFocus()
    expect(input).not.toHaveAttribute('aria-activedescendant')
  })

  it('resets the active option when the user types', async () => {
    render(<Search />)
    const input = getInput()
    focusInput()
    await userEvent.keyboard('{ArrowDown}')

    await userEvent.type(input, 'a')

    expect(input).not.toHaveAttribute('aria-activedescendant')
  })

  it('reopens the suggestions when the user types after closing them', async () => {
    mockIsFocusOnSuggestions = false
    render(<Search />)
    focusInput()
    mockShowSuggestions.mockClear()

    await userEvent.type(getInput(), 'a')

    expect(mockShowSuggestions).toHaveBeenCalledWith()
  })

  it('resets the active option when it is removed from the list', async () => {
    const { rerender } = render(<Search />)
    const input = getInput()
    focusInput()
    await userEvent.keyboard('{ArrowDown}')

    rerender(<Search history={[]} />)

    expect(input).not.toHaveAttribute('aria-activedescendant')
  })

  it('ignores the keys handled by an input method editor', async () => {
    render(<Search />)
    const input = getInput()
    focusInput()
    await userEvent.keyboard('{ArrowDown}')
    const activeOptionId = getOption('manga').id

    fireEvent.keyDown(input, { key: 'ArrowDown', isComposing: true })
    fireEvent.keyDown(input, { key: 'ArrowDown', keyCode: 229 })
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 })
    fireEvent.keyDown(input, { key: 'Escape', keyCode: 229 })

    expect(input).toHaveAttribute('aria-activedescendant', activeOptionId)
    expect(mockSelect).not.toHaveBeenCalled()
    expect(mockHideSuggestions).not.toHaveBeenCalled()
  })

  it('resets the active option when the input loses focus', async () => {
    render(<Search />)
    const input = getInput()
    focusInput()
    await userEvent.keyboard('{ArrowDown}')

    act(() => input.blur())

    expect(input).not.toHaveAttribute('aria-activedescendant')
    expect(getOption('manga')).toHaveAttribute('aria-selected', 'false')
  })

  it('should not have basic accessibility issues', async () => {
    const { container } = render(<Search />)
    focusInput()
    await userEvent.keyboard('{ArrowDown}')

    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})
