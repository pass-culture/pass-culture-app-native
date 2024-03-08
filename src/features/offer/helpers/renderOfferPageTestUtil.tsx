import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { OfferResponse } from 'api/gen'
import { RootStack } from 'features/navigation/RootNavigator/Stack'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { Offer } from 'features/offerv2/pages/Offer/Offer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

jest.mock('libs/location')

jest.unmock('@react-navigation/native')

jest.unmock('@react-navigation/stack')

jest.mock('features/auth/context/AuthContext')

jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

let mockedOffer: Partial<OfferResponse> | undefined | null = undefined
let mockedIsLoading = false
jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => ({
    data: mockedOffer,
    isLoading: mockedIsLoading,
  }),
}))

export const offerId = 116656

type MockOffer =
  | (OfferResponse & {
      extraOffer?: Partial<Omit<OfferResponse, 'id'>>
    })
  | null

type RenderOfferPage = {
  fromOfferId?: number
  extraOffer?: Partial<Omit<OfferResponse, 'id'>>
  openModalOnNavigation?: boolean
  mockOffer?: MockOffer
  mockIsLoading?: boolean
}

export function renderOfferPage({
  fromOfferId,
  extraOffer,
  openModalOnNavigation,
  mockOffer = { ...offerResponseSnap, ...extraOffer },
  mockIsLoading = false,
}: RenderOfferPage) {
  mockedOffer = mockOffer
  mockedIsLoading = mockIsLoading

  render(
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
}
