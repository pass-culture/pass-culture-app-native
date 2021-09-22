import { CategoryIdEnum, VenueTypeCode } from 'api/gen'
import { MAP_VENUE_TYPE_TO_LABEL } from 'libs/parsers'
import CategoryIcon from 'ui/svg/icons/categories/bicolor'
import { BicolorIconInterface } from 'ui/svg/icons/types'

export enum DATE_FILTER_OPTIONS {
  TODAY = 'today',
  CURRENT_WEEK = 'currentWeek',
  CURRENT_WEEK_END = 'currentWeekEnd',
  USER_PICK = 'picked',
}

export enum LocationType {
  AROUND_ME = 'AROUND_ME',
  EVERYWHERE = 'EVERYWHERE',
  PLACE = 'PLACE',
  VENUE = 'VENUE',
}

export type CategoryCriteria = {
  ALL: {
    label: string
    icon: React.FC<BicolorIconInterface>
    facetFilter: ''
  }
} & {
  [category in CategoryIdEnum]: {
    label: string
    icon: React.FC<BicolorIconInterface>
    facetFilter: CategoryIdEnum
  }
}

export type OptionalCategoryCriteria = Pick<CategoryCriteria, 'ALL'> &
  {
    [category in CategoryIdEnum]?: {
      label: string
      icon: React.FC<BicolorIconInterface>
      facetFilter: CategoryIdEnum
    }
  }

export const CATEGORY_CRITERIA: CategoryCriteria = {
  ALL: {
    label: 'Toutes les catégories',
    icon: CategoryIcon.All,
    facetFilter: '',
  },
  [CategoryIdEnum.CINEMA]: {
    label: 'Cinéma',
    icon: CategoryIcon.Cinema,
    facetFilter: CategoryIdEnum.CINEMA,
  },
  [CategoryIdEnum.VISITE]: {
    label: 'Visites, expositions',
    icon: CategoryIcon.Exposition,
    facetFilter: CategoryIdEnum.VISITE,
  },
  [CategoryIdEnum.MUSIQUE]: {
    label: 'Musique',
    icon: CategoryIcon.Musique,
    facetFilter: CategoryIdEnum.MUSIQUE,
  },
  [CategoryIdEnum.SPECTACLE]: {
    label: 'Spectacles',
    icon: CategoryIcon.Spectacles,
    facetFilter: CategoryIdEnum.SPECTACLE,
  },
  [CategoryIdEnum.LECON]: {
    label: 'Cours, ateliers',
    icon: CategoryIcon.Atelier,
    facetFilter: CategoryIdEnum.LECON,
  },
  [CategoryIdEnum.LIVRE]: {
    label: 'Livres',
    icon: CategoryIcon.Livres,
    facetFilter: CategoryIdEnum.LIVRE,
  },
  [CategoryIdEnum.FILM]: {
    label: 'Films, séries, podcasts',
    icon: CategoryIcon.Streaming,
    facetFilter: CategoryIdEnum.FILM,
  },
  [CategoryIdEnum.MEDIA]: {
    label: 'Presse',
    icon: CategoryIcon.Presse,
    facetFilter: CategoryIdEnum.MEDIA,
  },
  [CategoryIdEnum.JEUXVIDEO]: {
    label: 'Jeux vidéos',
    icon: CategoryIcon.JeuxVideo,
    facetFilter: CategoryIdEnum.JEUXVIDEO,
  },
  [CategoryIdEnum.CONFERENCE]: {
    label: 'Conférences, rencontres',
    icon: CategoryIcon.Conference,
    facetFilter: CategoryIdEnum.CONFERENCE,
  },
  [CategoryIdEnum.INSTRUMENT]: {
    label: 'Instruments de musique',
    icon: CategoryIcon.Instrument,
    facetFilter: CategoryIdEnum.INSTRUMENT,
  },
  [CategoryIdEnum.MATERIELARTCREA]: {
    label: 'Matériel arts créatifs',
    icon: CategoryIcon.ArtsMaterial,
    facetFilter: CategoryIdEnum.MATERIELARTCREA,
  },
}

export type VenueTypeCriteria = { ALL: { label: string; facetFilter: '' } } & {
  [venueType in VenueTypeCode]: { label: string; facetFilter: VenueTypeCode }
}

export type OptionalVenueTypeCriteria = Pick<VenueTypeCriteria, 'ALL'> &
  {
    [venueType in VenueTypeCode]?: { label: string; facetFilter: VenueTypeCode }
  }

export const VENUE_TYPE_CRITERIA: VenueTypeCriteria = {
  ALL: {
    label: 'Tous les types de lieu',
    facetFilter: '',
  },
  [VenueTypeCode.ARTISTICCOURSE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.ARTISTICCOURSE],
    facetFilter: VenueTypeCode.ARTISTICCOURSE,
  },
  [VenueTypeCode.BOOKSTORE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.BOOKSTORE],
    facetFilter: VenueTypeCode.BOOKSTORE,
  },
  [VenueTypeCode.CONCERTHALL]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.CONCERTHALL],
    facetFilter: VenueTypeCode.CONCERTHALL,
  },
  [VenueTypeCode.CREATIVEARTSSTORE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.CREATIVEARTSSTORE],
    facetFilter: VenueTypeCode.CREATIVEARTSSTORE,
  },
  [VenueTypeCode.CULTURALCENTRE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.CULTURALCENTRE],
    facetFilter: VenueTypeCode.CULTURALCENTRE,
  },
  [VenueTypeCode.DIGITAL]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.DIGITAL],
    facetFilter: VenueTypeCode.DIGITAL,
  },
  [VenueTypeCode.FESTIVAL]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.FESTIVAL],
    facetFilter: VenueTypeCode.FESTIVAL,
  },
  [VenueTypeCode.GAMES]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.GAMES],
    facetFilter: VenueTypeCode.GAMES,
  },
  [VenueTypeCode.LIBRARY]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.LIBRARY],
    facetFilter: VenueTypeCode.LIBRARY,
  },
  [VenueTypeCode.MUSEUM]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.MUSEUM],
    facetFilter: VenueTypeCode.MUSEUM,
  },
  [VenueTypeCode.MUSICALINSTRUMENTSTORE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.MUSICALINSTRUMENTSTORE],
    facetFilter: VenueTypeCode.MUSICALINSTRUMENTSTORE,
  },
  [VenueTypeCode.MOVIE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.MOVIE],
    facetFilter: VenueTypeCode.MOVIE,
  },
  [VenueTypeCode.OTHER]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.OTHER],
    facetFilter: VenueTypeCode.OTHER,
  },
  [VenueTypeCode.PATRIMONYTOURISM]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.PATRIMONYTOURISM],
    facetFilter: VenueTypeCode.PATRIMONYTOURISM,
  },
  [VenueTypeCode.PERFORMINGARTS]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.PERFORMINGARTS],
    facetFilter: VenueTypeCode.PERFORMINGARTS,
  },
  [VenueTypeCode.RECORDSTORE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.RECORDSTORE],
    facetFilter: VenueTypeCode.RECORDSTORE,
  },
  [VenueTypeCode.SCIENTIFICCULTURE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.SCIENTIFICCULTURE],
    facetFilter: VenueTypeCode.SCIENTIFICCULTURE,
  },
  [VenueTypeCode.VISUALARTS]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCode.VISUALARTS],
    facetFilter: VenueTypeCode.VISUALARTS,
  },
}
