import { buildSortRadioOptions, getLabelFromSortBy, getSortByFromLabel } from './sortOptions'

describe('sortOptions helpers', () => {
  describe('buildSortRadioOptions', () => {
    it('should return all sort options as RadioButtonGroupOption array', () => {
      const options = buildSortRadioOptions()

      expect(options).toHaveLength(3)
    })

    it('should include RECENTLY_ADDED option with correct label', () => {
      const options = buildSortRadioOptions()

      expect(options).toContainEqual({ key: 'RECENTLY_ADDED', label: 'Ajouté récemment' })
    })

    it('should include ASCENDING_PRICE option with correct label', () => {
      const options = buildSortRadioOptions()

      expect(options).toContainEqual({ key: 'ASCENDING_PRICE', label: 'Prix croissant' })
    })

    it('should include AROUND_ME option with correct label', () => {
      const options = buildSortRadioOptions()

      expect(options).toContainEqual({ key: 'AROUND_ME', label: 'Proximité géographique' })
    })
  })

  describe('getLabelFromSortBy', () => {
    it('should return "Ajouté récemment" for RECENTLY_ADDED', () => {
      expect(getLabelFromSortBy('RECENTLY_ADDED')).toBe('Ajouté récemment')
    })

    it('should return "Prix croissant" for ASCENDING_PRICE', () => {
      expect(getLabelFromSortBy('ASCENDING_PRICE')).toBe('Prix croissant')
    })

    it('should return "Proximité géographique" for AROUND_ME', () => {
      expect(getLabelFromSortBy('AROUND_ME')).toBe('Proximité géographique')
    })
  })

  describe('getSortByFromLabel', () => {
    it('should return RECENTLY_ADDED for "Ajouté récemment"', () => {
      expect(getSortByFromLabel('Ajouté récemment')).toBe('RECENTLY_ADDED')
    })

    it('should return ASCENDING_PRICE for "Prix croissant"', () => {
      expect(getSortByFromLabel('Prix croissant')).toBe('ASCENDING_PRICE')
    })

    it('should return AROUND_ME for "Proximité géographique"', () => {
      expect(getSortByFromLabel('Proximité géographique')).toBe('AROUND_ME')
    })

    it('should return undefined for unknown label', () => {
      expect(getSortByFromLabel('Unknown label')).toBeUndefined()
    })
  })
})
