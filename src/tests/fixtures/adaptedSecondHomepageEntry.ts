import { ContentTypes, HomepageEntry } from 'features/home/contentful'

export const adaptedSecondHomepageEntry: HomepageEntry = {
  metadata: {
    tags: [],
  },
  sys: {
    space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
    id: '7IuIeovqUykM1uvWwwPPh7',
    type: 'Entry',
    createdAt: '2020-10-28T17:32:42.192Z',
    updatedAt: '2020-10-28T17:32:42.192Z',
    environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
    revision: 1,
    contentType: {
      sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.HOMEPAGE_NATIF },
    },
    locale: 'en-US',
  },
  fields: {
    modules: [
      {
        fields: {
          firstLine: 'En savoir plus sur le pass Culture',
          image: {
            fields: {
              description: 'Image de fond pour les blocs métiers',
              file: {
                contentType: 'image/png',
                details: { image: { height: 574, width: 1934 }, size: 616732 },
                fileName: 'Capture d’écran 2020-07-22 à 12.24.11.png',
                url: '//images.ctfassets.net/2bg01iqy0isv/6kgALLZ7PL6vYubjvE8s0c/8e545d3312343d25c776c3cded9e2784/Capture_d___e__cran_2020-07-22_a___12.24.11.png',
              },
              title: 'Cover pour les blocs métiers',
            },
            sys: {
              createdAt: '2020-07-06T15:36:15.148Z',
              environment: { sys: { id: 'testing', linkType: 'Environment', type: 'Link' } },
              id: '6kgALLZ7PL6vYubjvE8s0c',
              locale: 'en-US',
              revision: 8,
              space: { sys: { id: '2bg01iqy0isv', linkType: 'Space', type: 'Link' } },
              type: 'Asset',
              updatedAt: '2020-07-22T10:26:36.835Z',
            },
          },
          secondLine: 'Consulte notre FAQ\u00a0!',
          targetNotConnectedUsersOnly: true,
          title: 'FAQ pass Culture',
          url: 'https://passculture.zendesk.com/hc/fr/',
        },
        sys: {
          contentType: {
            sys: { id: ContentTypes.BUSINESS, linkType: 'ContentType', type: 'Link' },
          },
          createdAt: '2020-10-28T17:32:47.396Z',
          environment: { sys: { id: 'testing', linkType: 'Environment', type: 'Link' } },
          id: '24FUVnnPPJ9v7JHkO7eaXK',
          locale: 'en-US',
          revision: 1,
          space: { sys: { id: '2bg01iqy0isv', linkType: 'Space', type: 'Link' } },
          type: 'Entry',
          updatedAt: '2020-10-28T17:32:47.396Z',
        },
      },
    ],
    title: 'Homepage test démo août 2020',
  },
}
