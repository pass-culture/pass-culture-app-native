import { rest } from 'msw'
import React from 'react'
import { QueryClient } from 'react-query'
import waitForExpect from 'wait-for-expect'

import { CategoryIdEnum, OfferResponse, UserProfileResponse, YoungStatusType } from 'api/gen'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { render, waitFor } from 'tests/utils'

import { OfferIconCaptions } from './OfferIconCaptions'

jest.mock('libs/react-query/usePersistQuery', () => ({
  usePersistQuery: jest.requireActual('react-query').useQuery,
}))

const defaultBookableStocks: OfferResponse['stocks'] = [
  {
    id: 1,
    price: 2800,
    beginningDatetime: '2021-01-04T13:30:00',
    isBookable: true,
    isExpired: false,
    isForbiddenToUnderage: false,
    isSoldOut: false,
  },
]
const freeBookableStocks: OfferResponse['stocks'] = [
  {
    id: 1,
    price: 0,
    beginningDatetime: '2021-01-04T13:30:00',
    isBookable: true,
    isExpired: false,
    isForbiddenToUnderage: false,
    isSoldOut: false,
  },
]
const sevenEurosBookableStocks: OfferResponse['stocks'] = [
  {
    id: 1,
    price: 700,
    beginningDatetime: '2021-01-04T13:30:00',
    isBookable: true,
    isExpired: false,
    isForbiddenToUnderage: false,
    isSoldOut: false,
  },
]
const severalStocks: OfferResponse['stocks'] = [
  {
    id: 1,
    price: 700,
    beginningDatetime: '2021-01-04T13:30:00',
    isBookable: true,
    isExpired: false,
    isForbiddenToUnderage: false,
    isSoldOut: false,
  },
  {
    id: 2,
    price: 200,
    beginningDatetime: '2021-01-03T13:30:00',
    isBookable: false,
    isExpired: false,
    isForbiddenToUnderage: false,
    isSoldOut: false,
  },
]
const noBookableStocks: OfferResponse['stocks'] = [
  {
    id: 1,
    price: 700,
    beginningDatetime: '2021-01-04T13:30:00',
    isBookable: false,
    isExpired: false,
    isForbiddenToUnderage: false,
    isSoldOut: false,
  },
  {
    id: 2,
    price: 900,
    beginningDatetime: '2021-01-03T13:30:00',
    isBookable: false,
    isExpired: false,
    isForbiddenToUnderage: false,
    isSoldOut: false,
  },
]
const noPrice: OfferResponse['stocks'] = []

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const userProfileAPIResponse: UserProfileResponse = {
  bookedOffers: {},
  email: 'email@domain.ext',
  firstName: 'Jean',
  isBeneficiary: true,
  domainsCredit: { all: { remaining: 30000, initial: 50000 }, physical: null, digital: null },
  needsToFillCulturalSurvey: true,
  showEligibleCard: false,
  isEligibleForBeneficiaryUpgrade: false,
  id: 1234,
  roles: [],
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
  },
  youngStatus: { statusType: YoungStatusType.beneficiary },
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
          expect(component.queryByText(/À deux !!/)).toBeNull()
        }
      })
    }
  )

  it.each`
    stocks                      | isDuo    | isBeneficiary | expectedDisplayedPrice
    ${sevenEurosBookableStocks} | ${false} | ${true}       | ${'7\u00a0€'}
    ${sevenEurosBookableStocks} | ${true}  | ${true}       | ${'7\u00a0€ / place'}
    ${sevenEurosBookableStocks} | ${true}  | ${false}      | ${'7\u00a0€'}
    ${freeBookableStocks}       | ${false} | ${true}       | ${'Gratuit'}
    ${freeBookableStocks}       | ${true}  | ${true}       | ${'Gratuit'}
    ${freeBookableStocks}       | ${true}  | ${false}      | ${'Gratuit'}
    ${noPrice}                  | ${false} | ${true}       | ${''}
    ${noPrice}                  | ${true}  | ${true}       | ${''}
    ${noPrice}                  | ${true}  | ${false}      | ${''}
    ${severalStocks}            | ${true}  | ${false}      | ${'7\u00a0€'}
    ${noBookableStocks}         | ${true}  | ${false}      | ${'Dès 7\u00a0€'}
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
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <OfferIconCaptions
        stocks={stocks ?? defaultBookableStocks}
        isDuo={isDuo}
        label="Abonnements concerts"
        categoryId={CategoryIdEnum.MUSIQUE_LIVE}
      />,
      setup
    )
  )
  await waitFor(() => {
    expect(wrapper.queryByTestId('iconPrice')).toBeTruthy()
  })
  return wrapper
}
