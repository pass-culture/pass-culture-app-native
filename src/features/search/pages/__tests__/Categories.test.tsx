import React from 'react'

import { SearchGroupNameEnum } from 'api/gen'
import { initialSearchState } from 'features/search/pages/reducer'
import { themeProviderHOC } from 'tests/themeProviderHOC'
import { render } from 'tests/utils'

import { Categories } from '../Categories'

const mockSearchState = initialSearchState

jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { firstName: 'Christophe', lastName: 'Dupont' } })),
}))

describe('Categories component', () => {
  it('should render correctly', () => {
    const { toJSON } = renderCategories()
    expect(toJSON()).toMatchSnapshot()
  })
  it('should match diff snapshot when new category is selected', () => {
    const allSelected = renderCategories().toJSON()

    mockSearchState.offerCategories = [SearchGroupNameEnum.CINEMA]
    const cinemaSelected = renderCategories().toJSON()
    expect(cinemaSelected).toMatchDiffSnapshot(allSelected)
  })
})

function renderCategories() {
  return render(themeProviderHOC(<Categories />))
}
