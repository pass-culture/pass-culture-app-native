import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { ArchiveBookingModal } from 'features/bookings/components/ArchiveBookingModal'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { fireEvent, render, superFlushWithAct } from 'tests/utils'

describe('<ArchiveBookingModal />', () => {
  it('should call on onDismiss', () => {
    const onDismiss = jest.fn()
    const { getByTestId } = renderArchiveDigitalBookingOfferModal(onDismiss)
    const button = getByTestId('button-container-back-to-booking')
    fireEvent.press(button)
    expect(onDismiss).toBeCalled()
  })
  it('should call the mutation without failure', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/bookings/232423/toggle_display', (req, res, ctx) =>
        res.once(ctx.status(204))
      )
    )
    const onDismiss = jest.fn()
    const { getByText } = renderArchiveDigitalBookingOfferModal(onDismiss)

    const cancelButton = getByText('Terminer ma réservation')

    fireEvent.press(cancelButton)

    await superFlushWithAct()

    await waitForExpect(() => {
      expect(onDismiss).toBeCalled()
    })
  })
})

function renderArchiveDigitalBookingOfferModal(onDismiss: () => void) {
  return render(reactQueryProviderHOC(<ArchiveBookingModal visible onDismiss={onDismiss} />))
}
