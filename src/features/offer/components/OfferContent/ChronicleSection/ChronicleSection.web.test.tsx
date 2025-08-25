import * as reactNavigationNative from '@react-navigation/native'
import React from 'react'

import { chroniclesSnap } from 'features/chronicle/fixtures/chroniclesSnap'
import { chronicleVariantInfoFixture } from 'features/offer/fixtures/chronicleVariantInfo'
import { fireEvent, render, screen } from 'tests/utils/web'

import { ChronicleSection } from './ChronicleSection'

const mockNavigate = jest.fn()
jest.spyOn(reactNavigationNative, 'useNavigation').mockReturnValue({
  navigate: mockNavigate,
  push: jest.fn(),
})

describe('ChronicleSection', () => {
  it('should render correctly in mobile', () => {
    render(
      <ChronicleSection
        variantInfo={chronicleVariantInfoFixture}
        ctaLabel="Voir tous les avis"
        data={chroniclesSnap}
        navigateTo={{ screen: 'Offer' }}
        onShowChroniclesWritersModal={jest.fn()}
      />
    )

    expect(screen.getByText(chronicleVariantInfoFixture.titleSection)).toBeInTheDocument()
    expect(
      screen.getByText('Notre communauté de lecteurs te partagent leurs avis sur ce livre !')
    ).toBeInTheDocument()
    expect(screen.getByText('Voir tous les avis')).toBeInTheDocument()
    expect(screen.getAllByTestId(/chronicle-card-*/).length).toBeGreaterThan(0)
  })

  it('should render correctly in desktop', () => {
    render(
      <ChronicleSection
        variantInfo={chronicleVariantInfoFixture}
        ctaLabel="Voir tous les avis"
        data={chroniclesSnap}
        navigateTo={{ screen: 'Offer' }}
        onShowChroniclesWritersModal={jest.fn()}
      />,
      { theme: { isDesktopViewport: true } }
    )

    expect(screen.getByText(chronicleVariantInfoFixture.titleSection)).toBeInTheDocument()
    expect(
      screen.getByText('Notre communauté de lecteurs te partagent leurs avis sur ce livre !')
    ).toBeInTheDocument()
    expect(screen.getByText('Voir tous les avis')).toBeInTheDocument()
    expect(screen.getAllByTestId(/chronicle-card-*/).length).toBeGreaterThan(0)
  })

  it('should navigate', async () => {
    render(
      <ChronicleSection
        variantInfo={chronicleVariantInfoFixture}
        ctaLabel="Voir tous les avis"
        data={chroniclesSnap}
        navigateTo={{ screen: 'Offer' }}
        onShowChroniclesWritersModal={jest.fn()}
      />
    )

    // Have to use fireEvent here, otherwise test is flaky :/
    await fireEvent.click(screen.getByText('Voir tous les avis'))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })
})
