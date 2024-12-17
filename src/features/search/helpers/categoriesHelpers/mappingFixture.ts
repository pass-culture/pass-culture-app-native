export const bookTreeResultFixture = {
  SearchGroup: {
    label: 'Livre',
    children: {
      TOUT: {
        label: 'Tout',
      },
      FESTIVAL_DU_LIVRE: {
        label: 'Évènements autour du livre',
      },
      LIVRES_AUDIO_PHYSIQUES: {
        label: 'Livres audio',
      },
      LIVRES_NUMERIQUE_ET_AUDIO: {
        label: 'E-books',
      },
      ROMANS_ET_LITTERATURE: {
        label: 'Romans et littérature',
        genreTypeKey: 'BOOK',
        gtls: [
          {
            code: '01010000',
            label: 'Romans & Nouvelles',
            level: 2,
          },
          {
            code: '01020000',
            label: 'Romans & Nouvelles de genre',
            level: 2,
          },
          {
            code: '01030000',
            label: 'Œuvres classiques',
            level: 2,
          },
          {
            code: '02000000',
            label: 'Jeunesse',
            level: 1,
          },
          {
            code: '01060000',
            label: 'Biographie / Témoignage littéraire',
            level: 2,
          },
          {
            code: '01040000',
            label: 'Contes / Légendes',
            level: 2,
          },
        ],
        children: {
          ROMANCES: {
            label: 'Romances',
            gtls: [
              {
                code: '01020600',
                label: 'Roman sentimental',
                level: 3,
              },
            ],
            position: 1,
          },
          THRILLER: {
            label: 'Thriller',
            gtls: [
              {
                code: '01020500',
                label: 'Thriller',
                level: 3,
              },
            ],
            position: 2,
          },
          FANTASY: {
            label: 'Fantasy',
            gtls: [
              {
                code: '01020900',
                label: 'Fantasy',
                level: 3,
              },
            ],
            position: 3,
          },
          POLICIER: {
            label: 'Policier',
            gtls: [
              {
                code: '01020400',
                label: 'Policier',
                level: 3,
              },
            ],
            position: 4,
          },
          ŒUVRES_CLASSIQUES: {
            label: 'Œuvres classiques',
            gtls: [
              {
                code: '01030000',
                label: 'Œuvres classiques',
                level: 2,
              },
            ],
            position: 5,
          },
          SCIENCE_FICTION: {
            label: 'Science-fiction',
            gtls: [
              {
                code: '01020700',
                label: 'Science-fiction',
                level: 3,
              },
            ],
            position: 6,
          },
          HORREUR: {
            label: 'Horreur',
            gtls: [
              {
                code: '01020802',
                label: 'Horreur / Terreur',
                level: 4,
              },
            ],
            position: 7,
          },
          AVENTURE: {
            label: 'Aventure',
            gtls: [
              {
                code: '01020200',
                label: 'Aventure',
                level: 3,
              },
              {
                code: '01020300',
                label: 'Espionnage',
                level: 3,
              },
            ],
            position: 8,
          },
          BIOGRAPHIE: {
            label: 'Biographie',
            gtls: [
              {
                code: '01060000',
                label: 'Biographie / Témoignage littéraire',
                level: 2,
              },
            ],
            position: 9,
          },
          CONTES_ET_LEGENDES: {
            label: 'Contes & légendes',
            gtls: [
              {
                code: '01040000',
                label: 'Contes / Légendes',
                level: 2,
              },
            ],
            position: 10,
          },
        },
      },
    },
  },
}
