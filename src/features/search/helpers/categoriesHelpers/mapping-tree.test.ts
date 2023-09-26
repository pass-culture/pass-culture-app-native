import { GenreType, NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { createMappingTree } from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { FacetData } from 'libs/algolia'
import { mockedFacets } from 'libs/algolia/__mocks__/mockedFacets'
import { placeholderData } from 'libs/subcategories/placeholderData'

const MUSIC = {
  Autre: {
    label: 'Autre',
    nbResultsFacet: 1,
  },
  Blues: {
    label: 'Blues',
    nbResultsFacet: 0,
  },
  'Chansons / Variétés': {
    label: 'Chansons / Variétés',
    nbResultsFacet: 1,
  },
  Classique: {
    label: 'Classique',
    nbResultsFacet: 3,
  },
  Country: {
    label: 'Country',
    nbResultsFacet: 0,
  },
  Electro: {
    label: 'Electro',
    nbResultsFacet: 1,
  },
  Folk: {
    label: 'Folk',
    nbResultsFacet: 0,
  },
  Gospel: {
    label: 'Gospel',
    nbResultsFacet: 0,
  },
  'Hip-Hop/Rap': {
    label: 'Hip-Hop/Rap',
    nbResultsFacet: 15,
  },
  Jazz: {
    label: 'Jazz',
    nbResultsFacet: 6,
  },
  Metal: {
    label: 'Metal',
    nbResultsFacet: 1,
  },
  'Musique du Monde': {
    label: 'Musique du Monde',
    nbResultsFacet: 0,
  },
  Pop: {
    label: 'Pop',
    nbResultsFacet: 10,
  },
  Punk: {
    label: 'Punk',
    nbResultsFacet: 2,
  },
  Reggae: {
    label: 'Reggae',
    nbResultsFacet: 3,
  },
  Rock: {
    label: 'Rock',
    nbResultsFacet: 12,
  },
}
const MOVIES = {
  ACTION: {
    label: 'Action',
    nbResultsFacet: 0,
  },
  ANIMATION: {
    label: 'Animation',
    nbResultsFacet: 0,
  },
  MARTIAL_ARTS: {
    label: 'Arts martiaux',
    nbResultsFacet: 0,
  },
  ADVENTURE: {
    label: 'Aventure',
    nbResultsFacet: 0,
  },
  BIOPIC: {
    label: 'Biopic',
    nbResultsFacet: 0,
  },
  BOLLYWOOD: {
    label: 'Bollywood',
    nbResultsFacet: 0,
  },
  COMEDY: {
    label: 'Comédie',
    nbResultsFacet: 0,
  },
  COMEDY_DRAMA: {
    label: 'Comédie dramatique',
    nbResultsFacet: 0,
  },
  MUSICAL: {
    label: 'Comédie musicale',
    nbResultsFacet: 0,
  },
  CONCERT: {
    label: 'Concert',
    nbResultsFacet: 0,
  },
  DIVERS: {
    label: 'Divers',
    nbResultsFacet: 0,
  },
  DOCUMENTARY: {
    label: 'Documentaire',
    nbResultsFacet: 0,
  },
  DRAMA: {
    label: 'Drame',
    nbResultsFacet: 0,
  },
  KOREAN_DRAMA: {
    label: 'Drame coréen',
    nbResultsFacet: 0,
  },
  SPY: {
    label: 'Espionnage',
    nbResultsFacet: 0,
  },
  EXPERIMENTAL: {
    label: 'Expérimental',
    nbResultsFacet: 0,
  },
  FAMILY: {
    label: 'Familial',
    nbResultsFacet: 0,
  },
  FANTASY: {
    label: 'Fantastique',
    nbResultsFacet: 0,
  },
  WARMOVIE: {
    label: 'Guerre',
    nbResultsFacet: 0,
  },
  HISTORICAL: {
    label: 'Historique',
    nbResultsFacet: 0,
  },
  HISTORICAL_EPIC: {
    label: 'Historique-épique',
    nbResultsFacet: 0,
  },
  HORROR: {
    label: 'Horreur',
    nbResultsFacet: 0,
  },
  JUDICIAL: {
    label: 'Judiciaire',
    nbResultsFacet: 0,
  },
  MUSIC: {
    label: 'Musique',
    nbResultsFacet: 0,
  },
  OPERA: {
    label: 'Opéra',
    nbResultsFacet: 0,
  },
  PERFORMANCE: {
    label: 'Performance',
    nbResultsFacet: 0,
  },
  DETECTIVE: {
    label: 'Policier',
    nbResultsFacet: 0,
  },
  ROMANCE: {
    label: 'Romance',
    nbResultsFacet: 0,
  },
  SCIENCE_FICTION: {
    label: 'Science-fiction',
    nbResultsFacet: 0,
  },
  SPORT_EVENT: {
    label: 'Sport',
    nbResultsFacet: 0,
  },
  THRILLER: {
    label: 'Thriller',
    nbResultsFacet: 0,
  },
  WESTERN: {
    label: 'Western',
    nbResultsFacet: 0,
  },
  EROTIC: {
    label: 'Érotique',
    nbResultsFacet: 0,
  },
}
const BOOK = {
  Art: {
    label: 'Art',
    nbResultsFacet: 0,
  },
  'Arts Culinaires': {
    label: 'Arts Culinaires',
    nbResultsFacet: 0,
  },
  'Bandes dessinées': {
    label: 'Bandes dessinées',
    nbResultsFacet: 2,
  },
  'Carrière/Concours': {
    label: 'Carrière/Concours',
    nbResultsFacet: 0,
  },
  Droit: {
    label: 'Droit',
    nbResultsFacet: 1,
  },
  Economie: {
    label: 'Economie',
    nbResultsFacet: 0,
  },
  'Faits, temoignages': {
    label: 'Faits, temoignages',
    nbResultsFacet: 0,
  },
  'Gestion/entreprise': {
    label: 'Gestion/entreprise',
    nbResultsFacet: 1,
  },
  'Géographie, cartographie': {
    label: 'Géographie, cartographie',
    nbResultsFacet: 0,
  },
  Histoire: {
    label: 'Histoire',
    nbResultsFacet: 2,
  },
  Humour: {
    label: 'Humour',
    nbResultsFacet: 0,
  },
  Informatique: {
    label: 'Informatique',
    nbResultsFacet: 0,
  },
  Jeunesse: {
    label: 'Jeunesse',
    nbResultsFacet: 2,
  },
  Jeux: {
    label: 'Jeux',
    nbResultsFacet: 1,
  },
  Langue: {
    label: 'Langue',
    nbResultsFacet: 0,
  },
  'Littérature Etrangère': {
    label: 'Littérature Etrangère',
    nbResultsFacet: 0,
  },
  'Littérature Europééne': {
    label: 'Littérature Europééne',
    nbResultsFacet: 0,
  },
  'Littérature française': {
    label: 'Littérature française',
    nbResultsFacet: 6,
  },
  Loisirs: {
    label: 'Loisirs',
    nbResultsFacet: 7,
  },
  Manga: {
    label: 'Manga',
    nbResultsFacet: 3,
  },
  'Marketing et audio-visuel': {
    label: 'Marketing et audio-visuel',
    nbResultsFacet: 1,
  },
  Policier: {
    label: 'Policier',
    nbResultsFacet: 3,
  },
  'Poèsie, théâtre et spectacle': {
    label: 'Poèsie, théâtre et spectacle',
    nbResultsFacet: 1,
  },
  'Psychanalyse, psychologie': {
    label: 'Psychanalyse, psychologie',
    nbResultsFacet: 0,
  },
  'Religions, spiritualitées': {
    label: 'Religions, spiritualitées',
    nbResultsFacet: 5,
  },
  Santé: {
    label: 'Santé',
    nbResultsFacet: 0,
  },
  'Science-fiction, fantastique & terreur': {
    label: 'Science-fiction, fantastique & terreur',
    nbResultsFacet: 0,
  },
  'Sciences Humaines, Encyclopédie, dictionnaire': {
    label: 'Sciences Humaines, Encyclopédie, dictionnaire',
    nbResultsFacet: 0,
  },
  'Sciences, vie & Nature': {
    label: 'Sciences, vie & Nature',
    nbResultsFacet: 3,
  },
  'Scolaire & Parascolaire': {
    label: 'Scolaire & Parascolaire',
    nbResultsFacet: 1,
  },
  Sexualité: {
    label: 'Sexualité',
    nbResultsFacet: 0,
  },
  Sociologie: {
    label: 'Sociologie',
    nbResultsFacet: 0,
  },
  Sport: {
    label: 'Sport',
    nbResultsFacet: 1,
  },
  Tourisme: {
    label: 'Tourisme',
    nbResultsFacet: 1,
  },
  'Vie pratique': {
    label: 'Vie pratique',
    nbResultsFacet: 0,
  },
}
const SHOW = {
  'Arts de la rue': {
    label: 'Arts de la rue',
    nbResultsFacet: 0,
  },
  Autre: {
    label: 'Autre',
    nbResultsFacet: 0,
  },
  'Autre (spectacle sur glace, historique, aquatique, …)  ': {
    label: 'Autre (spectacle sur glace, historique, aquatique, …)  ',
    nbResultsFacet: 0,
  },
  Cirque: {
    label: 'Cirque',
    nbResultsFacet: 0,
  },
  Danse: {
    label: 'Danse',
    nbResultsFacet: 0,
  },
  'Humour / Café-théâtre': {
    label: 'Humour / Café-théâtre',
    nbResultsFacet: 0,
  },
  Opéra: {
    label: 'Opéra',
    nbResultsFacet: 0,
  },
  Pluridisciplinaire: {
    label: 'Pluridisciplinaire',
    nbResultsFacet: 0,
  },
  'Spectacle Jeunesse': {
    label: 'Spectacle Jeunesse',
    nbResultsFacet: 0,
  },
  'Spectacle Musical / Cabaret / Opérette': {
    label: 'Spectacle Musical / Cabaret / Opérette',
    nbResultsFacet: 0,
  },
  Théâtre: {
    label: 'Théâtre',
    nbResultsFacet: 0,
  },
}

describe('MappingTree', () => {
  it('createMappingTree should return correct tree', () => {
    const expectedResult = {
      // [SearchGroupNameEnumv2.NONE]: {
      //   label: 'Toutes les catégories',
      // },
      [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS]: {
        label: 'Arts & loisirs créatifs',
        children: {
          [NativeCategoryIdEnumv2.ARTS_VISUELS]: {
            label: 'Arts visuels',
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.MATERIELS_CREATIFS]: {
            label: 'Matériels créatifs',
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.PRATIQUE_ARTISTIQUE_EN_LIGNE]: {
            label: 'Pratique artistique en ligne',
            nbResultsFacet: 1,
          },
          [NativeCategoryIdEnumv2.PRATIQUES_ET_ATELIERS_ARTISTIQUES]: {
            label: 'Pratiques & ateliers artistiques',
            nbResultsFacet: 51,
          },
        },
      },
      [SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE]: {
        label: 'Bibliothèques, Médiathèques',
        children: {
          [NativeCategoryIdEnumv2.BIBLIOTHEQUE]: {
            label: 'Bibliothèque',
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.MEDIATHEQUE]: {
            label: 'Médiathèque',
            nbResultsFacet: 0,
          },
        },
      },
      [SearchGroupNameEnumv2.CARTES_JEUNES]: {
        children: undefined,
        label: 'Cartes jeunes',
      },
      [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE]: {
        label: 'CD, vinyles, musique en ligne',
        children: {
          [NativeCategoryIdEnumv2.CD]: {
            label: 'CD',
            genreTypeKey: GenreType.MUSIC,
            children: MUSIC,
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.VINYLES]: {
            label: 'Vinyles',
            genreTypeKey: GenreType.MUSIC,
            children: MUSIC,
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.MUSIQUE_EN_LIGNE]: {
            label: 'Musique en ligne',
            genreTypeKey: GenreType.MUSIC,
            children: MUSIC,
            nbResultsFacet: 10,
          },
        },
      },
      [SearchGroupNameEnumv2.CONCERTS_FESTIVALS]: {
        label: 'Concerts & festivals',
        children: {
          [NativeCategoryIdEnumv2.CONCERTS_EVENEMENTS]: {
            label: 'Concerts, évènements',
            genreTypeKey: GenreType.MUSIC,
            children: MUSIC,
            nbResultsFacet: 3,
          },
          [NativeCategoryIdEnumv2.FESTIVALS]: {
            label: 'Festivals',
            genreTypeKey: GenreType.MUSIC,
            children: MUSIC,
            nbResultsFacet: 0,
          },
        },
      },
      [SearchGroupNameEnumv2.RENCONTRES_CONFERENCES]: {
        label: 'Conférences & rencontres',
        children: {
          [NativeCategoryIdEnumv2.CONFERENCES]: {
            label: 'Conférences',
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.RENCONTRES]: {
            label: 'Rencontres',
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.RENCONTRES_EN_LIGNE]: {
            label: 'Rencontres en ligne',
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.SALONS_ET_METIERS]: {
            label: 'Salons & métiers',
            nbResultsFacet: 0,
          },
        },
      },
      [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE]: {
        label: 'Évènements en ligne',
        children: {
          [NativeCategoryIdEnumv2.CONCERTS_EN_LIGNE]: {
            label: 'Concerts en ligne',
            genreTypeKey: GenreType.MUSIC,
            children: MUSIC,
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.PRATIQUE_ARTISTIQUE_EN_LIGNE]: {
            label: 'Pratique artistique en ligne',
            nbResultsFacet: 1,
          },
          [NativeCategoryIdEnumv2.RENCONTRES_EN_LIGNE]: {
            label: 'Rencontres en ligne',
            nbResultsFacet: 0,
          },
        },
      },
      [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA]: {
        label: 'Films, séries, cinéma',
        children: {
          [NativeCategoryIdEnumv2.CARTES_CINEMA]: {
            label: 'Cartes cinéma',
            nbResultsFacet: 7,
          },
          [NativeCategoryIdEnumv2.DVD_BLU_RAY]: {
            label: 'DVD, Blu-Ray',
            nbResultsFacet: 54,
          },
          [NativeCategoryIdEnumv2.EVENEMENTS_CINEMA]: {
            label: 'Evènements cinéma',
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.FILMS_SERIES_EN_LIGNE]: {
            label: 'Films, séries en ligne',
            nbResultsFacet: 30,
          },
          [NativeCategoryIdEnumv2.SEANCES_DE_CINEMA]: {
            label: 'Séances de cinéma',
            genreTypeKey: GenreType.MOVIE,
            children: MOVIES,
            nbResultsFacet: 0,
          },
        },
      },
      [SearchGroupNameEnumv2.INSTRUMENTS]: {
        label: 'Instruments de musique',
        children: {
          [NativeCategoryIdEnumv2.ACHAT_LOCATION_INSTRUMENT]: {
            label: 'Achat & location d’instrument',
            nbResultsFacet: 64,
          },
          [NativeCategoryIdEnumv2.PARTITIONS_DE_MUSIQUE]: {
            label: 'Partitions de musique',
            nbResultsFacet: 0,
          },
        },
      },
      [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS]: {
        label: 'Jeux & jeux vidéos',
        children: {
          [NativeCategoryIdEnumv2.CONCOURS]: {
            label: 'Concours',
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.ESCAPE_GAMES]: {
            label: 'Escape games',
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.JEUX_EN_LIGNE]: {
            label: 'Jeux en ligne',
            nbResultsFacet: 11,
          },
          [NativeCategoryIdEnumv2.LUDOTHEQUE]: {
            label: 'Ludothèque',
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.RENCONTRES_EVENEMENTS]: {
            label: 'Rencontres évènements',
            nbResultsFacet: 0,
          },
        },
      },
      [SearchGroupNameEnumv2.LIVRES]: {
        label: 'Livres',
        children: {
          [NativeCategoryIdEnumv2.FESTIVAL_DU_LIVRE]: {
            label: 'Festivals du livre',
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.LIVRES_AUDIO_PHYSIQUES]: {
            label: 'Livres audio physiques',
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.LIVRES_NUMERIQUE_ET_AUDIO]: {
            label: 'Livres numérique & audio',
            nbResultsFacet: 23,
          },
          [NativeCategoryIdEnumv2.LIVRES_PAPIER]: {
            label: 'Livres papier',
            genreTypeKey: GenreType.BOOK,
            children: BOOK,
            nbResultsFacet: 4494,
          },
        },
      },
      [SearchGroupNameEnumv2.MEDIA_PRESSE]: {
        label: 'Médias & presse',
        children: {
          [NativeCategoryIdEnumv2.AUTRES_MEDIAS]: {
            label: 'Autres médias',
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.PODCAST]: {
            label: 'Podcast',
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.PRESSE_EN_LIGNE]: {
            label: 'Presse en ligne',
            nbResultsFacet: 6,
          },
        },
      },
      [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES]: {
        label: 'Musées & visites culturelles',
        children: {
          [NativeCategoryIdEnumv2.ABONNEMENTS_MUSEE]: {
            label: 'Abonnements musée',
            nbResultsFacet: 55,
          },
          [NativeCategoryIdEnumv2.ARTS_VISUELS]: {
            label: 'Arts visuels',
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.EVENEMENTS_PATRIMOINE]: {
            label: 'Evènements patrimoine',
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.VISITES_CULTURELLES]: {
            label: 'Visites culturelles',
            nbResultsFacet: 5,
          },
          [NativeCategoryIdEnumv2.VISITES_CULTURELLES_EN_LIGNE]: {
            label: 'Visites culturelles en ligne',
            nbResultsFacet: 0,
          },
        },
      },
      [SearchGroupNameEnumv2.SPECTACLES]: {
        label: 'Spectacles',
        children: {
          [NativeCategoryIdEnumv2.ABONNEMENTS_SPECTACLE]: {
            label: 'Abonnements spectacle',
            genreTypeKey: GenreType.SHOW,
            children: SHOW,
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.SPECTACLES_REPRESENTATIONS]: {
            label: 'Spectacles & représentations',
            genreTypeKey: GenreType.SHOW,
            children: SHOW,
            nbResultsFacet: 0,
          },
          [NativeCategoryIdEnumv2.SPECTACLES_ENREGISTRES]: {
            label: 'Spectacles enregistrés',
            genreTypeKey: GenreType.SHOW,
            children: SHOW,
            nbResultsFacet: 0,
          },
        },
      },
    }

    expect(createMappingTree(placeholderData, mockedFacets.facets as FacetData)).toEqual(
      expectedResult
    )
  })
})
