import React from 'react'

import { initialFavoritesState } from 'features/favorites/context/reducer'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { LoggedInContent } from './LoggedInContent'

jest.mock('libs/firebase/analytics/analytics')

const mockFavoritesState = initialFavoritesState
jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({ ...mockFavoritesState, dispatch: jest.fn() }),
}))

describe('LoggedInContent', () => {
  it('should render LoggedInBeneficiaryContent when user is beneficiary', () => {
    render(reactQueryProviderHOC(<LoggedInContent user={beneficiaryUser} />))

    expect(screen.getByTestId('logged-in-beneficiary-content')).toBeTruthy()
  })

  it('should render LoggedInNonBeneficiaryContent when user is not beneficiary', () => {
    render(reactQueryProviderHOC(<LoggedInContent user={nonBeneficiaryUser} />))

    expect(screen.getByTestId('logged-in-non-beneficiary-content')).toBeTruthy()
  })

  it('should render LoggedInNonBeneficiaryContent when user is undefined', () => {
    render(reactQueryProviderHOC(<LoggedInContent user={undefined} />))

    expect(screen.getByTestId('logged-in-non-beneficiary-content')).toBeTruthy()
  })
})
