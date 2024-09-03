import React from 'react'

import { OfferAccessibility } from 'features/offer/components/OfferAccessibility/OfferAccessibility'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

const accessibility = offerResponseSnap.accessibility

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('<OfferAccessibility />', () => {
  it('should display section title when there is at least one handicap information', () => {
    render(<OfferAccessibility accessibility={accessibility} />)

    expect(screen.getByText('Accessibilité de l’offre')).toBeOnTheScreen()
  })

  it('should display accessibility block when there is at least one handicap information', () => {
    render(<OfferAccessibility accessibility={accessibility} />)

    expect(screen.getByText('Handicap visuel')).toBeOnTheScreen()
    expect(screen.getByText('Handicap moteur')).toBeOnTheScreen()
    expect(screen.getByText('Handicap psychique ou cognitif')).toBeOnTheScreen()
    expect(screen.getByText('Handicap auditif')).toBeOnTheScreen()
  })

  it('should not display accessibility block when there is not handicap information', () => {
    render(<OfferAccessibility accessibility={{}} />)

    expect(screen.queryByText('Handicap visuel')).not.toBeOnTheScreen()
    expect(screen.queryByText('Handicap moteur')).not.toBeOnTheScreen()
    expect(screen.queryByText('Handicap psychique ou cognitif')).not.toBeOnTheScreen()
    expect(screen.queryByText('Handicap auditif')).not.toBeOnTheScreen()
  })
})
