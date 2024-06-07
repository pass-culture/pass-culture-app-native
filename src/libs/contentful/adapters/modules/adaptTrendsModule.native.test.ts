import { HomepageModuleType } from 'features/home/types'
import { adaptTrendsModule } from 'libs/contentful/adapters/modules/adaptTrendsModule'
import { trendsModuleFixture } from 'libs/contentful/fixtures/trendsModule.fixture'
import {
  TrendBlockContentModel,
  TrendBlockFields,
  VenueMapBlockContentModel,
} from 'libs/contentful/types'

describe('adaptTrendsModule', () => {
  it('should adapt from Contentful Trends data', () => {
    expect(adaptTrendsModule(trendsModuleFixture)).toEqual({
      id: 'g6VpeYbOosfALeqR55Ah6',
      type: HomepageModuleType.TrendsModule,
      items: [
        {
          homeEntryId: '7qcfqY5zFesLVO5fMb4cqm',
          id: '6dn0unOv4tRBNfOebVHOOy',
          image: {
            testUri: '../../../src/features/home/images/map.png',
          },
          title: 'Accès carte des lieux',
        },
        {
          homeEntryId: '7qcfqY5zFesLVO5fMb4cqm',
          id: '16ZgVwnOXvVc0N8ko9Kius',
          image: {
            uri: 'https://images.ctfassets.net/2bg01iqy0isv/635psakQQwLtNuOFcf1jx2/5d779586de44d247145c8808d48a91ed/recos.png',
          },
          title: 'Tendance 1',
        },
        {
          homeEntryId: '7qcfqY5zFesLVO5fMb4cqm',
          id: '16ZgVwnOXvVc0N8ko9Kius',
          image: {
            uri: 'https://images.ctfassets.net/2bg01iqy0isv/635psakQQwLtNuOFcf1jx2/5d779586de44d247145c8808d48a91ed/recos.png',
          },
          title: 'Tendance 2',
        },
        {
          homeEntryId: '7qcfqY5zFesLVO5fMb4cqm',
          id: '16ZgVwnOXvVc0N8ko9Kius',
          image: {
            uri: 'https://images.ctfassets.net/2bg01iqy0isv/635psakQQwLtNuOFcf1jx2/5d779586de44d247145c8808d48a91ed/recos.png',
          },
          title: 'Tendance 3',
        },
      ],
    })
  })

  it('should return nothing when Trends are unpublished', () => {
    const unpublishedTrends = {
      ...trendsModuleFixture,
      fields: undefined,
    }

    expect(adaptTrendsModule(unpublishedTrends)).toEqual(null)
  })

  it('should filter out venue map when no homeEntryId is provided', () => {
    const venueBlock = trendsModuleFixture.fields?.items[0] as VenueMapBlockContentModel
    const trendBlock = trendsModuleFixture.fields?.items[1] as TrendBlockContentModel
    const unpublishedTrends = {
      ...trendsModuleFixture,
      fields: { items: [trendBlock, { ...venueBlock, fields: { title: 'Bloc carte' } }] },
    }

    expect(adaptTrendsModule(unpublishedTrends)).toEqual({
      id: 'g6VpeYbOosfALeqR55Ah6',
      type: HomepageModuleType.TrendsModule,
      items: [
        {
          homeEntryId: '7qcfqY5zFesLVO5fMb4cqm',
          id: '16ZgVwnOXvVc0N8ko9Kius',
          image: {
            uri: 'https://images.ctfassets.net/2bg01iqy0isv/635psakQQwLtNuOFcf1jx2/5d779586de44d247145c8808d48a91ed/recos.png',
          },
          title: 'Tendance 1',
        },
      ],
    })
  })

  it('should filter out trend block when no image is provided', () => {
    const venueBlock = trendsModuleFixture.fields?.items[0] as VenueMapBlockContentModel
    const trendBlock = trendsModuleFixture.fields?.items[1] as TrendBlockContentModel
    const unpublishedTrends = {
      ...trendsModuleFixture,
      fields: {
        items: [
          venueBlock,
          { ...trendBlock, fields: { ...trendBlock.fields, image: {} } as TrendBlockFields },
        ],
      },
    }

    expect(adaptTrendsModule(unpublishedTrends)).toEqual({
      id: 'g6VpeYbOosfALeqR55Ah6',
      type: HomepageModuleType.TrendsModule,
      items: [
        {
          id: '6dn0unOv4tRBNfOebVHOOy',
          homeEntryId: '7qcfqY5zFesLVO5fMb4cqm',
          image: {
            testUri: '../../../src/features/home/images/map.png',
          },
          title: 'Accès carte des lieux',
        },
      ],
    })
  })
})
