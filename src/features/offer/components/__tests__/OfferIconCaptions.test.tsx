import { act, render } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { CategoryNameEnum, OfferResponse, UserProfileResponse } from 'api/gen'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { flushAllPromises } from 'tests/utils'

import { OfferIconCaptions } from '../OfferIconCaptions'

const defaultBookableStocks: OfferResponse['bookableStocks'] = [
  { id: 1, price: 28.0, beginningDatetime: new Date('2021-01-04T13:30:00') },
]
const freeBookableStocks: OfferResponse['bookableStocks'] = [
  { id: 1, price: 0, beginningDatetime: new Date('2021-01-04T13:30:00') },
]
const sevenEurosBookableStocks: OfferResponse['bookableStocks'] = [
  { id: 1, price: 7, beginningDatetime: new Date('2021-01-04T13:30:00') },
]
const noStocks: OfferResponse['bookableStocks'] = []

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const userProfileAPIResponse: UserProfileResponse = {
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
      component.unmount()
    }
  )

  it.each`
    price        | duo      | beneficiary | expectedDisplayedPrice
    ${'7'}       | ${false} | ${true}     | ${'7 €'}
    ${'7'}       | ${true}  | ${true}     | ${'7 € / place'}
    ${'7'}       | ${true}  | ${false}    | ${'7 €'}
    ${'free'}    | ${false} | ${true}     | ${'Gratuit'}
    ${'free'}    | ${true}  | ${true}     | ${'Gratuit'}
    ${'free'}    | ${true}  | ${false}    | ${'Gratuit'}
    ${'noPrice'} | ${false} | ${true}     | ${''}
    ${'noPrice'} | ${true}  | ${true}     | ${''}
    ${'noPrice'} | ${true}  | ${false}    | ${''}
  `('should show right price', async ({ price, duo, beneficiary, expectedDisplayedPrice }) => {
    let bookableStocks: OfferResponse['bookableStocks'] = freeBookableStocks
    if (price === '7') bookableStocks = sevenEurosBookableStocks
    if (price === 'noPrice') bookableStocks = noStocks

    const component = await renderOfferIconCaptions({
      isDuo: duo,
      bookableStocks,
      isBeneficiary: beneficiary,
    })
    await waitForExpect(() => {
      const euro = component.getByTestId('caption-iconPrice')
      expect(euro.props.children).toEqual(expectedDisplayedPrice)
    })
    component.unmount()
  })
})

async function renderOfferIconCaptions({
  isDuo = false,
  isBeneficiary = true,
  bookableStocks,
}: {
  bookableStocks?: OfferResponse['bookableStocks']
  isDuo?: boolean
  isBeneficiary?: boolean
}) {
  server.use(
    rest.get(env.API_BASE_URL + '/native/v1/me', (_req, res, ctx) =>
      res.once(ctx.status(200), ctx.json({ ...userProfileAPIResponse, isBeneficiary }))
    )
  )
  const wrapper = render(
    reactQueryProviderHOC(
      <OfferIconCaptions
        bookableStocks={bookableStocks ?? defaultBookableStocks}
        isDuo={isDuo}
        label="Abonnements concerts"
        category={CategoryNameEnum.MUSIQUE}
      />
    )
  )
  await act(async () => {
    await flushAllPromises()
  })
  return wrapper
}
