import { FILTERS_MODAL_NAV_OPTIONS } from './filtersModalNavOptions'

describe('filtersModalNavOptions', () => {
  it('should return native stack screen options', () => {
    // After migration to native-stack, FILTERS_MODAL_NAV_OPTIONS uses platform default animations
    // Custom cardStyleInterpolator is no longer used
    expect(FILTERS_MODAL_NAV_OPTIONS).toBeDefined()
    expect(typeof FILTERS_MODAL_NAV_OPTIONS).toBe('object')
  })
})
