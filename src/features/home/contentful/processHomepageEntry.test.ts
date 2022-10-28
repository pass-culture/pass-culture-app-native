import { AlgoliaParameters, ContentTypes } from 'features/home/contentful/contentful'
import { adaptedHomepageEntry } from 'tests/fixtures/adaptedHomepageEntry'

import { buildSearchParams, parseOfferId, processHomepageEntry } from './processHomepageEntry'

describe('processHomepageEntry', () => {
  it('should format homepage entries so we can use it to display infos on home page', () => {
    expect(processHomepageEntry(adaptedHomepageEntry)).toMatchSnapshot()
  })

  it('should format homepage entries: no fields case', () => {
    const homepageNatifType: ContentTypes = ContentTypes.HOMEPAGE_NATIF
    const sys = {
      space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
      id: '16PgpnlCOYYIhUTclR0oO4',
      type: 'Entry',
      createdAt: '2020-07-02T13:36:02.919Z',
      updatedAt: '2020-10-30T10:07:29.549Z',
      environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
      revision: 154,
      contentType: {
        sys: { type: 'Link', linkType: 'ContentType', id: homepageNatifType },
      },
      locale: 'en-US',
    }

    const emptyModulesHomepageEntries = {
      sys,
      fields: {
        title: 'Homepage',
        modules: [],
      },
      metadata: { tags: [] },
    }
    expect(processHomepageEntry(emptyModulesHomepageEntries)).toEqual([])
  })

  describe('buildSearchParams', () => {
    const algoliaType: ContentTypes = ContentTypes.ALGOLIA
    const algoliaParameters = {
      metadata: { tags: [] },
      sys: {
        space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
        id: 'XSfVIg1577cOcs23K6m3n',
        type: 'Entry',
        createdAt: '2020-11-12T11:10:41.542Z',
        updatedAt: '2021-07-07T08:53:35.350Z',
        environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
        revision: 35,
        contentType: {
          sys: { type: 'Link', linkType: 'ContentType', id: algoliaType },
        },
        locale: 'en-US',
      },
      fields: { title: 'Livre', hitsPerPage: 1 },
    }

    it('should filter out unpublished modules', () => {
      const additionalAlgoliaParameters = [
        { sys: { type: 'Link', linkType: 'Entry', id: '2nYjyMYFD6HXrrycEW74Km' } },
      ] as unknown as AlgoliaParameters[]

      const search = buildSearchParams(algoliaParameters, additionalAlgoliaParameters)
      expect(search).toHaveLength(1)
      expect(search[0]).toStrictEqual({ title: 'Livre', hitsPerPage: 1 })
    })

    it('should compose a playlist with additional parameters', () => {
      const additionalAlgoliaParameters = [
        { ...algoliaParameters, fields: { title: 'Musique', categories: ['Musique'] } },
        { ...algoliaParameters, fields: { title: 'Ciné', categories: ['Cinéma'] } },
      ] as unknown as AlgoliaParameters[]

      const search = buildSearchParams(algoliaParameters, additionalAlgoliaParameters)
      expect(search).toHaveLength(3)
      expect(search).toStrictEqual([
        { title: 'Livre', hitsPerPage: 1 },
        { title: 'Musique', categories: ['Musique'] },
        { title: 'Ciné', categories: ['Cinéma'] },
      ])
    })
  })
})

describe('parseOfferId', () => {
  it.each`
    offerId      | expected
    ${'12345'}   | ${12345}
    ${'A120934'} | ${null}
  `(
    'parseOfferId($offerId) = $expected',
    ({ offerId, expected }: { offerId: string; expected: number | null }) => {
      expect(parseOfferId(offerId)).toEqual(expected)
    }
  )
})
