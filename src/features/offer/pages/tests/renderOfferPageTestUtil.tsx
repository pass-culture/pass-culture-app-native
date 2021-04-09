import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { UseQueryResult } from 'react-query'
import waitForExpect from 'wait-for-expect'

import { OfferResponse, UserProfileResponse } from 'api/gen'
import { RootStack } from 'features/navigation/RootNavigator'
import { offerResponseSnap } from 'features/offer/api/snaps/offerResponseSnap'
import { OfferAdaptedResponse } from 'features/offer/api/useOffer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { superFlushWithAct, render } from 'tests/utils'

import { Offer } from '../Offer'
import { OfferBody } from '../OfferBody'

jest.mock('libs/geolocation')

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual<Record<string, unknown>>('@react-navigation/native'),
  useFocusEffect: jest.fn(),
}))

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

const mockDomainsCredit = {
  all: { initial: 50000, remaining: 400 },
  digital: { initial: 10000, remaining: 50 },
  physical: { initial: 20000, remaining: 150 },
}

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(
    () =>
      ({
        isLoading: false,
        data: {
          email: 'email2@domain.ext',
          firstName: 'Jean',
          isBeneficiary: true,
          domainsCredit: mockDomainsCredit,
        },
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

export async function renderOfferBodyPage(extraOffer?: Partial<Omit<OfferResponse, 'id'>>) {
  mockedOffer = { ...offerResponseSnap, ...extraOffer }
  const wrapper = render(
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

  await superFlushWithAct(25)

  await waitForExpect(() => {
    expect(wrapper.queryByTestId('offer-container')).toBeTruthy()
  })

  return wrapper
}

export async function renderOfferPage(extraOffer?: Partial<Omit<OfferResponse, 'id'>>) {
  mockedOffer = { ...offerResponseSnap, ...extraOffer }
  const wrapper = render(
    reactQueryProviderHOC(
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Offer">
          <RootStack.Screen name="Offer" component={Offer} initialParams={{ id: offerId }} />
        </RootStack.Navigator>
      </NavigationContainer>
    )
  )

  await superFlushWithAct(25)

  await waitForExpect(() => {
    expect(wrapper.queryByTestId('offer-container')).toBeTruthy()
  })

  return wrapper
}
