import { OfferResponse } from 'api/gen'
import {
  Offers,
  OffersWithCover,
  BusinessPane,
  ExclusivityPane,
  VenuesModule,
} from 'features/home/contentful'
import { ProcessedModule } from 'features/home/contentful/moduleTypes'
import { HomeVenuesModuleResponse } from 'features/home/pages/useHomeVenueModules'
import { offerResponseSnap as offer } from 'features/offer/api/snaps/offerResponseSnap'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { mockVenues } from 'libs/algolia/mockedResponses/mockedVenues'

import {
  showBusinessModule,
  getOfferModules,
  getModulesToDisplay,
} from '../useDisplayedHomeModules.utils'
import { HomeModuleResponse } from '../useHomeModules'

const nbHits = 2
const hitsAlgolia = mockedAlgoliaResponse.hits.slice(0, nbHits)
const hitsSearch = mockVenues.hits.slice(0, nbHits)

const homeModules: HomeModuleResponse = {
  // notInHomeModules should no be here
  ['homeModuleShown']: { hits: hitsAlgolia, nbHits },
  ['homeModuleHidden']: { hits: hitsAlgolia, nbHits },
  ['emptyHits']: { hits: [], nbHits },
}

const homeVenuesModules: HomeVenuesModuleResponse = {
  ['homeVenueModuleShown']: { hits: hitsSearch, nbHits },
  ['homeVenueModuleHidden']: { hits: hitsSearch, nbHits },
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
  id: offer.id,
})

const visibleVenueModule = new VenuesModule({
  search: [{ title: 'tile', hitsPerPage: 4 }],
  display: { minOffers: 1, title: 'title', layout: 'one-item-medium' },
  moduleId: 'homeVenueModuleShown',
})

const excluOffers: OfferResponse[] = [offer]

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
        homeVenuesModules,
        hitsAlgolia,
        [],
        true,
        null
      )
      expect(connectedModules).toContain(connectedBusinessModule)

      const notConnectedModules = getModulesToDisplay(
        [...offerModules, connectedBusinessModule],
        homeModules,
        homeVenuesModules,
        hitsAlgolia,
        [],
        false,
        null
      )
      expect(notConnectedModules).not.toContain(connectedBusinessModule)
    })

    it('does display ExclusivityPane', () => {
      const displayedModules = getModulesToDisplay(
        [excluModule, connectedBusinessModule, ...offerModules],
        homeModules,
        homeVenuesModules,
        hitsAlgolia,
        excluOffers,
        false,
        null
      )
      expect(displayedModules).toContain(excluModule)
    })

    it('does always display VenueModule', () => {
      const displayedModules = getModulesToDisplay(
        [visibleVenueModule, excluModule, connectedBusinessModule, ...offerModules],
        homeModules,
        homeVenuesModules,
        hitsAlgolia,
        excluOffers,
        false,
        null
      )
      expect(displayedModules).toContain(visibleVenueModule)
    })

    it('does not display modules if it has no data', () => {
      const displayedModules = getModulesToDisplay(
        [excluModule, connectedBusinessModule, notInHomeModules],
        homeModules,
        homeVenuesModules,
        hitsAlgolia,
        excluOffers,
        true,
        null
      )
      expect(notInHomeModules).not.toContain(excluModule)
      expect(displayedModules.length).toBe(2)
    })

    it('does not display a module that has no hits', () => {
      const displayedModules = getModulesToDisplay(
        [emptyHits, excluModule, connectedBusinessModule],
        homeModules,
        homeVenuesModules,
        hitsAlgolia,
        excluOffers,
        true,
        null
      )
      expect(displayedModules).not.toContain(emptyHits)
      expect(displayedModules.length).toBe(2)
    })

    it('does not display a module that has nbhits < minOffers', () => {
      const displayedModules = getModulesToDisplay(
        [connectedBusinessModule, excluModule, hiddenOfferModule],
        homeModules,
        homeVenuesModules,
        hitsAlgolia,
        excluOffers,
        true,
        null
      )
      expect(displayedModules).not.toContain({ hiddenOfferModule })
      expect(displayedModules.length).toBe(2)
    })

    it('does display a module that has enough hits and nbHits >= minOffers', () => {
      const displayedModules = getModulesToDisplay(
        [connectedBusinessModule, excluModule, visibleOfferModule],
        homeModules,
        homeVenuesModules,
        hitsAlgolia,
        excluOffers,
        true,
        null
      )
      expect(displayedModules).toContain(visibleOfferModule)
      expect(displayedModules.length).toBe(3)
    })
  })
})
