import React from 'react'

import { render, screen, userEvent } from 'tests/utils'

import { BookingHourStep } from './BookingHourStep'

const HOUR = '2026-10-20T20:00:00.000Z'

let mockStocks: Array<Record<string, unknown>> = [
  {
    id: 2,
    beginningDatetime: HOUR,
    price: 1000,
    features: ['VO'],
    isBookable: true,
    priceCategoryLabel: null,
  },
]

jest.mock('queries/offer/useOfferQuery', () => ({
  useOfferQuery: () => ({
    data: {
      isDuo: false,
      stocks: mockStocks,
    },
  }),
}))

jest.mock('features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit', () => ({
  useCreditForOffer: () => 10000,
}))

jest.mock('queries/settings/useSettings', () => ({
  usePacificFrancToEuroRate: () => ({ data: 1 }),
}))

const user = userEvent.setup()
jest.useFakeTimers()

const renderHourStep = () => {
  const onSelectHour = jest.fn()
  const onSelectStock = jest.fn()
  render(
    <BookingHourStep
      offerId={1}
      selectedDate="2026-10-20"
      onSelectHour={onSelectHour}
      onSelectStock={onSelectStock}
    />
  )
  return { onSelectHour, onSelectStock }
}

describe('<BookingHourStep />', () => {
  beforeEach(() => {
    mockStocks = [
      {
        id: 2,
        beginningDatetime: HOUR,
        price: 1000,
        features: ['VO'],
        isBookable: true,
        priceCategoryLabel: null,
      },
    ]
  })

  it('should select the screening when choosing an hour', async () => {
    const { onSelectStock } = renderHourStep()

    await user.press(screen.getByText(/22h00|20h00/))

    expect(onSelectStock).toHaveBeenCalledWith({ stockId: 2, hour: HOUR })
  })
})
