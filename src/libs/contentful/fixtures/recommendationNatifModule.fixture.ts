import { bookTypesFixture } from 'libs/contentful/fixtures/bookTypes.fixture'
import { categoriesFixture } from 'libs/contentful/fixtures/categoriesFixture'
import { movieGenresFixture } from 'libs/contentful/fixtures/movieGenres.fixture'
import { musicTypesFixture } from 'libs/contentful/fixtures/musicTypes.fixture'
import { ShowTypesFixture } from 'libs/contentful/fixtures/showTypes.fixture'
import { subcategoriesFixture } from 'libs/contentful/fixtures/subcategoriesEntry.fixture'
import { ContentTypes, RecommendationContentModel } from 'libs/contentful/types'

export const recommendationNatifModuleFixture: RecommendationContentModel = {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '2bg01iqy0isv',
      },
    },
    id: '2TD5BEKL2zUGLhfzhkWhwL',
    type: 'Entry',
    createdAt: '2022-11-28T11:13:39.608Z',
    updatedAt: '2022-11-28T11:13:39.608Z',
    environment: {
      sys: {
        id: 'testing',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    revision: 1,
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: ContentTypes.RECOMMENDATION,
      },
    },
    locale: 'en-US',
  },
  fields: {
    title: 'Tes évènements en ligne',
    displayParameters: {
      sys: {
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: '2bg01iqy0isv',
          },
        },
        id: '5dPoY40tY3KBg0x8suDOHz',
        type: 'Entry',
        createdAt: '2022-11-28T11:12:49.720Z',
        updatedAt: '2022-11-28T11:12:49.720Z',
        environment: {
          sys: {
            id: 'testing',
            type: 'Link',
            linkType: 'Environment',
          },
        },
        revision: 1,
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: ContentTypes.DISPLAY_PARAMETERS,
          },
        },
        locale: 'en-US',
      },
      fields: {
        title: 'Tes évènements en ligne',
        layout: 'two-items',
        minOffers: 1,
      },
    },
    recommendationParameters: {
      sys: {
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: '2bg01iqy0isv',
          },
        },
        id: 'K0Tq2rnfKKNYCsnFyybsG',
        type: 'Entry',
        createdAt: '2022-11-28T11:13:32.371Z',
        updatedAt: '2023-01-04T14:17:12.840Z',
        environment: {
          sys: {
            id: 'testing',
            type: 'Link',
            linkType: 'Environment',
          },
        },
        revision: 3,
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: ContentTypes.RECOMMENDATION_PARAMETERS,
          },
        },
        locale: 'en-US',
      },
      fields: {
        title: 'Tes évènements en ligne',
        isEvent: true,
        beginningDatetime: '2021-01-01T00:00+00:00',
        endingDatetime: '2024-01-01T00:00+00:00',
        upcomingWeekendEvent: true,
        eventDuringNextXDays: 5,
        currentWeekEvent: true,
        priceMin: 0.99,
        priceMax: 99.99,
        recommendationCategories: categoriesFixture,
        recommendationSubcategories: subcategoriesFixture,
        newestOnly: false,
        isDuo: false,
        isRecoShuffled: false,
        bookTypes: bookTypesFixture,
        movieGenres: movieGenresFixture,
        musicTypes: musicTypesFixture,
        showTypes: ShowTypesFixture,
      },
    },
  },
}
