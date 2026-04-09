import React from 'react'

import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent, waitFor } from 'tests/utils'
import { BasicAccessibilityInfo } from 'ui/components/accessibility/BasicAccessibilityInfo'

const venueId = 123

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('BasicAccessibilityInfo', () => {
  it('should render all handicap information', () => {
    render(
      <BasicAccessibilityInfo
        accessibility={{
          audioDisability: true,
          mentalDisability: true,
          motorDisability: true,
          visualDisability: true,
        }}
      />
    )

    expect(screen.getByText('Handicap visuel')).toBeOnTheScreen()
    expect(screen.getByText('Handicap moteur')).toBeOnTheScreen()
    expect(screen.getByText('Handicap psychique ou cognitif')).toBeOnTheScreen()
    expect(screen.getByText('Handicap auditif')).toBeOnTheScreen()
  })

  it('should render only available handicap information', () => {
    render(
      <BasicAccessibilityInfo
        venueId={venueId}
        accessibility={{
          audioDisability: undefined,
          motorDisability: false,
          mentalDisability: true,
          visualDisability: false,
        }}
      />
    )

    expect(screen.getByText('Handicap visuel')).toBeOnTheScreen()
    expect(screen.getByText('Handicap moteur')).toBeOnTheScreen()
    expect(screen.getByText('Handicap psychique ou cognitif')).toBeOnTheScreen()
    expect(screen.queryByText('Handicap auditif')).not.toBeOnTheScreen()
  })

  it('should render all handicap information when nothing is accessible', () => {
    render(
      <BasicAccessibilityInfo
        venueId={venueId}
        accessibility={{
          audioDisability: false,
          motorDisability: false,
          mentalDisability: false,
          visualDisability: false,
        }}
      />
    )

    expect(screen.getByText('Handicap visuel')).toBeOnTheScreen()
    expect(screen.getByText('Handicap moteur')).toBeOnTheScreen()
    expect(screen.getByText('Handicap psychique ou cognitif')).toBeOnTheScreen()
    expect(screen.getByText('Handicap auditif')).toBeOnTheScreen()
  })

  it('should render nothing when no available handicap information', () => {
    render(
      <BasicAccessibilityInfo
        venueId={venueId}
        accessibility={{
          audioDisability: null,
          motorDisability: null,
          mentalDisability: null,
          visualDisability: null,
        }}
      />
    )

    expect(screen.queryByText('Handicap visuel')).not.toBeOnTheScreen()
    expect(screen.queryByText('Handicap moteur')).not.toBeOnTheScreen()
    expect(screen.queryByText('Handicap psychique ou cognitif')).not.toBeOnTheScreen()
    expect(screen.queryByText('Handicap auditif')).not.toBeOnTheScreen()
  })

  it('should  display AccesLibre banner when venue ID is provided', async () => {
    render(
      <BasicAccessibilityInfo
        venueId={venueId}
        accessibility={{
          audioDisability: true,
          motorDisability: false,
          mentalDisability: true,
          visualDisability: false,
        }}
      />
    )

    const accesLibreBanner = screen.getByText(
      'Ce lieu n’a pas encore d’informations détaillées sur son accessibilité.'
    )

    expect(accesLibreBanner).toBeOnTheScreen()
  })

  it('should log analytics with action "contribute" when clicking on the banner link', async () => {
    render(
      <BasicAccessibilityInfo
        venueId={venueId}
        accessibility={{
          audioDisability: true,
          motorDisability: false,
          mentalDisability: true,
          visualDisability: false,
        }}
      />
    )

    const accesLibreLink = screen.getByText('Renseigner sur Acceslibre')
    await user.press(accesLibreLink)

    await waitFor(() =>
      expect(analytics.logAccessibilityBannerClicked).toHaveBeenCalledWith({
        acceslibreId: undefined,
        action: 'contribute',
      })
    )
  })

  it('should not display AccesLibre banner when no venue ID is provided', async () => {
    render(
      <BasicAccessibilityInfo
        venueId={undefined}
        accessibility={{
          audioDisability: true,
          motorDisability: false,
          mentalDisability: true,
          visualDisability: false,
        }}
      />
    )

    const accesLibreBanner = screen.queryByText(
      'Ce lieu n’a pas encore d’informations détaillées sur son accessibilité.'
    )

    expect(accesLibreBanner).not.toBeOnTheScreen()
  })
})
