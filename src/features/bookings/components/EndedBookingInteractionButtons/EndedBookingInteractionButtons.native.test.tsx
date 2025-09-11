import React from 'react'

import { BookingResponse, ReactionTypeEnum } from 'api/gen'
import { EndedBookingInteractionButtons } from 'features/bookings/components/EndedBookingInteractionButtons/EndedBookingInteractionButtons'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

describe('EndedBookingInteractionButtons', () => {
  jest.useFakeTimers()

  beforeEach(() => {
    setFeatureFlags()
  })

  it('should not display reaction button when reaction feature flag deactivated', async () => {
    renderEndedBookingInteractionButtons(bookingsSnapV2.endedBookings[1])

    await screen.findByLabelText('Partager l’offre Avez-vous déjà vu ?')

    expect(screen.queryByLabelText('Réagis à ta réservation')).toBeNull()
  })

  describe('when reaction feature flag is activated', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
    })

    it('should not display reaction button when native category id not included', async () => {
      renderEndedBookingInteractionButtons(bookingsSnapV2.endedBookings[1])

      await screen.findByLabelText('Partager l’offre Avez-vous déjà vu ?')

      expect(screen.queryByLabelText('Réagis à ta réservation')).toBeNull()
    })

    it('should display reaction button', async () => {
      renderEndedBookingInteractionButtons({ ...bookingsSnapV2.endedBookings[1], canReact: true })

      expect(await screen.findByLabelText('Réagis à ta réservation')).toBeOnTheScreen()
    })

    it.each([
      [ReactionTypeEnum.LIKE, /tu as liké/],
      [ReactionTypeEnum.DISLIKE, /tu as disliké/],
      [ReactionTypeEnum.NO_REACTION, /tu n’as pas souhaité réagir/],
    ])(
      'should display correct icon and correct a11y label when data has reaction %s',
      async (userReaction, labelRegex) => {
        renderEndedBookingInteractionButtons({
          ...bookingsSnapV2.endedBookings[1],
          userReaction,
          canReact: true,
        })

        expect(await screen.findByLabelText(labelRegex)).toBeOnTheScreen()
      }
    )

    it('should display a small badge when offer is waiting for a reaction', async () => {
      renderEndedBookingInteractionButtons({
        ...bookingsSnapV2.endedBookings[1],
        userReaction: null,
        canReact: true,
      })

      expect(await screen.findByTestId('smallBadge')).toBeOnTheScreen()
    })
  })
})

function renderEndedBookingInteractionButtons(booking: BookingResponse) {
  return render(
    reactQueryProviderHOC(
      <EndedBookingInteractionButtons
        booking={booking}
        handlePressShareOffer={jest.fn()}
        handleShowReactionModal={jest.fn()}
      />
    )
  )
}
