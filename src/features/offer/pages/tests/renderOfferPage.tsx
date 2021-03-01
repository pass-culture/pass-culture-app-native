import { NavigationContainer } from '@react-navigation/native'
import { act, render } from '@testing-library/react-native'
import { rest } from 'msw/'
import React from 'react'
import { UseQueryResult } from 'react-query'
import waitForExpect from 'wait-for-expect'

import { Expense, ExpenseDomain, OfferResponse, UserProfileResponse } from 'api/gen'
import { RootStack } from 'features/navigation/RootNavigator'
import { offerResponseSnap } from 'features/offer/api/snaps/offerResponseSnap'
import { dehumanizeId } from 'features/offer/services/dehumanizeId'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { flushAllPromises } from 'tests/utils'

import { Offer } from '../Offer'

jest.mock('libs/geolocation')

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.mock('features/offer/services/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

const mockExpenses: Array<Expense> = [
  { current: 100, domain: ExpenseDomain.All, limit: 500 },
  { current: 50, domain: ExpenseDomain.Digital, limit: 100 },
  { current: 50, domain: ExpenseDomain.Physical, limit: 200 },
]

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(
    () =>
      ({
        isLoading: false,
        data: {
          email: 'email2@domain.ext',
          firstName: 'Jean',
          isBeneficiary: true,
          expenses: mockExpenses,
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

  await act(async () => {
    await flushAllPromises()
  })

  await waitForExpect(() => {
    expect(wrapper.queryByTestId('offer-container')).toBeTruthy()
    expect(wrapper.queryByTestId('CTA-button')).toBeTruthy()
  })

  return wrapper
}
