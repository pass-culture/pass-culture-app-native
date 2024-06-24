import { getExclusivityAccessibilityLabel } from 'features/home/helpers/getExclusivityAccessibilityLabel'

describe('getExclusivityAccessibilityLabel', () => {
  it('should return the correct accessibility label with title and subtitle', () => {
    const result = getExclusivityAccessibilityLabel({
      offerName: 'Harry Potter et l‘ordre du phénix',
      offerCategory: 'Cinéma',
    })

    expect(result).toBe(
      'Découvre l’offre exclusive "Harry Potter et l‘ordre du phénix" de la catégorie "Cinéma".'
    )
  })

  it('should return the correct accessibility label with title, subtitle and date', () => {
    const result = getExclusivityAccessibilityLabel({
      offerName: 'Harry Potter et l‘ordre du phénix',
      offerCategory: 'Cinéma',
      offerDate: 'Dès le 12 novembre 2025',
    })

    expect(result).toBe(
      'Découvre l’offre exclusive "Harry Potter et l‘ordre du phénix" de la catégorie "Cinéma". Date\u00a0: Dès le 12 novembre 2025.'
    )
  })

  it('should return the correct accessibility label with title, subtitle and price', () => {
    const result = getExclusivityAccessibilityLabel({
      offerName: 'Harry Potter et l‘ordre du phénix',
      offerCategory: 'Cinéma',
      offerPrice: '10€',
    })

    expect(result).toBe(
      'Découvre l’offre exclusive "Harry Potter et l‘ordre du phénix" de la catégorie "Cinéma". Prix\u00a0: 10€.'
    )
  })

  it('should return the correct accessibility label with title, subtitle and distance', () => {
    const result = getExclusivityAccessibilityLabel({
      offerName: 'Harry Potter et l‘ordre du phénix',
      offerCategory: 'Cinéma',
      offerDistance: '10km',
    })

    expect(result).toBe(
      'Découvre l’offre exclusive "Harry Potter et l‘ordre du phénix" de la catégorie "Cinéma". Distance\u00a0: 10km.'
    )
  })

  it('should return the correct accessibility label with full information', () => {
    const result = getExclusivityAccessibilityLabel({
      offerName: 'Harry Potter et l‘ordre du phénix',
      offerCategory: 'Cinéma',
      offerDate: 'Dès le 12 novembre 2025',
      offerPrice: '10€',
      offerDistance: '10km',
    })

    expect(result).toBe(
      'Découvre l’offre exclusive "Harry Potter et l‘ordre du phénix" de la catégorie "Cinéma". Date\u00a0: Dès le 12 novembre 2025. Prix\u00a0: 10€. Distance\u00a0: 10km.'
    )
  })
})
