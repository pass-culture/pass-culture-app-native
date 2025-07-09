import React from 'react'

import { OfferResponseV2 } from 'api/gen'
import * as useGoBack from 'features/navigation/useGoBack'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { OfferVideoPreview } from 'features/offer/pages/OfferVideoPreview/OfferVideoPreview'
import { render, screen, userEvent } from 'tests/utils'

const mockOffer = jest.fn((): { data: OfferResponseV2 } => ({
  data: offerResponseSnap,
}))

jest.mock('queries/offer/useOfferQuery', () => ({
  useOfferQuery: () => mockOffer(),
}))

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<OfferPreview />', () => {
  it('should display offer video preview page', () => {
    render(<OfferVideoPreview />)

    expect(screen.getByText('Vidéo Sous les étoiles de Paris - VF')).toBeOnTheScreen()
  })

  it('should execute go back when pressing go back button', async () => {
    render(<OfferVideoPreview />)

    await user.press(screen.getByLabelText('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })
})
