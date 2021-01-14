import { render, waitFor } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import { QueryClient } from 'react-query'
import waitForExpect from 'wait-for-expect'

import { CategoryNameEnum, OfferResponse, UserProfileResponse } from 'api/gen'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'

import { OfferIconCaptions } from '../OfferIconCaptions'

const defaultBookableStocks: OfferResponse['stocks'] = [
  { id: 1, price: 28.0, beginningDatetime: new Date('2021-01-04T13:30:00'), isBookable: true },
]
const freeBookableStocks: OfferResponse['stocks'] = [
  { id: 1, price: 0, beginningDatetime: new Date('2021-01-04T13:30:00'), isBookable: true },
]
const sevenEurosBookableStocks: OfferResponse['stocks'] = [
  { id: 1, price: 7, beginningDatetime: new Date('2021-01-04T13:30:00'), isBookable: true },
]
const severalStocks: OfferResponse['stocks'] = [
  { id: 1, price: 7, beginningDatetime: new Date('2021-01-04T13:30:00'), isBookable: true },
  { id: 2, price: 2, beginningDatetime: new Date('2021-01-03T13:30:00'), isBookable: false },
]
const noBookableStocks: OfferResponse['stocks'] = [
  { id: 1, price: 7, beginningDatetime: new Date('2021-01-04T13:30:00'), isBookable: false },
  { id: 2, price: 9, beginningDatetime: new Date('2021-01-03T13:30:00'), isBookable: false },
]
const noPrice: OfferResponse['stocks'] = []

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const userProfileAPIResponse: UserProfileResponse = {
  expenses: [],
  email: 'email@domain.ext',
  firstName: 'Jean',
  isBeneficiary: true,
}

describe('<OfferIconCaptions />', () => {
  it('should match snapshot', async () => {
    const { toJSON } = await renderOfferIconCaptions({})
    expect(toJSON()).toMatchSnapshot()
  })

  it.each`
    duo      | beneficiary | show
    ${true}  | ${true}     | ${'show'}
    ${false} | ${true}     | ${'not show'}
    ${true}  | ${false}    | ${'not show'}
    ${false} | ${false}    | ${'not show'}
  `(
    'should $show Icon isDuo for Duo=$duo offers for beneficiary=$beneficiary users',
    async ({ show, duo, beneficiary }) => {
      const component = await renderOfferIconCaptions({
        isDuo: duo,
        isBeneficiary: beneficiary,
      })
      await waitForExpect(() => {
        if (show === 'show') {
          expect(component.queryByText(/À deux !/)).toBeTruthy()
        } else {
          expect(component.queryByText(/À deux !/)).toBeNull()
        }
      })
    }
  )

  it.each`
    stocks                      | isDuo    | isBeneficiary | expectedDisplayedPrice
    ${sevenEurosBookableStocks} | ${false} | ${true}       | ${'7 €'}
    ${sevenEurosBookableStocks} | ${true}  | ${true}       | ${'7 € / place'}
    ${sevenEurosBookableStocks} | ${true}  | ${false}      | ${'7 €'}
    ${freeBookableStocks}       | ${false} | ${true}       | ${'Gratuit'}
    ${freeBookableStocks}       | ${true}  | ${true}       | ${'Gratuit'}
    ${freeBookableStocks}       | ${true}  | ${false}      | ${'Gratuit'}
    ${noPrice}                  | ${false} | ${true}       | ${''}
    ${noPrice}                  | ${true}  | ${true}       | ${''}
    ${noPrice}                  | ${true}  | ${false}      | ${''}
    ${severalStocks}            | ${true}  | ${false}      | ${'7 €'}
    ${noBookableStocks}         | ${true}  | ${false}      | ${'Dès 7 €'}
  `('should show right price', async ({ stocks, isDuo, isBeneficiary, expectedDisplayedPrice }) => {
    const component = await renderOfferIconCaptions({ isDuo, stocks, isBeneficiary })
    await waitForExpect(() => {
      const euro = component.getByTestId('caption-iconPrice')
      expect(euro.props.children).toEqual(expectedDisplayedPrice)
    })
  })
})

async function renderOfferIconCaptions({
  isDuo = false,
  isBeneficiary = true,
  stocks,
}: {
  stocks?: OfferResponse['stocks']
  isDuo?: boolean
  isBeneficiary?: boolean
}) {
  server.use(
    rest.get(env.API_BASE_URL + '/native/v1/me', (_req, res, ctx) =>
      res.once(ctx.status(200), ctx.json({ ...userProfileAPIResponse, isBeneficiary }))
    )
  )
  const setup = (queryClient: QueryClient) => {
    queryClient.removeQueries()
  }

  const wrapper = render(
    reactQueryProviderHOC(
      <OfferIconCaptions
        stocks={stocks ?? defaultBookableStocks}
        isDuo={isDuo}
        label="Abonnements concerts"
        category={CategoryNameEnum.MUSIQUE}
      />,
      setup
    )
  )
  await waitFor(() => {
    expect(wrapper.queryByTestId('iconPrice')).toBeTruthy()
  })
  return wrapper
}
