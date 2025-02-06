import React from 'react'

import { chroniclesSnap } from 'features/chronicle/fixtures/chroniclesSnap'
import { render, screen, userEvent } from 'tests/utils'

import { ChronicleSection } from './ChronicleSection'

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, push: jest.fn() }),
}))

describe('ChroniclesSection', () => {
  const user = userEvent.setup()

  it('should render correctly', () => {
    render(
      <ChronicleSection
        title="title"
        ctaLabel="Voir tous les avis"
        data={chroniclesSnap}
        subtitle="subtitle"
        navigateTo={{ screen: 'Offer' }}
      />
    )

    expect(screen.getByText('title')).toBeOnTheScreen()
    expect(screen.getByText('subtitle')).toBeOnTheScreen()
    expect(screen.getByText('Voir tous les avis')).toBeOnTheScreen()
    expect(screen.getAllByTestId(/chronicle-card-*/).length).toBeGreaterThan(0)
  })

  it('should navigate', async () => {
    jest.useFakeTimers()
    render(
      <ChronicleSection
        title="title"
        ctaLabel="Voir tous les avis"
        data={chroniclesSnap}
        subtitle="subtitle"
        navigateTo={{ screen: 'Offer' }}
      />
    )

    await user.press(screen.getByText('Voir tous les avis'))

    expect(mockNavigate.mock.calls[0][0]).toBe('Offer')

    jest.useRealTimers()
  })
})
