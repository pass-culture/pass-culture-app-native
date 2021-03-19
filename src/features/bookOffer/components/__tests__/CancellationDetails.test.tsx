import { render } from '@testing-library/react-native'
import mockdate from 'mockdate'
import React from 'react'

import { CategoryType, OfferStockResponse } from 'api/gen'
import { notExpiredStock } from 'features/offer/services/useCtaWordingAndAction.testsFixtures'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { CancellationDetails, formatDate } from '../CancellationDetails'

mockdate.set(new Date('2021-01-04T00:00:00Z'))
const pastDate = new Date('2021-01-02T00:00:00Z')
const futureDate = new Date('2021-01-06T00:00:00Z')

describe('formatDate()', () => {
  it.each`
    limitDate                        | expected
    ${'2021-02-23T13:45:00'}         | ${'23 février 2021, 13h45'}
    ${new Date(2021, 4, 3, 9, 30)}   | ${'3 mai 2021, 9h30'}
    ${new Date(2021, 11, 16, 15, 0)} | ${'16 décembre 2021, 15h00'}
  `(
    'should format Date $limitDate to string "$expected"',
    ({ limitDate, expected }: { limitDate: Date; expected: string }) => {
      expect(formatDate(limitDate)).toEqual(expected)
    }
  )
})

let mockStock: OfferStockResponse | undefined = undefined
let mockCategoryType: CategoryType = CategoryType.Thing
jest.mock('features/bookOffer/pages/BookingOfferWrapper', () => ({
  useBookingOffer: jest.fn(() => ({
    category: { categoryType: mockCategoryType },
  })),
  useBookingStock: jest.fn(() => mockStock),
}))

interface Props {
  cancellationLimitDatetime: OfferStockResponse['cancellationLimitDatetime']
  category: CategoryType
  cancellable: boolean
}

describe('<CancellationDetails />', () => {
  it.each`
    cancellationLimitDatetime | category              | cancellable
    ${null}                   | ${CategoryType.Thing} | ${false}
    ${pastDate}               | ${CategoryType.Thing} | ${false}
    ${futureDate}             | ${CategoryType.Thing} | ${false}
    ${null}                   | ${CategoryType.Event} | ${false}
    ${pastDate}               | ${CategoryType.Event} | ${false}
    ${futureDate}             | ${CategoryType.Event} | ${true}
  `(
    'should be cancellable=$cancellable for category=$category and date=$cancellationLimitDatetime',
    ({ cancellationLimitDatetime, category, cancellable }: Props) => {
      mockStock = { ...notExpiredStock, cancellationLimitDatetime }
      mockCategoryType = category

      const page = render(reactQueryProviderHOC(<CancellationDetails />))

      if (cancellable) {
        expect(page.queryByText(/Cette réservation peut être annulée jusqu’au/)).toBeTruthy()
        expect(page.queryByText(/Cette réservation n’est pas annulable/)).toBeFalsy()
      } else {
        expect(page.queryByText(/Cette réservation peut être annulée jusqu’au/)).toBeFalsy()
        expect(page.queryByText(/Cette réservation n’est pas annulable/)).toBeTruthy()
      }
    }
  )
})
