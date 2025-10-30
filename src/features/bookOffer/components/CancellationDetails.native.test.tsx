import mockdate from 'mockdate'
import React from 'react'

import { OfferResponseV2, OfferStockResponse } from 'api/gen'
import { offerStockResponseSnap } from 'features/offer/fixtures/offerStockResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { CancellationDetails } from './CancellationDetails'

mockdate.set(new Date('2021-01-04T00:00:00Z'))
const pastDate = '2021-01-02T00:00:00'
const futureDate = '2021-01-06T00:00:00'

let mockStock: OfferStockResponse | undefined = undefined
jest.mock('features/bookOffer/helpers/useBookingStock', () => ({
  useBookingStock: jest.fn(() => mockStock),
}))

let mockOffer = { id: 1, isDuo: true } as unknown as OfferResponseV2
jest.mock('queries/offer/useBookingOfferQuery', () => ({
  useBookingOfferQuery: jest.fn(() => mockOffer),
}))

describe('<CancellationDetails /> when isDigital = true', () => {
  describe('activationCode with expiration date', () => {
    // eslint-disable-next-line jest/expect-expect
    it.each([null, pastDate, futureDate])(
      'should not be cancellable when cancellation limit date=%s',
      (cancellationLimitDatetime) => {
        mockStock = {
          ...offerStockResponseSnap,
          cancellationLimitDatetime,
          activationCode: { expirationDate: '2030-02-05T00:00:00Z' },
        }
        mockOffer = { ...mockOffer, isDigital: true } as unknown as OfferResponseV2
        render(reactQueryProviderHOC(<CancellationDetails />))

        expectNotCancellable()
      }
    )
  })

  describe('activationCode with no expiration date', () => {
    // eslint-disable-next-line jest/expect-expect
    it.each([null, pastDate, futureDate])(
      'should not be cancellable when cancellation limit date=%s',
      (cancellationLimitDatetime) => {
        mockStock = {
          ...offerStockResponseSnap,
          cancellationLimitDatetime,
          activationCode: { expirationDate: null },
        }
        mockOffer = { ...mockOffer, isDigital: true } as unknown as OfferResponseV2
        render(reactQueryProviderHOC(<CancellationDetails />))

        expectNotCancellable()
      }
    )
  })

  describe('no activationCode', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should be cancellable if no cancellation limit date', () => {
      mockStock = {
        ...offerStockResponseSnap,
        cancellationLimitDatetime: null,
        activationCode: null,
      }
      mockOffer = { ...mockOffer, isDigital: true } as unknown as OfferResponseV2
      render(reactQueryProviderHOC(<CancellationDetails />))

      expectCancellable()
    })

    // eslint-disable-next-line jest/expect-expect
    it('should not be cancellable if limitDate is past', () => {
      mockStock = {
        ...offerStockResponseSnap,
        cancellationLimitDatetime: pastDate,
        activationCode: null,
      }
      mockOffer = { ...mockOffer, isDigital: true } as unknown as OfferResponseV2
      render(reactQueryProviderHOC(<CancellationDetails />))

      expectNotCancellable()
    })

    // eslint-disable-next-line jest/expect-expect
    it('should be cancellable before limitDate if future', () => {
      mockStock = {
        ...offerStockResponseSnap,
        cancellationLimitDatetime: futureDate,
        activationCode: null,
      }
      mockOffer = { ...mockOffer, isDigital: true } as unknown as OfferResponseV2
      render(reactQueryProviderHOC(<CancellationDetails />))

      expectCancellableBefore()
    })
  })
})

const NOT_CANCELLABLE_MESSAGE =
  'En confirmant la réservation, j’accepte son exécution immédiate et renonce à mon droit de rétractation. Une confirmation de cet accord me sera envoyée par email.'
const CANCELLABLE_MESSAGE = /Cette réservation est annulable/
const CANCELLABLE_BEFORE_LIMIT_DATE_MESSAGE = /Cette réservation peut être annulée jusqu’au/

const expectNotCancellable = () => {
  expect(screen.getByText(NOT_CANCELLABLE_MESSAGE)).toBeOnTheScreen()
  expect(screen.queryByText(CANCELLABLE_MESSAGE)).not.toBeOnTheScreen()
  expect(screen.queryByText(CANCELLABLE_BEFORE_LIMIT_DATE_MESSAGE)).not.toBeOnTheScreen()
}

const expectCancellable = () => {
  expect(screen.queryByText(NOT_CANCELLABLE_MESSAGE)).not.toBeOnTheScreen()
  expect(screen.getByText(CANCELLABLE_MESSAGE)).toBeOnTheScreen()
  expect(screen.queryByText(CANCELLABLE_BEFORE_LIMIT_DATE_MESSAGE)).not.toBeOnTheScreen()
}

const expectCancellableBefore = () => {
  expect(screen.queryByText(NOT_CANCELLABLE_MESSAGE)).not.toBeOnTheScreen()
  expect(screen.queryByText(CANCELLABLE_MESSAGE)).not.toBeOnTheScreen()
  expect(screen.getByText(CANCELLABLE_BEFORE_LIMIT_DATE_MESSAGE)).toBeOnTheScreen()
}
