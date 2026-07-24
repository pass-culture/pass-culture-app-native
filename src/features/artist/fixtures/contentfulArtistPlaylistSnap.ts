export const contentfulArtistPlaylistSnap = {
  sys: {
    type: 'Array',
  },
  total: 1,
  skip: 0,
  limit: 100,
  items: [
    {
      metadata: {
        tags: [],
        concepts: [],
      },
      sys: {
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: '2bg01iqy0isv',
          },
        },
        id: '3ekwFnm4jZy5ohgDNTjLRK',
        type: 'Entry',
        createdAt: '2026-06-16T14:46:35.284Z',
        updatedAt: '2026-07-22T10:03:56.198Z',
        environment: {
          sys: {
            id: 'testing',
            type: 'Link',
            linkType: 'Environment',
          },
        },
        publishedVersion: 76,
        revision: 34,
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: 'artistPlaylist',
          },
        },
        locale: 'en-US',
      },
      fields: {
        title: 'Reco d’artiste',
        artistId: '819d02dd-6097-4d11-aa8d-8dd9dcba4c97',
        algoliaParameters: {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: 'QzD7Rp54PTJzL5ZMjUcbO',
          },
        },
        displayParameters: {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: '5bx0MUKm5ciZTPxATx88dr',
          },
        },
      },
    },
  ],
  includes: {
    Entry: [
      {
        metadata: {
          tags: [],
          concepts: [],
        },
        sys: {
          space: {
            sys: {
              type: 'Link',
              linkType: 'Space',
              id: '2bg01iqy0isv',
            },
          },
          id: '5bx0MUKm5ciZTPxATx88dr',
          type: 'Entry',
          createdAt: '2026-06-16T14:46:29.236Z',
          updatedAt: '2026-06-25T06:52:41.808Z',
          environment: {
            sys: {
              id: 'testing',
              type: 'Link',
              linkType: 'Environment',
            },
          },
          publishedVersion: 13,
          revision: 5,
          contentType: {
            sys: {
              type: 'Link',
              linkType: 'ContentType',
              id: 'displayParameters',
            },
          },
          locale: 'en-US',
        },
        fields: {
          title: 'Reco d’artiste',
          layout: 'three-items',
          minOffers: 1,
        },
      },
      {
        metadata: {
          tags: [],
          concepts: [],
        },
        sys: {
          space: {
            sys: {
              type: 'Link',
              linkType: 'Space',
              id: '2bg01iqy0isv',
            },
          },
          id: 'QzD7Rp54PTJzL5ZMjUcbO',
          type: 'Entry',
          createdAt: '2026-06-16T14:43:17.123Z',
          updatedAt: '2026-07-01T13:19:30.836Z',
          environment: {
            sys: {
              id: 'testing',
              type: 'Link',
              linkType: 'Environment',
            },
          },
          publishedVersion: 17,
          revision: 7,
          contentType: {
            sys: {
              type: 'Link',
              linkType: 'ContentType',
              id: 'algoliaParameters',
            },
          },
          locale: 'en-US',
        },
        fields: {
          title: 'Reco d’artiste',
          hitsPerPage: 10,
        },
      },
    ],
  },
} as const
