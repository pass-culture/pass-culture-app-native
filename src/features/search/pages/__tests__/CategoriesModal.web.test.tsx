import React from 'react'

import { CategoriesModal } from 'features/search/pages/CategoriesModal'
import { initialSearchState } from 'features/search/pages/reducer'
import { render } from 'tests/utils/web'

const mockSearchState = initialSearchState

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

describe('CategoriesModal component', () => {
  it('should render correctly', () => {
    expect(render(<CategoriesModal visible={true} dismissModal={jest.fn()} />)).toMatchSnapshot()
  })
})
