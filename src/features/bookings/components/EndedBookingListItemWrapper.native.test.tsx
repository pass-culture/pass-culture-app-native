import React, { ComponentProps } from 'react'

import {
  EndedBookingListItemWrapper,
  LIKE_BUTTON_ACCESSIBILITY_LABEL,
} from 'features/bookings/components/EndedBookingListItemWrapper'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/subcategories/useSubcategory')

const mockHandleShowReactionModal = jest.fn()

const user = userEvent.setup()

describe('EndedBookingListItemWrapper', () => {
  jest.useFakeTimers()

  it('should display like button when user can react', () => {
    renderComponent({
      booking: mockBuilder.endedBookingListItemResponse({ canReact: true, userReaction: null }),
    })

    expect(screen.getByLabelText(LIKE_BUTTON_ACCESSIBILITY_LABEL)).toBeOnTheScreen()
  })

  it('should call handleShowReactionModal when pressing like button', async () => {
    const booking = mockBuilder.endedBookingListItemResponse({ canReact: true, userReaction: null })
    renderComponent({ booking })

    await user.press(screen.getByLabelText(LIKE_BUTTON_ACCESSIBILITY_LABEL))

    expect(mockHandleShowReactionModal).toHaveBeenCalledWith(booking)
  })
})

type RenderComponentType = Partial<ComponentProps<typeof EndedBookingListItemWrapper>>

function renderComponent({
  booking = mockBuilder.endedBookingListItemResponse(),
  handleShowReactionModal = mockHandleShowReactionModal,
}: RenderComponentType = {}) {
  return render(
    reactQueryProviderHOC(
      <EndedBookingListItemWrapper
        booking={booking}
        handleShowReactionModal={handleShowReactionModal}
      />
    )
  )
}
