import { SearchGroupNameEnum, VenueTypeCode } from 'api/gen'
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
  [category in SearchGroupNameEnum]: {
    icon: React.FC<BicolorIconInterface>
    facetFilter: SearchGroupNameEnum
  }
}

export const CATEGORY_CRITERIA: CategoryCriteria = {
  [SearchGroupNameEnum.NONE]: {
    icon: CategoryIcon.All,
    facetFilter: SearchGroupNameEnum.NONE,
  },
  [SearchGroupNameEnum.CINEMA]: {
    icon: CategoryIcon.Cinema,
    facetFilter: SearchGroupNameEnum.CINEMA,
  },
  [SearchGroupNameEnum.VISITE]: {
    icon: CategoryIcon.Exposition,
    facetFilter: SearchGroupNameEnum.VISITE,
  },
  [SearchGroupNameEnum.MUSIQUE]: {
    icon: CategoryIcon.Musique,
    facetFilter: SearchGroupNameEnum.MUSIQUE,
  },
  [SearchGroupNameEnum.SPECTACLE]: {
    icon: CategoryIcon.Spectacles,
    facetFilter: SearchGroupNameEnum.SPECTACLE,
  },
  [SearchGroupNameEnum.COURS]: {
    icon: CategoryIcon.Atelier,
    facetFilter: SearchGroupNameEnum.COURS,
  },
  [SearchGroupNameEnum.LIVRE]: {
    icon: CategoryIcon.Livres,
    facetFilter: SearchGroupNameEnum.LIVRE,
  },
  [SearchGroupNameEnum.FILM]: {
    icon: CategoryIcon.Streaming,
    facetFilter: SearchGroupNameEnum.FILM,
  },
  [SearchGroupNameEnum.PRESSE]: {
    icon: CategoryIcon.Presse,
    facetFilter: SearchGroupNameEnum.PRESSE,
  },
  [SearchGroupNameEnum.JEU]: {
    icon: CategoryIcon.JeuxVideo,
    facetFilter: SearchGroupNameEnum.JEU,
  },
  [SearchGroupNameEnum.CONFERENCE]: {
    icon: CategoryIcon.Conference,
    facetFilter: SearchGroupNameEnum.CONFERENCE,
  },
  [SearchGroupNameEnum.INSTRUMENT]: {
    icon: CategoryIcon.Instrument,
    facetFilter: SearchGroupNameEnum.INSTRUMENT,
  },
  [SearchGroupNameEnum.MATERIEL]: {
    icon: CategoryIcon.ArtsMaterial,
    facetFilter: SearchGroupNameEnum.MATERIEL,
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
