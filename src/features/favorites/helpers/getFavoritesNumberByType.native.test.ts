import { getFavoritesNumberByType } from 'features/favorites/helpers/getFavoritesNumberByType'
import { Tab } from 'features/favorites/types'

describe('getFavoritesNumberByType', () => {
  describe('singular', () => {
    it('should format favorites count for offers', () => {
      const result = getFavoritesNumberByType(1, Tab.OFFERS)

      expect(result).toBe('1 offre en favori')
    })

    it('should format favorites count for venues', () => {
      const result = getFavoritesNumberByType(1, Tab.VENUES)

      expect(result).toBe('1 lieu en favori')
    })

    it('should format favorites count for artists', () => {
      const result = getFavoritesNumberByType(1, Tab.ARTISTS)

      expect(result).toBe('1 artiste en favori')
    })
  })

  describe('plural', () => {
    it('should format favorites count for offers', () => {
      const result = getFavoritesNumberByType(2, Tab.OFFERS)

      expect(result).toBe('2 offres en favoris')
    })

    it('should format favorites count for venues', () => {
      const result = getFavoritesNumberByType(4, Tab.VENUES)

      expect(result).toBe('4 lieux en favoris')
    })

    it('should format favorites count for artists', () => {
      const result = getFavoritesNumberByType(3, Tab.ARTISTS)

      expect(result).toBe('3 artistes en favoris')
    })
  })

  it('should return undefined when the tab is unknown', () => {
    const result = getFavoritesNumberByType(4, 'UNKNOWN_TAB' as Tab)

    expect(result).toBeUndefined()
  })
})
