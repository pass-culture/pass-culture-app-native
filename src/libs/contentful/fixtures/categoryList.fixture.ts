import { Color } from 'features/home/types'
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
          thematicCategoryInfo: {
            sys: {
              space: {
                sys: {
                  type: 'Link',
                  linkType: 'Space',
                  id: '2bg01iqy0isv',
                },
              },
              id: '2xEmftUxdtnfw2touSs6pr',
              type: 'Entry',
              createdAt: '2023-02-27T15:48:23.465Z',
              updatedAt: '2023-02-27T15:48:23.465Z',
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
                  id: ContentTypes.THEMATIC_CATEGORY_INFO,
                },
              },
              locale: 'en-US',
            },
            fields: {
              title: 'Livres',
              displayedTitle: 'Livres',
              color: Color.Gold,
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
          thematicCategoryInfo: {
            sys: {
              space: {
                sys: {
                  type: 'Link',
                  linkType: 'Space',
                  id: '2bg01iqy0isv',
                },
              },
              id: '7rOeUTyjb7O2IFUio8Yn5j',
              type: 'Entry',
              createdAt: '2023-02-27T15:47:57.604Z',
              updatedAt: '2023-02-27T15:47:57.604Z',
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
                  id: ContentTypes.THEMATIC_CATEGORY_INFO,
                },
              },
              locale: 'en-US',
            },
            fields: {
              title: 'Chasse au trésor - Cinéma',
              displayedTitle: 'Cinéma',
              color: Color.SkyBlue,
            },
          },
          homeEntryId: '6DCThxvbPFKAo04SVRZtwY',
        },
      },
    ],
  },
}
