import { ContentTypes, MovieGenres } from 'libs/contentful/types'

export const movieGenresFixture: MovieGenres = {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '2bg01iqy0isv',
      },
    },
    id: '6booBIgPJz7cjVu4snM4bX',
    type: 'Entry',
    createdAt: '2023-01-26T17:16:34.643Z',
    updatedAt: '2023-01-30T15:05:04.055Z',
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
        id: ContentTypes.MOVIE_GENRES,
      },
    },
    locale: 'en-US',
  },
  fields: {
    movieGenres: ['ACTION', 'BOLLYWOOD'],
  },
}
