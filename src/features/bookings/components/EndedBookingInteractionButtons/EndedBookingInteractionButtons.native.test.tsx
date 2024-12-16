import React from 'react'

import { BookingReponse, NativeCategoryIdEnumv2, ReactionTypeEnum } from 'api/gen'
import { EndedBookingInteractionButtons } from 'features/bookings/components/EndedBookingInteractionButtons/EndedBookingInteractionButtons'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

const mockGetConfigValues = jest.fn()
jest.mock('libs/firebase/remoteConfig/remoteConfig.services', () => ({
  remoteConfig: {
    configure: () => Promise.resolve(true),
    refresh: () => Promise.resolve(true),
    getValues: () => mockGetConfigValues(),
  },
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('EndedBookingInteractionButtons', () => {
  jest.useFakeTimers()

  beforeAll(() => {
    mockGetConfigValues.mockReturnValue({
      reactionCategories: { categories: ['SEANCES_DE_CINEMA'] },
    })
  })

  it('should not display reaction button when reaction feature flag deactivated', async () => {
    renderEndedBookingInteractionButtons(
      bookingsSnap.ended_bookings[1],
      NativeCategoryIdEnumv2.SEANCES_DE_CINEMA
    )

    await screen.findByLabelText('Partager l’offre Avez-vous déjà vu ?')

    expect(screen.queryByLabelText('Réagis à ta réservation')).toBeNull()
  })

  describe('when reaction feature flag is activated', () => {
    beforeAll(() => {
      useFeatureFlagSpy.mockReturnValue(true)
    })

    it('should not display reaction button when native category id not included', async () => {
      renderEndedBookingInteractionButtons(
        bookingsSnap.ended_bookings[1],
        NativeCategoryIdEnumv2.CARTES_CINEMA,
        false
      )

      await screen.findByLabelText('Partager l’offre Avez-vous déjà vu ?')

      expect(screen.queryByLabelText('Réagis à ta réservation')).toBeNull()
    })

    it('should display reaction button', async () => {
      renderEndedBookingInteractionButtons(
        bookingsSnap.ended_bookings[1],
        NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
        true
      )

      expect(await screen.findByLabelText('Réagis à ta réservation')).toBeOnTheScreen()
    })

    it.each([
      [ReactionTypeEnum.LIKE, /tu as liké/],
      [ReactionTypeEnum.DISLIKE, /tu as disliké/],
      [ReactionTypeEnum.NO_REACTION, /tu n’as pas souhaité réagir/],
    ])(
      'should display correct icon and correct a11y label when data has reaction %s',
      async (userReaction, labelRegex) => {
        renderEndedBookingInteractionButtons(
          {
            ...bookingsSnap.ended_bookings[1],
            userReaction,
          },
          NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
          true
        )

        expect(await screen.findByLabelText(labelRegex)).toBeOnTheScreen()
      }
    )

    it('should display a small badge when offer is waiting for a reaction', async () => {
      renderEndedBookingInteractionButtons(
        {
          ...bookingsSnap.ended_bookings[1],
          userReaction: null,
        },
        NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
        true
      )

      expect(await screen.findByTestId('smallBadge')).toBeOnTheScreen()
    })
  })
})

function renderEndedBookingInteractionButtons(
  booking: BookingReponse,
  nativeCategoryId: NativeCategoryIdEnumv2,
  canReact?: boolean
) {
  return render(
    reactQueryProviderHOC(
      <EndedBookingInteractionButtons
        booking={booking}
        nativeCategoryId={nativeCategoryId}
        handlePressShareOffer={jest.fn()}
        handleShowReactionModal={jest.fn()}
        canReact={canReact}
      />
    )
  )
}
