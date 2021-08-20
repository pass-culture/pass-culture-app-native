import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { UseQueryResult } from 'react-query'

import { OfferResponse, UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { RootStack } from 'features/navigation/RootNavigator'
import { offerResponseSnap } from 'features/offer/api/snaps/offerResponseSnap'
import { OfferAdaptedResponse } from 'features/offer/api/useOffer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

import { Offer } from '../Offer'
import { OfferBody } from '../OfferBody'

jest.mock('libs/geolocation')

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual<Record<string, unknown>>('@react-navigation/native'),
  useFocusEffect: jest.fn(),
}))

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

const mockDomainsCredit = {
  all: { initial: 50000, remaining: 400 },
  digital: { initial: 10000, remaining: 50 },
  physical: { initial: 20000, remaining: 150 },
}

const baseUser = {
  email: 'email2@domain.ext',
  firstName: 'Jean',
  isBeneficiary: true,
  domainsCredit: mockDomainsCredit,
}
let mockedUser: Partial<UserProfileResponse> = baseUser
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(
    () =>
      ({
        isLoading: false,
        data: mockedUser,
      } as UseQueryResult<UserProfileResponse>)
  ),
}))

let mockedOffer: Partial<OfferAdaptedResponse> | undefined = undefined
jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => ({
    data: mockedOffer,
  }),
}))

export const offerId = 116656

export function renderOfferBodyPage(
  extraOffer?: Partial<Omit<OfferResponse, 'id'>>,
  user?: Partial<UserProfileResponse>,
  { isLoggedIn } = { isLoggedIn: true }
) {
  mockedOffer = { ...offerResponseSnap, ...extraOffer }
  mockedUser = { ...baseUser, ...user }

  const setIsLoggedIn = jest.fn()
  mockUseAuthContext.mockImplementation(() => ({ isLoggedIn, setIsLoggedIn }))

  return render(
    reactQueryProviderHOC(
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Offer">
          <RootStack.Screen name="Offer">
            {() => <OfferBody offerId={offerId} onScroll={jest.fn()} />}
          </RootStack.Screen>
        </RootStack.Navigator>
      </NavigationContainer>
    )
  )
}

export function renderOfferPage(extraOffer?: Partial<Omit<OfferResponse, 'id'>>) {
  mockedOffer = { ...offerResponseSnap, ...extraOffer }

  return render(
    reactQueryProviderHOC(
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Offer">
          <RootStack.Screen name="Offer" component={Offer} initialParams={{ id: offerId }} />
        </RootStack.Navigator>
      </NavigationContainer>
    )
  )
}
