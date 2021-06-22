import {
  Offers,
  OffersWithCover,
  BusinessPane,
  ExclusivityPane,
  ProcessedModule,
} from 'features/home/contentful'
import { mockedAlgoliaResponse } from 'libs/search/fixtures'

import {
  showBusinessModule,
  getOfferModules,
  getModulesToDisplay,
} from '../useDisplayedHomeModules.utils'
import { HomeModuleResponse } from '../useHomeModules'

const nbHits = 2
const hits = mockedAlgoliaResponse.hits.slice(0, nbHits)
const homeModules: HomeModuleResponse = {
  // notInHomeModules should no be here
  ['homeModuleShown']: { hits, nbHits },
  ['homeModuleHidden']: { hits, nbHits },
  ['emptyHits']: { hits: [], nbHits },
}

const visibleOfferModule = new Offers({
  search: [{ title: 'tile', hitsPerPage: 4 }],
  display: { minOffers: 1, title: 'title', layout: 'one-item-medium' },
  moduleId: 'homeModuleShown',
})

const hiddenOfferModule = new Offers({
  search: [{ title: 'tile', hitsPerPage: 4 }],
  display: { minOffers: 10, title: 'title', layout: 'one-item-medium' },
  moduleId: 'homeModuleHidden',
})
const emptyHits = new OffersWithCover({
  search: [{ title: 'tile', hitsPerPage: 4 }],
  display: { minOffers: 1, title: 'title', layout: 'one-item-medium' },
  moduleId: 'emptyHits',
  cover: 'uri_to_cover_image',
})
const notInHomeModules = new Offers({
  search: [{ title: 'tile', hitsPerPage: 4 }],
  display: { minOffers: 1, title: 'title', layout: 'one-item-medium' },
  moduleId: 'notInHomeModules',
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
      const connectedModules = getModulesToDisplay(
        [...offerModules, connectedBusinessModule],
        homeModules,
        hits,
        true
      )
      expect(connectedModules).toContain(connectedBusinessModule)

      const notConnectedModules = getModulesToDisplay(
        [...offerModules, connectedBusinessModule],
        homeModules,
        hits,
        false
      )
      expect(notConnectedModules).not.toContain(connectedBusinessModule)
    })
    it('does always display ExclusivityPane', () => {
      const displayedModules = getModulesToDisplay(
        [excluModule, connectedBusinessModule, ...offerModules],
        homeModules,
        hits,
        false
      )
      expect(displayedModules).toContain(excluModule)
    })
    it('does not display modules if it has no data', () => {
      const displayedModules = getModulesToDisplay(
        [excluModule, connectedBusinessModule, notInHomeModules],
        homeModules,
        hits,
        true
      )
      expect(notInHomeModules).not.toContain(excluModule)
      expect(displayedModules.length).toBe(2)
    })
    it('does not display a module that has no hits', () => {
      const displayedModules = getModulesToDisplay(
        [emptyHits, excluModule, connectedBusinessModule],
        homeModules,
        hits,
        true
      )
      expect(displayedModules).not.toContain(emptyHits)
      expect(displayedModules.length).toBe(2)
    })
    it('does not display a module that has nbhits < minOffers', () => {
      const displayedModules = getModulesToDisplay(
        [connectedBusinessModule, excluModule, hiddenOfferModule],
        homeModules,
        hits,
        true
      )
      expect(displayedModules).not.toContain(hiddenOfferModule)
      expect(displayedModules.length).toBe(2)
    })
    it('does display a module that has enough hits and nbHits >= minOffers', () => {
      const displayedModules = getModulesToDisplay(
        [connectedBusinessModule, excluModule, visibleOfferModule],
        homeModules,
        hits,
        true
      )
      expect(displayedModules).toContain(visibleOfferModule)
      expect(displayedModules.length).toBe(3)
    })
  })
})
