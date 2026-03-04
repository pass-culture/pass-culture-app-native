import React, { ComponentProps } from 'react'

import { ReactionTypeEnum } from 'api/gen'
import { EndedBookingListItemWrapper } from 'features/bookings/components/EndedBookingListItemWrapper'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

const mockHandleShowReactionModal = jest.fn()

const user = userEvent.setup()

describe('EndedBookingListItemWrapper', () => {
  it('should display like button when user can react and has not reacted yet', () => {
    const booking = mockBuilder.endedBookingListItemResponse({ canReact: true, userReaction: null })

    renderComponent({
      booking,
    })

    expect(
      screen.getByLabelText(
        `Ouvrir la modale de réaction pour la réservation ${booking.stock.offer.name}`
      )
    ).toBeOnTheScreen()
  })

  it('should not display like button when user has already reacted', () => {
    const booking = mockBuilder.endedBookingListItemResponse({
      canReact: true,
      userReaction: ReactionTypeEnum.LIKE,
    })

    renderComponent({
      booking,
    })

    expect(
      screen.queryByLabelText(
        `Ouvrir la modale de réaction pour la réservation ${booking.stock.offer.name}`
      )
    ).not.toBeOnTheScreen()
  })

  it('should call handleShowReactionModal when pressing like button', async () => {
    const booking = mockBuilder.endedBookingListItemResponse({
      canReact: true,
      userReaction: null,
    })

    renderComponent({ booking })

    await user.press(
      screen.getByLabelText(
        `Ouvrir la modale de réaction pour la réservation ${booking.stock.offer.name}`
      )
    )

    expect(mockHandleShowReactionModal).toHaveBeenCalledWith(booking)
  })
})

type RenderComponentType = Partial<ComponentProps<typeof EndedBookingListItemWrapper>>

const renderComponent = ({
  booking = mockBuilder.endedBookingListItemResponse(),
  handleShowReactionModal = mockHandleShowReactionModal,
}: RenderComponentType = {}) => {
  return render(
    reactQueryProviderHOC(
      <EndedBookingListItemWrapper
        booking={booking}
        handleShowReactionModal={handleShowReactionModal}
      />
    )
  )
}
