import * as reactNavigationNative from '@react-navigation/native'
import React from 'react'

import { chroniclesSnap } from 'features/chronicle/fixtures/chroniclesSnap'
import { chronicleVariantInfoFixture } from 'features/offer/fixtures/chronicleVariantInfo'
import { render, screen, userEvent } from 'tests/utils'

import { ChronicleSection } from './ChronicleSection'

const mockNavigate = jest.fn()
jest.spyOn(reactNavigationNative, 'useNavigation').mockReturnValue({
  navigate: mockNavigate,
  push: jest.fn(),
})

jest.mock('libs/subcategories/useSubcategories')

describe('ChroniclesSection', () => {
  const user = userEvent.setup()

  it('should render correctly', () => {
    render(
      <ChronicleSection
        variantInfo={chronicleVariantInfoFixture}
        ctaLabel="Voir tous les avis"
        data={chroniclesSnap}
        navigateTo={{ screen: 'Offer' }}
        onShowChroniclesWritersModal={jest.fn()}
      />
    )

    expect(screen.getByText(chronicleVariantInfoFixture.titleSection)).toBeOnTheScreen()
    expect(screen.getByText(chronicleVariantInfoFixture.subtitleSection)).toBeOnTheScreen()
    expect(screen.getByText('Voir tous les avis')).toBeOnTheScreen()
    expect(screen.getAllByTestId(/chronicle-card-*/).length).toBeGreaterThan(0)
  })

  it('should navigate', async () => {
    jest.useFakeTimers()
    render(
      <ChronicleSection
        variantInfo={chronicleVariantInfoFixture}
        ctaLabel="Voir tous les avis"
        data={chroniclesSnap}
        navigateTo={{ screen: 'Offer' }}
        onShowChroniclesWritersModal={jest.fn()}
      />
    )

    await user.press(screen.getByText('Voir tous les avis'))

    expect(mockNavigate.mock.calls[0][0]).toBe('Offer')

    jest.useRealTimers()
  })

  it('should not display all reviews button when there is only one review', () => {
    render(
      <ChronicleSection
        variantInfo={chronicleVariantInfoFixture}
        ctaLabel="Voir tous les avis"
        data={[chroniclesSnap[0]]}
        navigateTo={{ screen: 'Offer' }}
        onShowChroniclesWritersModal={jest.fn()}
      />
    )

    expect(screen.queryByText('Voir tous les avis')).not.toBeOnTheScreen()
  })
})
