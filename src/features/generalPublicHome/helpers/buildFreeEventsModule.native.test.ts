import { buildFreeEventsModule } from 'features/generalPublicHome/helpers/buildFreeEventsModule'
import { HomepageModuleType } from 'features/home/types'

// Wednesday
const NOW = new Date('2026-10-14T10:30:00.000Z')

describe('buildFreeEventsModule', () => {
  it('should build an offers module of free offers around the user', () => {
    const module = buildFreeEventsModule({ dateFilter: null, now: NOW })

    expect(module).toEqual({
      type: HomepageModuleType.OffersModule,
      id: 'generalPublicHome-freeEvents-all',
      title: 'Offres gratuites',
      displayParameters: { title: 'Offres gratuites', layout: 'two-items', minOffers: 1 },
      offersModuleParameters: [
        {
          title: 'Offres gratuites',
          priceMin: 0,
          priceMax: 0,
          isGeolocated: true,
          aroundRadius: 50,
          beginningDatetime: '2026-10-14T10:30:00.000Z',
          endingDatetime: undefined,
          categories: undefined,
          hitsPerPage: 20,
        },
      ],
    })
  })

  describe('dates', () => {
    it('should keep upcoming events only from now without date filter', () => {
      const [parameters] = buildFreeEventsModule({
        dateFilter: null,
        now: NOW,
      }).offersModuleParameters

      expect(parameters?.beginningDatetime).toBe('2026-10-14T10:30:00.000Z')
      expect(parameters?.endingDatetime).toBeUndefined()
    })

    it('should use the date range of the date filter', () => {
      const [parameters] = buildFreeEventsModule({
        dateFilter: { type: 'day', date: '2026-10-20' },
        now: NOW,
      }).offersModuleParameters

      expect(parameters?.beginningDatetime).toBe('2026-10-20T00:00:00.000Z')
      expect(parameters?.endingDatetime).toBe('2026-10-20T23:59:59.999Z')
    })
  })

  describe('theme', () => {
    it('should filter on the theme categories and use its label as title', () => {
      const module = buildFreeEventsModule({ dateFilter: null, themeId: 'outings', now: NOW })

      expect(module.id).toBe('generalPublicHome-freeEvents-outings')
      expect(module.title).toBe('Sorties')
      expect(module.displayParameters.title).toBe('Sorties')
      expect(module.offersModuleParameters[0]?.categories).toEqual([
        'Concerts et festivals',
        'Conférences et rencontres',
        'Arts et loisirs créatifs',
      ])
    })
  })

  describe('location', () => {
    it('should use the given radius', () => {
      const [parameters] = buildFreeEventsModule({
        dateFilter: null,
        now: NOW,
        aroundRadius: 10,
      }).offersModuleParameters

      expect(parameters?.aroundRadius).toBe(10)
    })
  })
})
