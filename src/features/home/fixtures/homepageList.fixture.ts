import { Homepage, HomepageModuleType, ThematicHeaderType } from 'features/home/types'

export const homepageList: Homepage[] = [
  {
    id: '6DCThxvbPFKAo04SVRZtwY',
    modules: [
      {
        alt: 'Exclusitivité du moment',
        displayParameters: { aroundRadius: 20, isGeolocated: true },
        id: 'KiG6rWuQYhHuGIBXZNeB2',
        image:
          'https://images.ctfassets.net/2bg01iqy0isv/2qTXOFUocq1HhgB7Wzl23K/a48ab7bedde13545231c0f843fbcfe10/image__3_.png',
        offerId: 317,
        title: 'Exclusitivité du moment',
        type: HomepageModuleType.ExclusivityModule,
        url: undefined,
      },
      {
        displayParameters: {
          layout: 'one-item-medium',
          minOffers: 2,
          title: 'Pour bien commencer...',
        },
        id: 'GlQb8Zg3n1PoYVmOyVCgW',
        offersModuleParameters: [
          { hitsPerPage: 10, tags: ['	starter_pack_rentree'], title: 'Pour bien commencer...' },
        ],
        title: 'Pour bien commencer...',
        type: HomepageModuleType.OffersModule,
      },
      {
        displayParameters: {
          layout: 'two-items',
          minOffers: 2,
          title: 'Puisque tu aimes les visites...',
        },
        id: '5u3NaFTcu2XR5KgJ1OAg8C',
        offersModuleParameters: [
          { hitsPerPage: 4, tags: ['visites'], title: 'Puisque tu aimes les visites' },
        ],
        title: 'Puisque tu aimes les visites',
        type: HomepageModuleType.OffersModule,
      },
      {
        displayParameters: { layout: 'one-item-medium', minOffers: 1, title: 'Offres du moment' },
        id: '1LgDMVOKdH3agA0WG2LFEr',
        offersModuleParameters: [
          { hitsPerPage: 4, tags: ['offre_du_moment'], title: 'Les offres du moment' },
        ],
        title: '[Tout le temps] Offres du moment',
        type: HomepageModuleType.OffersModule,
      },
      {
        displayParameters: {
          layout: 'two-items',
          minOffers: 2,
          title: 'A faire ce week-end\u00a0!',
        },
        id: '3AbfVZZIZhfvSfGxJSrSqe',
        offersModuleParameters: [
          {
            beginningDatetime: '2020-09-11T00:01+02:00',
            endingDatetime: '2020-09-12T23:59+02:00',
            hitsPerPage: 30,
            title: 'Week-end',
          },
        ],
        title: '[Vendredi][Samedi] A faire ce week-end',
        type: HomepageModuleType.OffersModule,
      },
      {
        analyticsTitle: 'Donne ton avis sur le pass\u00a0!',
        id: 'K2yYJkeX30OoepIooo2Um',
        image:
          'https://images.ctfassets.net/2bg01iqy0isv/6kgALLZ7PL6vYubjvE8s0c/8e545d3312343d25c776c3cded9e2784/Capture_d___e__cran_2020-07-22_a___12.24.11.png',
        shouldTargetNotConnectedUsers: undefined,
        subtitle: 'En répondant à notre rapide questionnaire',
        title: 'Donne ton avis...',
        type: HomepageModuleType.BusinessModule,
        url: 'https://passculture.typeform.com/to/PYl2WwKC?email={email}',
        localizationArea: undefined,
      },
      {
        analyticsTitle: 'FAQ pass Culture',
        id: '24FUVnnPPJ9v7JHkO7eaXK',
        image:
          'https://images.ctfassets.net/2bg01iqy0isv/6kgALLZ7PL6vYubjvE8s0c/8e545d3312343d25c776c3cded9e2784/Capture_d___e__cran_2020-07-22_a___12.24.11.png',
        shouldTargetNotConnectedUsers: true,
        subtitle: 'Consulte notre FAQ\u00a0!',
        title: 'En savoir plus sur le pass Culture',
        type: HomepageModuleType.BusinessModule,
        url: 'https://passculture.zendesk.com/hc/fr/',
        localizationArea: undefined,
      },
      {
        analyticsTitle: 'Crée un compte\u00a0!',
        id: '24FUVnnPPJ9v7JHkO7eaID',
        image:
          'https://images.ctfassets.net/2bg01iqy0isv/6kgALLZ7PL6vYubjvE8s0c/8e545d3312343d25c776c3cded9e2784/Capture_d___e__cran_2020-07-22_a___12.24.11.png',
        shouldTargetNotConnectedUsers: false,
        subtitle: 'Si tu as 18 ans, bénéficie de 300\u00a0€.',
        title: 'Crée un compte\u00a0!',
        type: HomepageModuleType.BusinessModule,
        url: 'https://passculture.zendesk.com/hc/fr/',
        localizationArea: undefined,
      },
      {
        displayParameters: { layout: 'two-items', minOffers: 2, title: 'A faire à deux' },
        id: '3HnwRT9WtAl8pxywz83sX3',
        offersModuleParameters: [{ hitsPerPage: 10, tags: ['duo'], title: 'Offres duo' }],
        title: 'Plein de choses à faire à deux ;)',
        type: HomepageModuleType.OffersModule,
      },
      {
        displayParameters: {
          layout: 'one-item-medium',
          minOffers: 2,
          title: 'La sélection de ...',
        },
        id: '2Fjxhdirgh17ZvdPNZGDP4',
        offersModuleParameters: [{ hitsPerPage: 2, tags: ['foot'], title: 'Sélection Mbappé' }],
        title: 'Sélection MBappé',
        type: HomepageModuleType.OffersModule,
      },
      {
        displayParameters: {
          layout: 'two-items',
          minOffers: 2,
          title: 'Découvre les livres sélectionnés pour le Goncourt des lycéens 2020\u00a0!',
        },
        id: '7c7xq3ulzqO2yDRJLDmths',
        offersModuleParameters: [{ hitsPerPage: 4, tags: ['goncourt'], title: 'Goncourt' }],
        title: 'Découvre les livres sélectionnés pour le Goncourt des Lycéens\u00a0!',
        type: HomepageModuleType.OffersModule,
      },
      {
        displayParameters: {
          layout: 'one-item-medium',
          minOffers: 2,
          title: 'Parce que tu aimes la musique...',
        },
        id: '6lk6vCol5Qza2mfdtsTzW',
        offersModuleParameters: [
          { categories: ['Instruments de musique', 'Musique'], hitsPerPage: 6, title: 'Musique' },
        ],
        title: 'Parce que tu aimes la musique...',
        type: HomepageModuleType.OffersModule,
      },
    ],
    tags: ['master'],
  },
  {
    tags: [],
    id: '7IuIeovqUykM1uvWwwPPh8',
    modules: [
      {
        type: HomepageModuleType.BusinessModule,
        id: '24FUVnnPPJ9v7JHkO7eaXK',
        analyticsTitle: 'FAQ pass Culture',
        image:
          'https://images.ctfassets.net/2bg01iqy0isv/6kgALLZ7PL6vYubjvE8s0c/8e545d3312343d25c776c3cded9e2784/Capture_d___e__cran_2020-07-22_a___12.24.11.png',
        title: 'En savoir plus sur le pass Culture',
        subtitle: 'Consulte notre FAQ\u00a0!',
        url: 'https://passculture.zendesk.com/hc/fr/',
        shouldTargetNotConnectedUsers: true,
        localizationArea: undefined,
      },
    ],
    thematicHeader: {
      title: 'Un titre court',
      subtitle: 'Unsoustitretroplongquidépassebeaucoupbeaucoupbeaucoupbeaucoupbeaucoupbeaucoup',
      type: ThematicHeaderType.Default,
    },
  },
  {
    id: '7IuIeovqUykM1uvWwwPPh9',
    modules: [],
    tags: [],
    thematicHeader: {
      beginningDate: new Date('2022-12-21T23:00:00.000Z'),
      endingDate: new Date('2023-01-14T23:00:00.000Z'),
      imageUrl:
        'https://images.ctfassets.net/2bg01iqy0isv/6kYYW8Uwad2ZlLUmw1k4ax/9e1261e7010f4419506dc821b2d0bea8/be697ba0-3439-42fa-8f54-b917e988db66.jpeg',
      subtitle: 'Avec son sous-titre',
      title: 'Temps très fort',
      type: ThematicHeaderType.Highlight,
      introductionTitle: 'un super titre pour une super introduction',
      introductionParagraph:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s...Ipsum has been the industry’s standard dummy text ever since the 1500s...',
    },
  },
  {
    id: '7IuIeovqUykM1uvWwwPPh9',
    modules: [],
    tags: [],
    thematicHeader: {
      imageUrl:
        'https://images.ctfassets.net/2bg01iqy0isv/6kYYW8Uwad2ZlLUmw1k4ax/9e1261e7010f4419506dc821b2d0bea8/be697ba0-3439-42fa-8f54-b917e988db66.jpeg',
      subtitle: 'Sous-titre cinéma',
      title: 'Cinéma',
      type: ThematicHeaderType.Category,
    },
  },
]
