import React from 'react'
import { Linking } from 'react-native'

import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { DetailedAccessibilityInfo } from './DetailedAccessibilityInfo'

const fakeAccesLibreUrl = 'fake_acceslibre_url'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('DetailedAccessibilityInfo', () => {
  it('should redirect to acceslibre when clicking on the banner link', async () => {
    render(
      <DetailedAccessibilityInfo
        url={fakeAccesLibreUrl}
        accessibilities={venueDataTest.externalAccessibilityData}
        acceslibreId={venueDataTest.externalAccessibilityId}
      />
    )

    const accesLibreLink = screen.getByText('Voir plus d’infos sur l’accessibilité du lieu')
    fireEvent.press(accesLibreLink)

    await waitFor(() => expect(Linking.openURL).toHaveBeenCalledWith(fakeAccesLibreUrl))
  })

  it('should log analytics with ID when clicking on the banner link and ID is provided', async () => {
    render(
      <DetailedAccessibilityInfo
        url={fakeAccesLibreUrl}
        accessibilities={venueDataTest.externalAccessibilityData}
        acceslibreId={venueDataTest.externalAccessibilityId}
      />
    )

    const accesLibreLink = screen.getByText('Voir plus d’infos sur l’accessibilité du lieu')
    fireEvent.press(accesLibreLink)

    await waitFor(() =>
      expect(analytics.logAccessibilityBannerClicked).toHaveBeenCalledWith(
        venueDataTest.externalAccessibilityId
      )
    )
  })

  it('should log analytics without ID when clicking on the banner link and ID is not provided', async () => {
    render(
      <DetailedAccessibilityInfo
        url={fakeAccesLibreUrl}
        accessibilities={venueDataTest.externalAccessibilityData}
      />
    )

    const accesLibreLink = screen.getByText('Voir plus d’infos sur l’accessibilité du lieu')
    fireEvent.press(accesLibreLink)

    await waitFor(() =>
      expect(analytics.logAccessibilityBannerClicked).toHaveBeenCalledWith(undefined)
    )
  })

  it('should return the correct accessibility label', () => {
    render(
      <DetailedAccessibilityInfo
        url={fakeAccesLibreUrl}
        accessibilities={venueDataTest.externalAccessibilityData}
      />
    )

    expect(screen.getByLabelText('Handicap auditif: Non accessible')).toBeOnTheScreen()
    expect(screen.getByLabelText('Handicap psychique ou cognitif: Accessible')).toBeOnTheScreen()
    expect(screen.getByLabelText('Handicap moteur: Non accessible')).toBeOnTheScreen()
    expect(screen.getByLabelText('Handicap visuel: Non accessible')).toBeOnTheScreen()
  })

  it('should display multiple description info on separate lines', () => {
    render(
      <DetailedAccessibilityInfo
        url={fakeAccesLibreUrl}
        accessibilities={venueDataTest.externalAccessibilityData}
      />
    )

    fireEvent.press(screen.getByText('Handicap auditif'))

    expect(screen.getByText('Boucle à induction magnétique portative')).toBeOnTheScreen()
    expect(screen.getByText('Autre système non renseigné')).toBeOnTheScreen()
  })

  it('should display horizontal separators correctly', () => {
    render(
      <DetailedAccessibilityInfo
        url={fakeAccesLibreUrl}
        accessibilities={venueDataTest.externalAccessibilityData}
      />
    )

    expect(screen.queryAllByTestId('horizontal-separator')).toHaveLength(3)
  })

  it('should log analytics when accordion toggle', async () => {
    render(
      <DetailedAccessibilityInfo
        url={fakeAccesLibreUrl}
        accessibilities={venueDataTest.externalAccessibilityData}
      />
    )

    fireEvent.press(screen.getByText('Handicap auditif'))

    await waitFor(() =>
      expect(analytics.logHasOpenedAccessibilityAccordion).toHaveBeenCalledWith('Handicap auditif')
    )
  })
})
