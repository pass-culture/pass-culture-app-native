import React from 'react'

import { render, screen, userEvent } from 'tests/utils'

import { BookingPriceStep } from './BookingPriceStep'

const HOUR = '2026-10-20T20:00:00.000Z'

let mockStocks: Array<Record<string, unknown>> = []

jest.mock('queries/offer/useOfferQuery', () => ({
  useOfferQuery: () => ({ data: { isDuo: false, stocks: mockStocks } }),
}))

jest.mock('features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit', () => ({
  useCreditForOffer: () => 10000,
}))

jest.mock('queries/settings/useSettings', () => ({
  usePacificFrancToEuroRate: () => ({ data: 1 }),
}))

const user = userEvent.setup()
jest.useFakeTimers()

const renderPriceStep = () => {
  const onSelectStock = jest.fn()
  render(<BookingPriceStep offerId={1} selectedHour={HOUR} onSelectStock={onSelectStock} />)
  return { onSelectStock }
}

describe('<BookingPriceStep />', () => {
  it('should select the price category available at the selected hour', async () => {
    mockStocks = [
      {
        id: 2,
        beginningDatetime: HOUR,
        price: 1000,
        features: [],
        isBookable: true,
        priceCategoryLabel: 'Plein tarif',
      },
      {
        id: 3,
        beginningDatetime: HOUR,
        price: 500,
        features: [],
        isBookable: true,
        priceCategoryLabel: 'Tarif réduit',
      },
    ]
    const { onSelectStock } = renderPriceStep()

    await user.press(screen.getByText('Tarif réduit'))

    expect(onSelectStock).toHaveBeenCalledWith({ stockId: 3, hour: HOUR })
  })

  it('should display the single price even without a price category label', async () => {
    mockStocks = [
      {
        id: 2,
        beginningDatetime: HOUR,
        price: 1000,
        features: [],
        isBookable: true,
        priceCategoryLabel: null,
      },
    ]
    const { onSelectStock } = renderPriceStep()

    await user.press(screen.getByText(/10\s?€/))

    expect(onSelectStock).toHaveBeenCalledWith({ stockId: 2, hour: HOUR })
  })
})
