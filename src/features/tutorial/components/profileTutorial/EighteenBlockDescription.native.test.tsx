import React from 'react'

import { EighteenBlockDescription } from 'features/tutorial/components/profileTutorial/EighteenBlockDescription'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')

const mockUseAuthContext = jest.fn().mockReturnValue({ isLoggedIn: false, user: undefined })
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

describe('<EighteenBlockDescription />', () => {
  beforeEach(() => {
    activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  it('should display activation text when user is not logged in', () => {
    render(<EighteenBlockDescription />)

    expect(
      screen.getByText('Tu as 1 an pour confirmer ton identité et activer ce crédit.')
    ).toBeOnTheScreen()
  })

  it('should display activation text when user is logged in but not beneficiary', () => {
    mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: true, user: nonBeneficiaryUser })
    render(<EighteenBlockDescription />)

    expect(
      screen.getByText('Tu as 1 an pour confirmer ton identité et activer ce crédit.')
    ).toBeOnTheScreen()
  })

  it('should not display activation text when user is logged in and already beneficiary', () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: true,
      user: beneficiaryUser,
    })
    render(<EighteenBlockDescription />)

    expect(
      screen.queryByText('Tu as 1 an pour confirmer ton identité et activer ce crédit.')
    ).not.toBeOnTheScreen()
  })
})

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}
