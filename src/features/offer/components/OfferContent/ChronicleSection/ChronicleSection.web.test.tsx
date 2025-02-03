import React from 'react'

import { chroniclesSnap } from 'features/chronicle/fixtures/chroniclesSnap'
import { fireEvent, render, screen } from 'tests/utils/web'

import { ChronicleSection } from './ChronicleSection'

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, push: jest.fn() }),
}))

describe('ChroniclesSection', () => {
  it('should render correctly in mobile', () => {
    render(
      <ChronicleSection
        title="title"
        ctaLabel="Voir tous les avis"
        data={chroniclesSnap}
        subtitle="subtitle"
        navigateTo={{ screen: 'Offer' }}
        offerId={1}
      />
    )

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('subtitle')).toBeInTheDocument()
    expect(screen.getByText('Voir tous les avis')).toBeInTheDocument()
    expect(screen.getAllByTestId(/chronicle-card-*/).length).toBeGreaterThan(0)
  })

  it('should render correctly in desktop', () => {
    render(
      <ChronicleSection
        title="title"
        ctaLabel="Voir tous les avis"
        data={chroniclesSnap}
        subtitle="subtitle"
        navigateTo={{ screen: 'Offer' }}
        offerId={1}
      />,
      { theme: { isDesktopViewport: true } }
    )

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('subtitle')).toBeInTheDocument()
    expect(screen.getByText('Voir tous les avis')).toBeInTheDocument()
    expect(screen.getAllByTestId(/chronicle-card-*/).length).toBeGreaterThan(0)
  })

  it('should navigate', async () => {
    render(
      <ChronicleSection
        title="title"
        ctaLabel="Voir tous les avis"
        data={chroniclesSnap}
        subtitle="subtitle"
        navigateTo={{ screen: 'Offer' }}
        offerId={1}
      />
    )

    // Have to use fireEvent here, otherwise test is flaky :/
    await fireEvent.click(screen.getByText('Voir tous les avis'))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })
})
