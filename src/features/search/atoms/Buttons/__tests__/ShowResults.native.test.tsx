import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchWrapper } from 'features/search/pages/SearchWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, fireEvent } from 'tests/utils'

import { ShowResults } from '../ShowResults'

let mockData = { pages: [{ nbHits: 0 }] }

jest.unmock('features/search/pages/SearchWrapper')

jest.mock('features/search/pages/useSearchResults', () => ({
  useStagedSearchResults: () => ({
    data: mockData,
    isFetching: false,
  }),
}))

describe('<ShowResults />', () => {
  it.each`
    nbHits  | expected                         | disabled
    ${0}    | ${'Aucun résultat'}              | ${true}
    ${1}    | ${'Afficher 1 résultat'}         | ${false}
    ${50}   | ${'Afficher les 50 résultats'}   | ${false}
    ${999}  | ${'Afficher les 999 résultats'}  | ${false}
    ${1200} | ${'Afficher les 999+ résultats'} | ${false}
  `(
    'should display the correct translation ($expected) and be disabled=$disabled',
    async ({ nbHits, expected, disabled }) => {
      mockData = { pages: [{ nbHits }] }
      const { getByText } = render(
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        reactQueryProviderHOC(
          <SearchWrapper>
            <ShowResults />
          </SearchWrapper>
        )
      )

      expect(await getByText(expected))[disabled ? 'toBeDisabled' : 'toBeEnabled']()
    }
  )

  it('should call navigate with searchState.view = "Results"', async () => {
    mockData = { pages: [{ nbHits: 1 }] }
    const { findByTestId } = render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(
        <SearchWrapper>
          <ShowResults />
        </SearchWrapper>
      )
    )
    const button = await findByTestId('Afficher 1 résultat')
    await fireEvent.press(button)
    expect(navigate).toBeCalledWith('TabNavigator', {
      params: {
        beginningDatetime: null,
        date: null,
        endingDatetime: null,
        hitsPerPage: 20,
        locationFilter: { locationType: 'EVERYWHERE' },
        offerCategories: [],
        offerIsDuo: false,
        offerIsFree: false,
        offerIsNew: false,
        offerSubcategories: [],
        offerTypes: { isDigital: false, isEvent: false, isThing: false },
        priceRange: [0, 300],
        query: '',
        tags: [],
        timeRange: null,
        view: 'Results',
      },
      screen: 'Search',
    })
  })
})
