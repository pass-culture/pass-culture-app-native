import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { ActivityIdEnum } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName } from 'features/identityCheck/pages/profile/store/nameStore'
import { useStatus } from 'features/identityCheck/pages/profile/store/statusStore'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { ProfileInformationValidation } from './ProfileInformationValidation'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/identityCheck/pages/profile/store/nameStore')
const mockedUseName = useName as jest.Mock
const mockName = { firstName: 'Jean', lastName: 'Dupont' }

jest.mock('features/identityCheck/pages/profile/store/cityStore')
const mockedUseCity = useCity as jest.Mock
const mockCity = { name: 'Paris', postalCode: '75011', cityCode: '12345' }

jest.mock('features/identityCheck/pages/profile/store/addressStore')
const mockedUseAddress = useAddress as jest.Mock
const mockAddress = '1 rue du Test'

jest.mock('features/identityCheck/pages/profile/store/statusStore')
const mockedUseStatus = useStatus as jest.Mock
const mockStatus = ActivityIdEnum.STUDENT

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
    profile: {
      name: mockName,
      city: mockCity,
      address: mockAddress,
      status: mockStatus,
    },
  })),
}))

describe('ProfileInformationValidation', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockedUseName.mockReturnValue(mockName)
    mockedUseCity.mockReturnValue(mockCity)
    mockedUseAddress.mockReturnValue(mockAddress)
    mockedUseStatus.mockReturnValue(mockStatus)
  })

  it('should render correctly', async () => {
    const { container } = renderProfileInformationValidation({
      type: ProfileTypes.BOOKING_FREE_OFFER_15_16,
    })

    await screen.findByText('Informations personnelles')

    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})

const renderProfileInformationValidation = (navigationParams: { type: string }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    SubscriptionRootStackParamList,
    'ProfileInformationValidation'
  >
  return render(reactQueryProviderHOC(<ProfileInformationValidation {...navProps} />))
}
