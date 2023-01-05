import { CategoryListContentModel, ContentTypes } from 'libs/contentful/types'

export const categoryListFixture: CategoryListContentModel = {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '2bg01iqy0isv',
      },
    },
    id: '2TFHziway9rbBe6zvu64ZZ',
    type: 'Entry',
    createdAt: '2022-12-23T13:28:22.633Z',
    updatedAt: '2022-12-23T13:28:22.633Z',
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
        id: ContentTypes.CATEGORY_LIST,
      },
    },
    locale: 'en-US',
  },
  fields: {
    title: 'Cette semaine sur le pass',
    categoryBlockList: [
      {
        sys: {
          space: {
            sys: {
              type: 'Link',
              linkType: 'Space',
              id: '2bg01iqy0isv',
            },
          },
          id: '3tCepzu3UqlaZbeEFJROta',
          type: 'Entry',
          createdAt: '2022-12-23T13:27:21.921Z',
          updatedAt: '2022-12-23T13:27:21.921Z',
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
              id: ContentTypes.CATEGORY_BLOCK,
            },
          },
          locale: 'en-US',
        },
        fields: {
          title: 'Livres',
          image: {
            sys: {
              space: {
                sys: {
                  type: 'Link',
                  linkType: 'Space',
                  id: '2bg01iqy0isv',
                },
              },
              id: '1uTePwMo6qxJo7bMM7VLeX',
              type: 'Asset',
              createdAt: '2022-11-10T17:15:29.312Z',
              updatedAt: '2022-11-10T17:19:54.202Z',
              environment: {
                sys: {
                  id: 'testing',
                  type: 'Link',
                  linkType: 'Environment',
                },
              },
              revision: 3,
              locale: 'en-US',
            },
            fields: {
              title: 'wefrac',
              description: '',
              file: {
                url: '//images.ctfassets.net/2bg01iqy0isv/1uTePwMo6qxJo7bMM7VLeX/fdea7eb6fd7ab2003a5f1eeaba2565e9/17-insta-1080x1350_560x800.jpg',
                details: {
                  size: 100095,
                  image: {
                    width: 560,
                    height: 800,
                  },
                },
                fileName: '17-insta-1080x1350_560x800.jpg',
                contentType: 'image/jpeg',
              },
            },
          },
          homeEntryId: '6DCThxvbPFKAo04SVRZtwY',
        },
      },
      {
        sys: {
          space: {
            sys: {
              type: 'Link',
              linkType: 'Space',
              id: '2bg01iqy0isv',
            },
          },
          id: '7s8Pcu34LbJytAIU1iZA0N',
          type: 'Entry',
          createdAt: '2022-12-23T10:39:45.302Z',
          updatedAt: '2022-12-23T13:28:18.330Z',
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
              id: ContentTypes.CATEGORY_BLOCK,
            },
          },
          locale: 'en-US',
        },
        fields: {
          title: 'Cinéma',
          image: {
            sys: {
              space: {
                sys: {
                  type: 'Link',
                  linkType: 'Space',
                  id: '2bg01iqy0isv',
                },
              },
              id: '1IujqyX9w3ugcGGbKlolbp',
              type: 'Asset',
              createdAt: '2022-05-03T09:58:15.614Z',
              updatedAt: '2022-10-21T09:51:46.381Z',
              environment: {
                sys: {
                  id: 'testing',
                  type: 'Link',
                  linkType: 'Environment',
                },
              },
              revision: 7,
              locale: 'en-US',
            },
            fields: {
              title: 'Test Sab',
              description: 'dqqddsds',
              file: {
                url: '//images.ctfassets.net/2bg01iqy0isv/1IujqyX9w3ugcGGbKlolbp/d11cdb6d0dee5e6d3fb2b072031a01e7/i107848-eduquer-un-chaton.jpeg',
                details: {
                  size: 378517,
                  image: {
                    width: 1000,
                    height: 667,
                  },
                },
                fileName: 'i107848-eduquer-un-chaton.jpeg',
                contentType: 'image/jpeg',
              },
            },
          },
          homeEntryId: '6DCThxvbPFKAo04SVRZtwY',
        },
      },
    ],
  },
}
