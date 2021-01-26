import { CategoryNameEnum } from 'api/gen'
import CategoryIcon from 'ui/svg/icons/categories/bicolor'
import { BicolorIconInterface } from 'ui/svg/icons/types'

type CategoryCriteria = {
  ALL: {
    label: string
    icon: React.FC<BicolorIconInterface>
    facetFilter: ''
  }
} & {
  [category in CategoryNameEnum]: {
    label: string
    icon: React.FC<BicolorIconInterface>
    facetFilter: CategoryNameEnum
  }
}

export const CATEGORY_CRITERIA: CategoryCriteria = {
  ALL: {
    label: 'Toutes les catégories',
    icon: CategoryIcon.All,
    facetFilter: '',
  },
  [CategoryNameEnum.CINEMA]: {
    label: 'Cinéma',
    icon: CategoryIcon.Cinema,
    facetFilter: CategoryNameEnum.CINEMA,
  },
  [CategoryNameEnum.VISITE]: {
    label: 'Visites, expositions',
    icon: CategoryIcon.Exposition,
    facetFilter: CategoryNameEnum.VISITE,
  },
  [CategoryNameEnum.MUSIQUE]: {
    label: 'Musique',
    icon: CategoryIcon.Musique,
    facetFilter: CategoryNameEnum.MUSIQUE,
  },
  [CategoryNameEnum.SPECTACLE]: {
    label: 'Spectacles',
    icon: CategoryIcon.Spectacles,
    facetFilter: CategoryNameEnum.SPECTACLE,
  },
  [CategoryNameEnum.LECON]: {
    label: 'Cours, ateliers',
    icon: CategoryIcon.Atelier,
    facetFilter: CategoryNameEnum.LECON,
  },
  [CategoryNameEnum.LIVRE]: {
    label: 'Livres',
    icon: CategoryIcon.Livres,
    facetFilter: CategoryNameEnum.LIVRE,
  },
  [CategoryNameEnum.FILM]: {
    label: 'Films, séries, podcasts',
    icon: CategoryIcon.Streaming,
    facetFilter: CategoryNameEnum.FILM,
  },
  [CategoryNameEnum.PRESSE]: {
    label: 'Presse',
    icon: CategoryIcon.Presse,
    facetFilter: CategoryNameEnum.PRESSE,
  },
  [CategoryNameEnum.JEUXVIDEO]: {
    label: 'Jeux vidéos',
    icon: CategoryIcon.JeuxVideo,
    facetFilter: CategoryNameEnum.JEUXVIDEO,
  },
  [CategoryNameEnum.CONFERENCE]: {
    label: 'Conférences, rencontres',
    icon: CategoryIcon.Conference,
    facetFilter: CategoryNameEnum.CONFERENCE,
  },
  [CategoryNameEnum.INSTRUMENT]: {
    label: 'Instruments de musique',
    icon: CategoryIcon.Instrument,
    facetFilter: CategoryNameEnum.INSTRUMENT,
  },
}
