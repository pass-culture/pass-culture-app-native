import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueAdvicesSection } from 'features/venue/components/VenueAdvicesSection/VenueAdvicesSection'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { proAdvicesCardDataFixture } from 'features/venue/fixtures/venueProAdvices.fixture'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('VenueAdvicesSection', () => {
  it('should display correctly', () => {
    render(
      <VenueAdvicesSection
        advicesCardData={[...proAdvicesCardDataFixture]}
        nbAdvices={2}
        venue={venueDataTest}
        onShowWritersModal={jest.fn()}
      />
    )

    expect(screen.getByText(`Les avis par “${venueDataTest.name}”`)).toBeOnTheScreen()
  })

  it('should display see all advices button', () => {
    render(
      <VenueAdvicesSection
        advicesCardData={[...proAdvicesCardDataFixture]}
        nbAdvices={2}
        venue={venueDataTest}
        onShowWritersModal={jest.fn()}
      />
    )

    expect(screen.getByText('Lire les 2 avis')).toBeOnTheScreen()
  })

  it('should display "Nouveau" tag when wipProReviewsNewTag FF activated', () => {
    render(
      <VenueAdvicesSection
        advicesCardData={[...proAdvicesCardDataFixture]}
        nbAdvices={2}
        venue={venueDataTest}
        enableNewTagProAdvices
        onShowWritersModal={jest.fn()}
      />
    )

    expect(screen.getByText('Nouveau')).toBeOnTheScreen()
  })

  it('should navigate to venue pro advices page when pressing all advices button', async () => {
    render(
      <VenueAdvicesSection
        advicesCardData={[...proAdvicesCardDataFixture]}
        nbAdvices={2}
        venue={venueDataTest}
        onShowWritersModal={jest.fn()}
      />
    )

    await user.press(screen.getByText('Lire les 2 avis'))

    expect(navigate).toHaveBeenCalledWith('ProAdvicesVenue', { venueId: venueDataTest.id })
  })
})
