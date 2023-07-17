import React from 'react'
import { QueryClient } from 'react-query'

import { CategoryIdEnum, OfferResponse, UserProfileResponse, YoungStatusType } from 'api/gen'
import * as Auth from 'features/auth/context/AuthContext'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'

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
    features: [],
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
    features: [],
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
    features: [],
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
    features: [],
  },
  {
    id: 2,
    price: 200,
    beginningDatetime: '2021-01-03T13:30:00',
    isBookable: false,
    isExpired: false,
    isForbiddenToUnderage: false,
    isSoldOut: false,
    features: [],
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
    features: [],
  },
  {
    id: 2,
    price: 900,
    beginningDatetime: '2021-01-03T13:30:00',
    isBookable: false,
    isExpired: false,
    isForbiddenToUnderage: false,
    isSoldOut: false,
    features: [],
  },
]
const noPrice: OfferResponse['stocks'] = []

const mockUseAuthContext = jest.spyOn(Auth, 'useAuthContext')

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
  requiresIdCheck: false,
  roles: [],
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
  },
  status: { statusType: YoungStatusType.beneficiary },
}

describe('<OfferIconCaptions />', () => {
  it('should match snapshot', async () => {
    renderOfferIconCaptions({})

    expect(screen).toMatchSnapshot()
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
      renderOfferIconCaptions({
        isDuo: duo,
        isBeneficiary: beneficiary,
      })

      await waitFor(() => {
        if (show === 'show') {
          expect(screen.queryByText(/À deux !/)).toBeTruthy()
        } else {
          expect(screen.queryByText(/À deux !!/)).toBeNull()
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
    renderOfferIconCaptions({ isDuo, stocks, isBeneficiary })

    const euro = await screen.findByTestId('caption-iconPrice')
    expect(euro.props.children).toEqual(expectedDisplayedPrice)
  })
})

function renderOfferIconCaptions({
  isDuo = false,
  isBeneficiary = true,
  stocks,
}: {
  stocks?: OfferResponse['stocks']
  isDuo?: boolean
  isBeneficiary?: boolean
}) {
  mockUseAuthContext.mockReturnValueOnce({
    isLoggedIn: true,
    user: { ...userProfileAPIResponse, isBeneficiary },
    isUserLoading: false,
    refetchUser: jest.fn(),
    setIsLoggedIn: () => null,
  })

  const setup = (queryClient: QueryClient) => {
    queryClient.removeQueries()
  }

  return render(
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
}
