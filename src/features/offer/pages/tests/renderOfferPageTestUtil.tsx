import { NavigationContainer } from '@react-navigation/native'
import { render } from '@testing-library/react-native'
import { rest } from 'msw/'
import React from 'react'
import { UseQueryResult } from 'react-query'
import waitForExpect from 'wait-for-expect'

import { OfferResponse, UserProfileResponse } from 'api/gen'
import { RootStack } from 'features/navigation/RootNavigator'
import { offerResponseSnap } from 'features/offer/api/snaps/offerResponseSnap'
import { dehumanizeId } from 'features/offer/services/dehumanizeId'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { superFlushWithAct } from 'tests/utils'

import { Offer } from '../Offer'

jest.mock('libs/geolocation')

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.mock('features/offer/services/useItinerary', () => ({
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

const humanizedOfferId = 'AHD3A'
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const offerId = dehumanizeId(humanizedOfferId)!

export async function renderOfferPage(extraOffer?: Partial<Omit<OfferResponse, 'id'>>) {
  server.use(
    rest.get<OfferResponse>(env.API_BASE_URL + `/native/v1/offer/${offerId}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json({ ...offerResponseSnap, ...extraOffer }))
    )
  )

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
    expect(wrapper.queryByTestId('CTA-button')).toBeTruthy()
  })

  return wrapper
}
