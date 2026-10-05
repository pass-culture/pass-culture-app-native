export const contentfulArtistEditorialSnap = {
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
        id: '5WgvNwbkdDj4BmtwYwWc9e',
        type: 'Entry',
        createdAt: '2026-09-28T12:12:03.710Z',
        updatedAt: '2026-09-29T07:23:13.895Z',
        environment: {
          sys: {
            id: 'testing',
            type: 'Link',
            linkType: 'Environment',
          },
        },
        publishedVersion: 14,
        revision: 5,
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: 'artistEditorial',
          },
        },
        locale: 'en-US',
      },
      fields: {
        title: 'Son incroyable discographie',
        artistId: '05b6af23-84b1-43a3-b648-a74433400c70',
        color: 'Information04',
        illustration: 'MusicSheet',
        algoliaParameters: {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: '12by0JT6IaS3khHYPMjZN5',
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
          id: '12by0JT6IaS3khHYPMjZN5',
          type: 'Entry',
          createdAt: '2026-09-28T14:08:18.739Z',
          updatedAt: '2026-09-29T07:27:08.612Z',
          environment: {
            sys: {
              id: 'testing',
              type: 'Link',
              linkType: 'Environment',
            },
          },
          publishedVersion: 11,
          revision: 3,
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
          title: 'Discographie',
          tags: ['mise_en_avant_artiste'],
          hitsPerPage: 3,
        },
      },
    ],
  },
} as const
