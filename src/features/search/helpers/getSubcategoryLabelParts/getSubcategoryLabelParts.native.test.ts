import { getSubcategoryLabelParts } from 'features/search/helpers/getSubcategoryLabelParts/getSubcategoryLabelParts'

describe('getSubcategoryLabelParts', () => {
  it('should return undefined when label is empty or falsy', () => {
    expect(getSubcategoryLabelParts('')).toBeUndefined()
  })

  it('should return the explicit parts for the exception "Evènements cinéma"', () => {
    expect(getSubcategoryLabelParts('Evènements cinéma')).toEqual(['Evènements', 'cinéma'])
  })

  describe('Separator logic (&, et, aux)', () => {
    it('should split by "&" separator when both parts are within MAX_LINE_LENGTH (17 chars)', () => {
      const input = 'Romans & littérature'

      expect(getSubcategoryLabelParts(input)).toEqual(['Romans', '& littérature'])
    })

    it('should split by "et" separator when both parts are within MAX_LINE_LENGTH (17 chars)', () => {
      const input = 'Vidéos et documentaires'

      expect(getSubcategoryLabelParts(input)).toEqual(['Vidéos', 'et documentaires'])
    })

    it('should split by "aux" separator when both parts are within MAX_LINE_LENGTH (17 chars)', () => {
      const input = 'Abonnements aux bibliothèques'

      expect(getSubcategoryLabelParts(input)).toEqual(['Abonnements', 'aux bibliothèques'])
    })
  })

  describe('Short labels', () => {
    it('should return undefined when label length is less than or equal to MAX_LINE_LENGTH', () => {
      expect(getSubcategoryLabelParts('Musique classique')).toBeUndefined()
      expect(getSubcategoryLabelParts('Théâtre')).toBeUndefined()
    })
  })

  it('should split long label into lines of maximum 17 characters', () => {
    const input = 'Évènements autour du livre'

    expect(getSubcategoryLabelParts(input)).toEqual(['Évènements autour', 'du livre'])
  })
})
