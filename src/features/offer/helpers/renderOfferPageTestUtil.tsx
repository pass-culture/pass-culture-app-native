import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import waitForExpect from 'wait-for-expect'

import { OfferResponse, UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { RootStack } from 'features/navigation/RootNavigator/Stack'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { Offer } from 'features/offer/pages/Offer/Offer'
import { beneficiaryUser } from 'fixtures/user'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { superFlushWithAct, render } from 'tests/utils'

jest.mock('libs/geolocation')

jest.unmock('@react-navigation/native')

jest.unmock('@react-navigation/stack')

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

let mockedOffer: Partial<OfferResponse> | undefined = undefined
jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => ({
    data: mockedOffer,
  }),
}))

export const offerId = 116656

export async function renderOfferBodyPage(
  extraOffer?: Partial<Omit<OfferResponse, 'id'>>,
  user?: Partial<UserProfileResponse>,
  { isLoggedIn } = { isLoggedIn: true }
) {
  mockedOffer = { ...offerResponseSnap, ...extraOffer }
  const mockedUser = { ...beneficiaryUser, ...user }

  const setIsLoggedIn = jest.fn()
  mockUseAuthContext.mockImplementation(() => ({
    isLoggedIn,
    setIsLoggedIn,
    user: mockedUser,
    isUserLoading: false,
    refetchUser: jest.fn(),
  }))

  const wrapper = render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
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

export function renderOfferPage(
  fromOfferId?: number,
  extraOffer?: Partial<Omit<OfferResponse, 'id'>>,
  openModalOnNavigation?: boolean
) {
  mockedOffer = { ...offerResponseSnap, ...extraOffer }
  const wrapper = render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Offer">
          <RootStack.Screen
            name="Offer"
            component={Offer}
            initialParams={{ id: offerId, fromOfferId, openModalOnNavigation }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    )
  )

  return wrapper
}
