import React from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'
import { SubcategoryButtonListWrapper } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonListWrapper'

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/TabBar/routes')

describe('<SubcategoryButtonListWrapper/>', () => {
  it('should display "Films à l’affiche" when offerCategory is "Cinema"', async () => {
    render(
      reactQueryProviderHOC(
        <SubcategoryButtonListWrapper category={SearchGroupNameEnumv2.CINEMA} />
      )
    )

    expect(await screen.findByText('Films à l’affiche')).toBeOnTheScreen()
  })

  it('should display "Romans et littérature" when offerCategory is "Livres"', async () => {
    render(
      reactQueryProviderHOC(
        <SubcategoryButtonListWrapper category={SearchGroupNameEnumv2.LIVRES} />
      )
    )

    expect(await screen.findByText('Romans et littérature')).toBeOnTheScreen()
  })
})
