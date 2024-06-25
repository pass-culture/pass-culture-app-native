import { getHighlightAccessibilityLabel } from 'features/home/helpers/getHighlightAccessibilityLabel'

describe('getHighlightAccessibilityLabel', () => {
  it('should return the correct accessibility label with title', () => {
    const result = getHighlightAccessibilityLabel({
      title: 'Fête de la saucisse',
    })

    expect(result).toBe('Découvre le temps fort "Fête de la saucisse".')
  })

  it('should return the correct accessibility label with title and label', () => {
    const result = getHighlightAccessibilityLabel({
      title: 'Fête de la saucisse',
      label: 'Festival',
    })

    expect(result).toBe('Découvre le temps fort "Fête de la saucisse" sur le thème "Festival".')
  })

  it('should return the correct accessibility label with title and subtitle', () => {
    const result = getHighlightAccessibilityLabel({
      title: 'Fête de la saucisse',
      subtitle: 'Sous-titre',
    })

    expect(result).toBe('Découvre le temps fort "Fête de la saucisse" Sous-titre.')
  })

  it('should return the correct accessibility label with full information', () => {
    const result = getHighlightAccessibilityLabel({
      title: 'Fête de la saucisse',
      subtitle: 'Sous-titre',
      label: 'Festival',
    })

    expect(result).toBe(
      'Découvre le temps fort "Fête de la saucisse" Sous-titre sur le thème "Festival".'
    )
  })
})
