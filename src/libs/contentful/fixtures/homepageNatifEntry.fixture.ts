import { algoliaNatifModuleFixture } from 'libs/contentful/fixtures/algoliaModules.fixture'
import { businessNatifModuleFixture } from 'libs/contentful/fixtures/businessModule.fixture'
import { categoryListFixture } from 'libs/contentful/fixtures/categoryList.fixture'
import { exclusivityNatifModuleFixture } from 'libs/contentful/fixtures/exclusivityModule.fixture'
import { highlightOfferContentModelFixture } from 'libs/contentful/fixtures/highlightOfferContentModel.fixture'
import { recommendationNatifModuleFixture } from 'libs/contentful/fixtures/recommendationNatifModule.fixture'
import { thematicHighlightModuleFixture } from 'libs/contentful/fixtures/thematicHighlightModule.fixture'
import { venuesNatifModuleFixture } from 'libs/contentful/fixtures/venuesModule.fixture'
import { ClassicThematicHeader, ContentTypes, HomepageNatifEntry } from 'libs/contentful/types'

export const classicThematicHeaderFixture: ClassicThematicHeader = {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '2bg01iqy0isv',
      },
    },
    id: '60vR54AgFyZrEjljpvNhwe',
    type: 'Entry',
    createdAt: '2023-08-17T15:24:36.535Z',
    updatedAt: '2023-08-17T15:24:44.191Z',
    environment: {
      sys: {
        id: 'testing',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    revision: 2,
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: ContentTypes.CLASSIC_THEMATIC_HEADER,
      },
    },
    locale: 'en-US',
  },
  fields: {
    title: 'Header test',
    displayedTitle: 'Un titre court',
    displayedSubtitle:
      'Unsoustitretroplongquidépassebeaucoupbeaucoupbeaucoupbeaucoupbeaucoupbeaucoup',
  },
}

export const homepageNatifEntryFixture: HomepageNatifEntry = {
  metadata: { tags: [] },
  sys: {
    space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
    id: '6DCThxvbPFKAo04SVRZtwY',
    type: 'Entry',
    createdAt: '2022-10-26T09:51:00.143Z',
    updatedAt: '2022-12-30T09:01:38.874Z',
    environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
    revision: 24,
    contentType: {
      sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.HOMEPAGE_NATIF },
    },
    locale: 'en-US',
  },
  fields: {
    modules: [
      businessNatifModuleFixture,
      algoliaNatifModuleFixture,
      exclusivityNatifModuleFixture,
      recommendationNatifModuleFixture,
      venuesNatifModuleFixture,
      categoryListFixture,
      thematicHighlightModuleFixture,
      highlightOfferContentModelFixture,
    ],
    title: 'Test home N-1 Evek',
    thematicHeader: classicThematicHeaderFixture,
  },
}
