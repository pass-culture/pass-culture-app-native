import { GenreType, NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { createMappingTree } from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { placeholderData } from 'libs/subcategories/placeholderData'

const MUSIC = {
  Autre: {
    label: 'Autre',
  },
  Blues: {
    label: 'Blues',
  },
  'Chansons / Variétés': {
    label: 'Chansons / Variétés',
  },
  Classique: {
    label: 'Classique',
  },
  Country: {
    label: 'Country',
  },
  Electro: {
    label: 'Electro',
  },
  Folk: {
    label: 'Folk',
  },
  Gospel: {
    label: 'Gospel',
  },
  'Hip-Hop/Rap': {
    label: 'Hip-Hop/Rap',
  },
  Jazz: {
    label: 'Jazz',
  },
  Metal: {
    label: 'Metal',
  },
  'Musique du Monde': {
    label: 'Musique du Monde',
  },
  Pop: {
    label: 'Pop',
  },
  Punk: {
    label: 'Punk',
  },
  Reggae: {
    label: 'Reggae',
  },
  Rock: {
    label: 'Rock',
  },
}
const MOVIES = {
  ACTION: {
    label: 'Action',
  },
  ANIMATION: {
    label: 'Animation',
  },
  MARTIAL_ARTS: {
    label: 'Arts martiaux',
  },
  ADVENTURE: {
    label: 'Aventure',
  },
  BIOPIC: {
    label: 'Biopic',
  },
  BOLLYWOOD: {
    label: 'Bollywood',
  },
  COMEDY: {
    label: 'Comédie',
  },
  COMEDY_DRAMA: {
    label: 'Comédie dramatique',
  },
  MUSICAL: {
    label: 'Comédie musicale',
  },
  CONCERT: {
    label: 'Concert',
  },
  DIVERS: {
    label: 'Divers',
  },
  DOCUMENTARY: {
    label: 'Documentaire',
  },
  DRAMA: {
    label: 'Drame',
  },
  KOREAN_DRAMA: {
    label: 'Drame coréen',
  },
  SPY: {
    label: 'Espionnage',
  },
  EXPERIMENTAL: {
    label: 'Expérimental',
  },
  FAMILY: {
    label: 'Familial',
  },
  FANTASY: {
    label: 'Fantastique',
  },
  WARMOVIE: {
    label: 'Guerre',
  },
  HISTORICAL: {
    label: 'Historique',
  },
  HISTORICAL_EPIC: {
    label: 'Historique-épique',
  },
  HORROR: {
    label: 'Horreur',
  },
  JUDICIAL: {
    label: 'Judiciaire',
  },
  MUSIC: {
    label: 'Musique',
  },
  OPERA: {
    label: 'Opéra',
  },
  PERFORMANCE: {
    label: 'Performance',
  },
  DETECTIVE: {
    label: 'Policier',
  },
  ROMANCE: {
    label: 'Romance',
  },
  SCIENCE_FICTION: {
    label: 'Science-fiction',
  },
  SPORT_EVENT: {
    label: 'Sport',
  },
  THRILLER: {
    label: 'Thriller',
  },
  WESTERN: {
    label: 'Western',
  },
  EROTIC: {
    label: 'Érotique',
  },
}
const BOOK = {
  Art: {
    label: 'Art',
  },
  'Arts Culinaires': {
    label: 'Arts Culinaires',
  },
  'Bandes dessinées': {
    label: 'Bandes dessinées',
  },
  'Carrière/Concours': {
    label: 'Carrière/Concours',
  },
  Droit: {
    label: 'Droit',
  },
  Economie: {
    label: 'Economie',
  },
  'Faits, temoignages': {
    label: 'Faits, temoignages',
  },
  'Gestion/entreprise': {
    label: 'Gestion/entreprise',
  },
  'Géographie, cartographie': {
    label: 'Géographie, cartographie',
  },
  Histoire: {
    label: 'Histoire',
  },
  Humour: {
    label: 'Humour',
  },
  Informatique: {
    label: 'Informatique',
  },
  Jeunesse: {
    label: 'Jeunesse',
  },
  Jeux: {
    label: 'Jeux',
  },
  Langue: {
    label: 'Langue',
  },
  'Littérature Etrangère': {
    label: 'Littérature Etrangère',
  },
  'Littérature Europééne': {
    label: 'Littérature Europééne',
  },
  'Littérature française': {
    label: 'Littérature française',
  },
  Loisirs: {
    label: 'Loisirs',
  },
  Manga: {
    label: 'Manga',
  },
  'Marketing et audio-visuel': {
    label: 'Marketing et audio-visuel',
  },
  Policier: {
    label: 'Policier',
  },
  'Poèsie, théâtre et spectacle': {
    label: 'Poèsie, théâtre et spectacle',
  },
  'Psychanalyse, psychologie': {
    label: 'Psychanalyse, psychologie',
  },
  'Religions, spiritualitées': {
    label: 'Religions, spiritualitées',
  },
  Santé: {
    label: 'Santé',
  },
  'Science-fiction, fantastique & terreur': {
    label: 'Science-fiction, fantastique & terreur',
  },
  'Sciences Humaines, Encyclopédie, dictionnaire': {
    label: 'Sciences Humaines, Encyclopédie, dictionnaire',
  },
  'Sciences, vie & Nature': {
    label: 'Sciences, vie & Nature',
  },
  'Scolaire & Parascolaire': {
    label: 'Scolaire & Parascolaire',
  },
  Sexualité: {
    label: 'Sexualité',
  },
  Sociologie: {
    label: 'Sociologie',
  },
  Sport: {
    label: 'Sport',
  },
  Tourisme: {
    label: 'Tourisme',
  },
  'Vie pratique': {
    label: 'Vie pratique',
  },
}
const SHOW = {
  'Arts de la rue': {
    label: 'Arts de la rue',
  },
  Autre: {
    label: 'Autre',
  },
  'Autre (spectacle sur glace, historique, aquatique, …)  ': {
    label: 'Autre (spectacle sur glace, historique, aquatique, …)  ',
  },
  Cirque: {
    label: 'Cirque',
  },
  Danse: {
    label: 'Danse',
  },
  'Humour / Café-théâtre': {
    label: 'Humour / Café-théâtre',
  },
  Opéra: {
    label: 'Opéra',
  },
  Pluridisciplinaire: {
    label: 'Pluridisciplinaire',
  },
  'Spectacle Jeunesse': {
    label: 'Spectacle Jeunesse',
  },
  'Spectacle Musical / Cabaret / Opérette': {
    label: 'Spectacle Musical / Cabaret / Opérette',
  },
  Théâtre: {
    label: 'Théâtre',
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
          },
          [NativeCategoryIdEnumv2.MATERIELS_CREATIFS]: {
            label: 'Matériels créatifs',
          },
          [NativeCategoryIdEnumv2.PRATIQUE_ARTISTIQUE_EN_LIGNE]: {
            label: 'Pratique artistique en ligne',
          },
          [NativeCategoryIdEnumv2.PRATIQUES_ET_ATELIERS_ARTISTIQUES]: {
            label: 'Pratiques & ateliers artistiques',
          },
        },
      },
      [SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE]: {
        label: 'Bibliothèques, Médiathèques',
        children: {
          [NativeCategoryIdEnumv2.BIBLIOTHEQUE]: {
            label: 'Bibliothèque',
          },
          [NativeCategoryIdEnumv2.MEDIATHEQUE]: {
            label: 'Médiathèque',
          },
        },
      },
      [SearchGroupNameEnumv2.CARTES_JEUNES]: {
        label: 'Cartes jeunes',
      },
      [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE]: {
        label: 'CD, vinyles, musique en ligne',
        children: {
          [NativeCategoryIdEnumv2.CD_VINYLES]: {
            label: 'CD, vinyles',
            genreTypeKey: GenreType.MUSIC,
            children: MUSIC,
          },
          [NativeCategoryIdEnumv2.MUSIQUE_EN_LIGNE]: {
            label: 'Musique en ligne',
            genreTypeKey: GenreType.MUSIC,
            children: MUSIC,
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
          },
          [NativeCategoryIdEnumv2.FESTIVALS]: {
            label: 'Festivals',
            genreTypeKey: GenreType.MUSIC,
            children: MUSIC,
          },
        },
      },
      [SearchGroupNameEnumv2.RENCONTRES_CONFERENCES]: {
        label: 'Conférences & rencontres',
        children: {
          [NativeCategoryIdEnumv2.CONFERENCES]: {
            label: 'Conférences',
          },
          [NativeCategoryIdEnumv2.RENCONTRES]: {
            label: 'Rencontres',
          },
          [NativeCategoryIdEnumv2.RENCONTRES_EN_LIGNE]: {
            label: 'Rencontres en ligne',
          },
          [NativeCategoryIdEnumv2.SALONS_ET_METIERS]: {
            label: 'Salons & métiers',
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
          },
          [NativeCategoryIdEnumv2.PRATIQUE_ARTISTIQUE_EN_LIGNE]: {
            label: 'Pratique artistique en ligne',
          },
          [NativeCategoryIdEnumv2.RENCONTRES_EN_LIGNE]: {
            label: 'Rencontres en ligne',
          },
        },
      },
      [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA]: {
        label: 'Films, séries, cinéma',
        children: {
          [NativeCategoryIdEnumv2.CARTES_CINEMA]: {
            label: 'Cartes cinéma',
          },
          [NativeCategoryIdEnumv2.DVD_BLU_RAY]: {
            label: 'DVD, Blu-Ray',
          },
          [NativeCategoryIdEnumv2.EVENEMENTS_CINEMA]: {
            label: 'Evènements cinéma',
          },
          [NativeCategoryIdEnumv2.FILMS_SERIES_EN_LIGNE]: {
            label: 'Films, séries en ligne',
          },
          [NativeCategoryIdEnumv2.SEANCES_DE_CINEMA]: {
            label: 'Séances de cinéma',
            genreTypeKey: GenreType.MOVIE,
            children: MOVIES,
          },
        },
      },
      [SearchGroupNameEnumv2.INSTRUMENTS]: {
        label: 'Instruments de musique',
        children: {
          [NativeCategoryIdEnumv2.ACHAT_LOCATION_INSTRUMENT]: {
            label: "Achat & location d'instrument",
          },
          [NativeCategoryIdEnumv2.PARTITIONS_DE_MUSIQUE]: {
            label: 'Partitions de musique',
          },
        },
      },
      [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS]: {
        label: 'Jeux & jeux vidéos',
        children: {
          [NativeCategoryIdEnumv2.CONCOURS]: {
            label: 'Concours',
          },
          [NativeCategoryIdEnumv2.ESCAPE_GAMES]: {
            label: 'Escape games',
          },
          [NativeCategoryIdEnumv2.JEUX_EN_LIGNE]: {
            label: 'Jeux en ligne',
          },
          [NativeCategoryIdEnumv2.LUDOTHEQUE]: {
            label: 'Ludothèque',
          },
          [NativeCategoryIdEnumv2.RENCONTRES_EVENEMENTS]: {
            label: 'Rencontres évènements',
          },
        },
      },
      [SearchGroupNameEnumv2.LIVRES]: {
        label: 'Livres',
        children: {
          [NativeCategoryIdEnumv2.FESTIVAL_DU_LIVRE]: {
            label: 'Festivals du livre',
          },
          [NativeCategoryIdEnumv2.LIVRES_AUDIO_PHYSIQUES]: {
            label: 'Livres audio physiques',
          },
          [NativeCategoryIdEnumv2.LIVRES_NUMERIQUE_ET_AUDIO]: {
            label: 'Livres numérique & audio',
          },
          [NativeCategoryIdEnumv2.LIVRES_PAPIER]: {
            label: 'Livres papier',
            genreTypeKey: GenreType.BOOK,
            children: BOOK,
          },
        },
      },
      [SearchGroupNameEnumv2.MEDIA_PRESSE]: {
        label: 'Médias & presse',
        children: {
          [NativeCategoryIdEnumv2.AUTRES_MEDIAS]: {
            label: 'Autres médias',
          },
          [NativeCategoryIdEnumv2.PODCAST]: {
            label: 'Podcast',
          },
          [NativeCategoryIdEnumv2.PRESSE_EN_LIGNE]: {
            label: 'Presse en ligne',
          },
        },
      },
      [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES]: {
        label: 'Musées & visites culturelles',
        children: {
          [NativeCategoryIdEnumv2.ABONNEMENTS_MUSEE]: {
            label: 'Abonnements musée',
          },
          [NativeCategoryIdEnumv2.ARTS_VISUELS]: {
            label: 'Arts visuels',
          },
          [NativeCategoryIdEnumv2.EVENEMENTS_PATRIMOINE]: {
            label: 'Evènements patrimoine',
          },
          [NativeCategoryIdEnumv2.VISITES_CULTURELLES]: {
            label: 'Visites culturelles',
          },
          [NativeCategoryIdEnumv2.VISITES_CULTURELLES_EN_LIGNE]: {
            label: 'Visites culturelles en ligne',
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
          },
          [NativeCategoryIdEnumv2.SPECTACLES_REPRESENTATIONS]: {
            label: 'Spectacles & représentations',
            genreTypeKey: GenreType.SHOW,
            children: SHOW,
          },
          [NativeCategoryIdEnumv2.SPECTACLES_ENREGISTRES]: {
            label: 'Spectacles enregistrés',
            genreTypeKey: GenreType.SHOW,
            children: SHOW,
          },
        },
      },
    }

    expect(createMappingTree(placeholderData)).toEqual(expectedResult)
  })
})
