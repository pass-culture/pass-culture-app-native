import React from 'react'

import { render, screen, userEvent } from 'tests/utils'

import { BookingDuoStep } from './BookingDuoStep'

const mockOffer = {
  isDuo: true,
  stocks: [{ id: 2, price: 1000, beginningDatetime: '2026-10-20T20:00:00Z' }],
}

jest.mock('queries/offer/useOfferQuery', () => ({
  useOfferQuery: ({ select }: { select?: (data: typeof mockOffer) => unknown }) => ({
    data: select ? select(mockOffer) : mockOffer,
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

describe('<BookingDuoStep />', () => {
  it('should call onSelectQuantity when choosing Duo', async () => {
    const onSelectQuantity = jest.fn()
    render(<BookingDuoStep offerId={1} stockId={2} onSelectQuantity={onSelectQuantity} />)

    await user.press(screen.getByText('Duo'))

    expect(onSelectQuantity).toHaveBeenCalledWith(2)
  })

  it('should call onSelectQuantity when choosing Solo', async () => {
    const onSelectQuantity = jest.fn()
    render(<BookingDuoStep offerId={1} stockId={2} onSelectQuantity={onSelectQuantity} />)

    await user.press(screen.getByText('Solo'))

    expect(onSelectQuantity).toHaveBeenCalledWith(1)
  })
})
