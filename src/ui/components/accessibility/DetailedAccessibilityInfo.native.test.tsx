import React from 'react'
import { Linking } from 'react-native'

import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { render, screen, fireEvent } from 'tests/utils'

import { DetailedAccessibilityInfo } from './DetailedAccessibilityInfo'

jest.mock('libs/firebase/analytics/analytics')

const fakeAccesLibreUrl = 'fake_acceslibre_url'

describe('DetailedAccessibilityInfo', () => {
  it('should redirect to acceslibre when clicking on the banner link', () => {
    render(
      <DetailedAccessibilityInfo
        url={fakeAccesLibreUrl}
        data={venueDataTest.externalAccessibilityData}
      />
    )

    const accesLibreLink = screen.getByText('Voir plus d’infos sur l’accessibilité du lieu')
    fireEvent.press(accesLibreLink)

    expect(Linking.openURL).toHaveBeenCalledWith(fakeAccesLibreUrl)
  })

  it('should display multiple description info on separate lines', () => {
    render(
      <DetailedAccessibilityInfo
        url={fakeAccesLibreUrl}
        data={venueDataTest.externalAccessibilityData}
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
        data={venueDataTest.externalAccessibilityData}
      />
    )

    expect(screen.queryAllByTestId('horizontal-separator')).toHaveLength(3)
  })
})
