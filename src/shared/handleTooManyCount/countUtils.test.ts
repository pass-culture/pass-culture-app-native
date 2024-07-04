import { createLabels, handleTooManyCount } from 'shared/handleTooManyCount/countUtils'

describe('handleTooManyCount', () => {
  it('should return correct labels when count is less than COUNT_MAX', () => {
    const count = 50
    const result = handleTooManyCount(count)

    expect(result).toEqual({
      displayedCount: '50',
      plusSign: '',
    })
  })

  it('should return correct labels when count is equal to COUNT_MAX', () => {
    const count = 100
    const result = handleTooManyCount(count)

    expect(result).toEqual({
      displayedCount: '99',
      plusSign: '+',
    })
  })

  it('should return correct labels when count is greater than COUNT_MAX', () => {
    const count = 150
    const result = handleTooManyCount(count)

    expect(result).toEqual({
      displayedCount: '99',
      plusSign: '+',
    })
  })

  it('should return correct labels when count is zero', () => {
    const count = 0
    const result = handleTooManyCount(count)

    expect(result).toEqual({
      displayedCount: '0',
      plusSign: '',
    })
  })

  it('should return "0" for displayedCount when count is undefined', () => {
    const count = undefined
    const result = handleTooManyCount(count)

    expect(result).toEqual({
      displayedCount: '0',
      plusSign: '',
    })
  })

  it('should return "0" for displayedCount when count is null', () => {
    const count = null
    const result = handleTooManyCount(count)

    expect(result).toEqual({
      displayedCount: '0',
      plusSign: '',
    })
  })
})

describe('createLabels', () => {
  it('should return correct labels when count is less than COUNT_MAX', () => {
    const count = 50
    const categorie = 'réservations'
    const result = createLabels(count, categorie)

    expect(result).toEqual({
      fullCountLabel: '50',
      accessibilityLabel: '50',
    })
  })

  it('should return correct labels when count is equal to COUNT_MAX for "réservations"', () => {
    const count = 100
    const categorie = 'réservations'
    const result = createLabels(count, categorie)

    expect(result).toEqual({
      fullCountLabel: '99+',
      accessibilityLabel: 'Plus de 99 réservations',
    })
  })

  it('should return correct labels when count is greater than COUNT_MAX for "réservations"', () => {
    const count = 150
    const categorie = 'réservations'
    const result = createLabels(count, categorie)

    expect(result).toEqual({
      fullCountLabel: '99+',
      accessibilityLabel: 'Plus de 99 réservations',
    })
  })

  it('should return correct labels when count is zero', () => {
    const count = 0
    const categorie = 'réservations'
    const result = createLabels(count, categorie)

    expect(result).toEqual({
      fullCountLabel: '0',
      accessibilityLabel: '0',
    })
  })

  it('should return "0" for displayedCount when count is undefined', () => {
    const count = undefined
    const categorie = 'réservations'
    const result = createLabels(count, categorie)

    expect(result).toEqual({
      fullCountLabel: '0',
      accessibilityLabel: '0',
    })
  })

  it('should return "0" for displayedCount when count is null', () => {
    const count = null
    const categorie = 'réservations'
    const result = createLabels(count, categorie)

    expect(result).toEqual({
      fullCountLabel: '0',
      accessibilityLabel: '0',
    })
  })

  it('should return correct labels when count is equal to COUNT_MAX for "favoris"', () => {
    const count = 100
    const categorie = 'favoris'
    const result = createLabels(count, categorie)

    expect(result).toEqual({
      fullCountLabel: '99+',
      accessibilityLabel: 'Plus de 99 favoris',
    })
  })

  it('should return correct labels when count is greater than COUNT_MAX for "favoris"', () => {
    const count = 150
    const categorie = 'favoris'
    const result = createLabels(count, categorie)

    expect(result).toEqual({
      fullCountLabel: '99+',
      accessibilityLabel: 'Plus de 99 favoris',
    })
  })
})
