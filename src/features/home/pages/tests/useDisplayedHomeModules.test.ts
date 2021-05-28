import {
  Offers,
  OffersWithCover,
  BusinessPane,
  ExclusivityPane,
  ProcessedModule,
} from 'features/home/contentful'

import {
  showBusinessModule,
  getOfferModules,
  getModulesToDisplay,
} from '../useDisplayedHomeModules.utils'

const visibleOfferModule = new Offers({
  algolia: [{ title: 'tile', hitsPerPage: 4 }],
  display: { minOffers: 1, title: 'title', layout: 'one-item-medium' },
  moduleId: 'algoliaModuleShown',
})

const hiddenOfferModule = new Offers({
  algolia: [{ title: 'tile', hitsPerPage: 4 }],
  display: { minOffers: 10, title: 'title', layout: 'one-item-medium' },
  moduleId: 'algoliaModuleHidden',
})
const emptyHits = new OffersWithCover({
  algolia: [{ title: 'tile', hitsPerPage: 4 }],
  display: { minOffers: 1, title: 'title', layout: 'one-item-medium' },
  moduleId: 'emptyHits',
  cover: 'uri_to_cover_image',
})

const offerModules: ProcessedModule[] = [visibleOfferModule, hiddenOfferModule, emptyHits]

const connectedBusinessModule = new BusinessPane({
  title: 'module title',
  moduleId: 'businessPane-id',
  image: 'uri_to_image',
  firstLine: undefined,
  leftIcon: undefined,
  secondLine: undefined,
  url: undefined,
  targetNotConnectedUsersOnly: false,
})

const excluModule = new ExclusivityPane({
  alt: 'alt',
  image: 'uri_to_image',
  moduleId: 'exclusivityPane-id',
  offerId: 'ABCD',
})

describe('useDisplayedHomeModules.utils', () => {
  describe('showBusinessModule()', () => {
    it.each`
      targetNotConnectedUsersOnly | connected | showModule
      ${undefined}                | ${true}   | ${true}
      ${undefined}                | ${false}  | ${true}
      ${false}                    | ${true}   | ${true}
      ${false}                    | ${false}  | ${false}
      ${true}                     | ${true}   | ${false}
      ${true}                     | ${false}  | ${true}
    `(
      'showBusinessModule($targetNotConnectedUsersOnly, $connected) \t= $showModule',
      ({ targetNotConnectedUsersOnly, connected, showModule: expected }) => {
        const show = showBusinessModule(targetNotConnectedUsersOnly, connected)
        expect(show).toBe(expected)
      }
    )
  })
  describe('getOfferModules', () => {
    it('should filter the offer modules', () => {
      const offerModules = getOfferModules([
        connectedBusinessModule,
        excluModule,
        emptyHits,
        visibleOfferModule,
      ])
      expect(offerModules).toEqual([emptyHits, visibleOfferModule])
    })
  })

  describe('getModulesToDisplay', () => {
    it('does display BusinessPane accordingly to showBusinessModule', () => {
      const connectedModules = getModulesToDisplay([...offerModules, connectedBusinessModule], true)
      expect(connectedModules).toContain(connectedBusinessModule)

      const notConnectedModules = getModulesToDisplay(
        [...offerModules, connectedBusinessModule],
        false
      )
      expect(notConnectedModules).not.toContain(connectedBusinessModule)
    })
    it('does always display ExclusivityPane', () => {
      const displayedModules = getModulesToDisplay(
        [excluModule, connectedBusinessModule, ...offerModules],
        false
      )
      expect(displayedModules).toContain(excluModule)
    })
  })
})
