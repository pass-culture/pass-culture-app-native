import React from 'react'
import { Linking } from 'react-native'

import { venueWithDetailedAccessibilityInfo } from 'features/venue/fixtures/venueWithDetailedAccessibilityInfo'
import { render, screen, fireEvent } from 'tests/utils'

import { DetailedAccessibilityInfo } from './DetailedAccessibilityInfo'

jest.mock('libs/firebase/analytics/analytics')

const fakeAccesLibreUrl = 'fake_acceslibre_url'

describe('DetailedAccessibilityInfo', () => {
  it('should redirect to acceslibre when clicking on the banner link', () => {
    render(
      <DetailedAccessibilityInfo
        url={fakeAccesLibreUrl}
        data={venueWithDetailedAccessibilityInfo.externalAccessibilityData}
      />
    )

    const accesLibreLink = screen.getByText('Voir plus d’infos sur l’accessibilité du lieu')
    fireEvent.press(accesLibreLink)

    expect(Linking.openURL).toHaveBeenCalledWith(fakeAccesLibreUrl)
  })
})
