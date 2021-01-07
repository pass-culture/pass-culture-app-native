import { NavigationContainer } from '@react-navigation/native'
import { act, render } from '@testing-library/react-native'
import React from 'react'
import { QueryClient, UseQueryResult } from 'react-query'
import waitForExpect from 'wait-for-expect'

import { UserProfileResponse } from 'api/gen'
import { mergeOfferData } from 'features/home/atoms/OfferTile'
import { RootStack } from 'features/navigation/RootNavigator'
import { offerResponseSnap } from 'features/offer/api/snaps/offerResponseSnap'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromises } from 'tests/utils'

import { Offer } from '../Offer'

import { offerId } from './renderOfferPage'

jest.mock('libs/geolocation')

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.mock('features/offer/services/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(
    () =>
      ({
        isLoading: false,
        data: { email: 'email2@domain.ext', firstName: 'Jean', isBeneficiary: true },
      } as UseQueryResult<UserProfileResponse>)
  ),
}))

describe('<Offer  /> - OfferTile to Offer transition', () => {
  it('should open Offer with prepopulated react-query cache', async () => {
    const setup = (queryClient: QueryClient) => {
      queryClient.removeQueries()
      queryClient.setQueryData(
        ['offer', offerId],
        mergeOfferData({
          category: offerResponseSnap.category.label,
          description: offerResponseSnap.description,
          thumbUrl: offerResponseSnap.image?.url,
          isDuo: offerResponseSnap.isDuo,
          name: offerResponseSnap.name,
          offerId,
        })
      )
    }

    const wrapper = render(
      reactQueryProviderHOC(
        <NavigationContainer>
          <RootStack.Navigator initialRouteName="Offer">
            <RootStack.Screen name="Offer" component={Offer} initialParams={{ id: offerId }} />
          </RootStack.Navigator>
        </NavigationContainer>,
        setup
      )
    )

    const initialSnapshot = wrapper.toJSON()
    expect(wrapper.queryByText('Accessibilité')).toBeFalsy()

    await act(async () => {
      await flushAllPromises()
    })

    await waitForExpect(() => {
      expect(wrapper.queryByTestId('offer-container')).toBeTruthy()
      expect(wrapper.queryByTestId('CTA-button')).toBeTruthy()
    })

    expect(wrapper.toJSON()).toMatchDiffSnapshot(initialSnapshot)
    expect(wrapper.queryByText('Accessibilité')).toBeTruthy()
  })
})
