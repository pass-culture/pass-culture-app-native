import { ContentTypes, HomepageNatifEntry } from 'libs/contentful/types'

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
      {
        sys: {
          space: {
            sys: {
              type: 'Link',
              linkType: 'Space',
              id: '2bg01iqy0isv',
            },
          },
          id: '20SId61p6EFTG7kgBTFrOa',
          type: 'Entry',
          createdAt: '2022-06-08T12:41:09.558Z',
          updatedAt: '2022-10-05T15:07:48.551Z',
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
              id: 'business',
            },
          },
          locale: 'en-US',
        },
        fields: {
          title:
            'Crée un compte\u00a0! 15-18 [A MAINTENIR EN BLOC 2 et paramétré pour être visible seulement pour les non connectés]',
          firstLine: 'Débloque ton crédit\u00a0! ',
          secondLine: 'Termine ton inscription',
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
          url: 'https://passculture.app/creation-compte',
          targetNotConnectedUsersOnly: true,
        },
      },
      {
        sys: {
          space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
          id: '2DYuR6KoSLElDuiMMjxx8g',
          type: 'Entry',
          createdAt: '2020-11-12T11:11:46.272Z',
          updatedAt: '2022-06-03T14:10:23.827Z',
          environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
          revision: 17,
          contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'algolia' } },
          locale: 'en-US',
        },
        fields: {
          title: 'Fais le plein de lecture',
          algoliaParameters: {
            sys: {
              space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
              id: 'XSfVIg1577cOcs23K6m3n',
              type: 'Entry',
              createdAt: '2020-11-12T11:10:41.542Z',
              updatedAt: '2022-06-03T14:11:30.186Z',
              environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
              revision: 38,
              contentType: {
                sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.ALGOLIA_PARAMETERS },
              },
              locale: 'en-US',
            },
            fields: {
              title: 'Livre',
              isGeolocated: false,
              categories: ['Livres'],
              hitsPerPage: 10,
            },
          },
          displayParameters: {
            sys: {
              space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
              id: '7CPXxhWnNhT9LIxIGnHL9m',
              type: 'Entry',
              createdAt: '2020-11-12T11:10:24.065Z',
              updatedAt: '2022-07-26T07:19:25.766Z',
              environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
              revision: 19,
              contentType: {
                sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.DISPLAY_PARAMETERS },
              },
              locale: 'en-US',
            },
            fields: {
              title: 'Fais le plein de lecture avec notre partenaire ',
              subtitle:
                'Tout plein de livres pour encore plus de fun sans que pour autant on en sache ',
              layout: 'two-items',
              minOffers: 1,
            },
          },
        },
      },
      {
        sys: {
          space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
          id: 'AEYnm9QjIo2rZKoCfSvMD',
          type: 'Entry',
          createdAt: '2022-11-21T09:43:22.352Z',
          updatedAt: '2022-11-21T09:43:22.352Z',
          environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
          revision: 1,
          contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'exclusivity' } },
          locale: 'en-US',
        },
        fields: {
          title: 'WE FRAC CAEN',
          alt: 'Week-end FRAC',
          image: {
            sys: {
              space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
              id: '1uTePwMo6qxJo7bMM7VLeX',
              type: 'Asset',
              createdAt: '2022-11-10T17:15:29.312Z',
              updatedAt: '2022-11-10T17:19:54.202Z',
              environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
              revision: 3,
              locale: 'en-US',
            },
            fields: {
              title: 'wefrac',
              description: '',
              file: {
                url: '//images.ctfassets.net/2bg01iqy0isv/1uTePwMo6qxJo7bMM7VLeX/fdea7eb6fd7ab2003a5f1eeaba2565e9/17-insta-1080x1350_560x800.jpg',
                details: { size: 100095, image: { width: 560, height: 800 } },
                fileName: '17-insta-1080x1350_560x800.jpg',
                contentType: 'image/jpeg',
              },
            },
          },
          offerId: '123456789',
        },
      },
      {
        sys: {
          space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
          id: '3sAqNrRMXUOES7tFyRFFO8',
          type: 'Entry',
          createdAt: '2022-07-13T12:28:35.922Z',
          updatedAt: '2022-12-06T09:31:04.217Z',
          environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
          revision: 3,
          contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'recommendation' } },
          locale: 'en-US',
        },
        fields: {
          title: 'Nos recos',
          displayParameters: {
            sys: {
              space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
              id: '5zr0sGoxz6mSgkPDgk0pY9',
              type: 'Entry',
              createdAt: '2022-07-13T12:28:32.262Z',
              updatedAt: '2022-12-06T09:31:38.064Z',
              environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
              revision: 3,
              contentType: {
                sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.DISPLAY_PARAMETERS },
              },
              locale: 'en-US',
            },
            fields: { title: 'Nos recos', layout: 'two-items', minOffers: 1 },
          },
        },
      },
      {
        sys: {
          space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
          id: '105MMz59tftcxXJICXt7ja',
          type: 'Entry',
          createdAt: '2021-09-15T09:47:05.723Z',
          updatedAt: '2022-11-28T15:18:57.290Z',
          environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
          revision: 9,
          contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'venuesPlaylist' } },
          locale: 'en-US',
        },
        fields: {
          title: 'Exemple de playlist de lieu',
          venuesSearchParameters: [
            {
              sys: {
                space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
                id: '349gyyDhI60dqYrmQ9kUMC',
                type: 'Entry',
                createdAt: '2021-09-10T16:31:54.507Z',
                updatedAt: '2022-09-09T14:48:20.043Z',
                environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
                revision: 29,
                contentType: {
                  sys: {
                    type: 'Link',
                    linkType: 'ContentType',
                    id: ContentTypes.VENUES_PARAMETERS,
                  },
                },
                locale: 'en-US',
              },
              fields: {
                title: 'Exemple de playlist de lieux',
                isGeolocated: false,
                venueTypes: [
                  'Bibliothèque ou médiathèque',
                  'Arts visuels, arts plastiques et galeries',
                  'Centre culturel',
                  'Cinéma - Salle de projections',
                  'Cours et pratique artistiques',
                  'Culture scientifique',
                  'Festival',
                  'Jeux / Jeux vidéos',
                  'Librairie',
                  'Magasin arts créatifs',
                  'Musique - Disquaire',
                  'Musique - Magasin d’instruments',
                  'Musique - Salle de concerts',
                  'Musée',
                  'Offre numérique',
                  'Patrimoine et tourisme',
                  'Spectacle vivant',
                  'Cinéma itinérant',
                  'Autre type de lieu',
                ],
                hitsPerPage: 15,
              },
            },
          ],
          displayParameters: {
            sys: {
              space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
              id: '2fqphBLJADhOYkkzPHvzcT',
              type: 'Entry',
              createdAt: '2020-07-28T14:19:35.878Z',
              updatedAt: '2022-07-26T06:58:31.177Z',
              environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
              revision: 41,
              contentType: {
                sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.DISPLAY_PARAMETERS },
              },
              locale: 'en-US',
            },
            fields: {
              title: 'Exemple de playlist de lieux',
              subtitle: "Ceci n'est pas une playlist de lieux",
              layout: 'one-item-medium',
              minOffers: 1,
            },
          },
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
      },
    ],
    title: 'Test home N-1 Evek',
    thematicHeaderTitle: 'Un titre court',
    thematicHeaderSubtitle:
      'Unsoustitretroplongquidépassebeaucoupbeaucoupbeaucoupbeaucoupbeaucoupbeaucoup',
  },
}
