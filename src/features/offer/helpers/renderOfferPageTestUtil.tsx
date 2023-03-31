import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { OfferResponse } from 'api/gen'
import { RootStack } from 'features/navigation/RootNavigator/Stack'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { Offer } from 'features/offer/pages/Offer/Offer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

jest.mock('libs/geolocation')

jest.unmock('@react-navigation/native')

jest.unmock('@react-navigation/stack')

jest.mock('features/auth/context/AuthContext')

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
