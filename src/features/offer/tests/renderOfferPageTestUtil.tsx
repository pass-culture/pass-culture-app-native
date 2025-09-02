import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { OfferResponseV2 } from 'api/gen'
import { RootStackNavigatorBase } from 'features/navigation/RootNavigator/Stack'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { Offer } from 'features/offer/pages/Offer/Offer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

jest.mock('libs/location/location')

jest.unmock('@react-navigation/native')

jest.unmock('@react-navigation/stack')

jest.mock('features/auth/context/AuthContext')

jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

let mockedOffer: Partial<OfferResponseV2> | undefined | null = undefined
let mockedIsLoading = false
jest.mock('queries/offer/useOfferQuery', () => ({
  useOfferQuery: () => ({
    data: mockedOffer,
    isInitialLoading: mockedIsLoading,
  }),
}))

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

const offerId = offerResponseSnap.id

type MockOffer =
  | (OfferResponseV2 & {
      extraOffer?: Partial<Omit<OfferResponseV2, 'id'>>
    })
  | null

type RenderOfferPage = {
  fromOfferId?: number
  extraOffer?: Partial<Omit<OfferResponseV2, 'id'>>
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
        <RootStackNavigatorBase.Navigator initialRouteName="Offer">
          <RootStackNavigatorBase.Screen
            name="Offer"
            component={Offer}
            initialParams={{ id: offerId, fromOfferId, openModalOnNavigation }}
          />
        </RootStackNavigatorBase.Navigator>
      </NavigationContainer>
    )
  )
}
