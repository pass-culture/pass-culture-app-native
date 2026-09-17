import userEvent from '@testing-library/user-event'
import React from 'react'

import { SearchQuickAccess } from 'features/search/components/SearchQuickAccess/SearchQuickAccess'
import { render, screen } from 'tests/utils/web'

const TARGET_ID = 'search-categories'
const LINK_TITLE = 'Passer le champ de recherche et aller aux catégories'

const mockHideSuggestions = jest.fn()
const mockSearchContext = {
  isFocusOnSuggestions: false,
  hideSuggestions: mockHideSuggestions,
}
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockSearchContext,
}))

const SearchScreen = ({ isFocusOnSuggestions }: { isFocusOnSuggestions: boolean }) => (
  <React.Fragment>
    <SearchQuickAccess targetId={TARGET_ID} title={LINK_TITLE} />
    {isFocusOnSuggestions ? null : <div id={TARGET_ID} tabIndex={-1} data-testid="target" />}
  </React.Fragment>
)

describe('SearchQuickAccess', () => {
  beforeEach(() => {
    mockSearchContext.isFocusOnSuggestions = false
  })

  it('should not steal the focus on mount', () => {
    render(<SearchScreen isFocusOnSuggestions={false} />)

    expect(screen.getByTestId('target')).not.toHaveFocus()
  })

  it('should focus the target when it is already mounted', async () => {
    render(<SearchScreen isFocusOnSuggestions={false} />)

    await userEvent.click(screen.getByRole('link', { name: LINK_TITLE }))

    expect(screen.getByTestId('target')).toHaveFocus()
  })

  it('should focus the target once hiding the suggestions has mounted it', async () => {
    mockSearchContext.isFocusOnSuggestions = true
    const { rerender } = render(<SearchScreen isFocusOnSuggestions />)

    await userEvent.click(screen.getByRole('link', { name: LINK_TITLE }))

    expect(mockHideSuggestions).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('target')).not.toBeInTheDocument()

    mockSearchContext.isFocusOnSuggestions = false
    rerender(<SearchScreen isFocusOnSuggestions={false} />)

    expect(screen.getByTestId('target')).toHaveFocus()
  })
})
