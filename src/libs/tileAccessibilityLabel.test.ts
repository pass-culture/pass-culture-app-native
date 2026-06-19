import { tileAccessibilityLabel, TileContentType } from './tileAccessibilityLabel'

describe('tileAccessibilityLabel', () => {
  it('adds "à" before offer distance in accessibility label', () => {
    const label = tileAccessibilityLabel(TileContentType.OFFER, {
      name: 'Le film',
      categoryLabel: 'Cinema',
      price: '5 EUR',
      date: 'Demain',
      distance: '3 km',
    })

    expect(label).toBe('Cinema - Le film - à 3 km - 5 EUR - Demain')
  })

  it('does not add empty separators when offer distance is missing', () => {
    const label = tileAccessibilityLabel(TileContentType.OFFER, {
      name: 'Le film',
      categoryLabel: 'Cinema',
      price: '5 EUR',
      date: 'Demain',
    })

    expect(label).toBe('Cinema - Le film - 5 EUR - Demain')
  })
})
