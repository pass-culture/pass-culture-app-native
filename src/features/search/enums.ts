import { SearchGroupNameEnum, VenueTypeCodeKey } from 'api/gen'
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
  [venueType in VenueTypeCodeKey]: { label: string; facetFilter: VenueTypeCodeKey }
}

export type OptionalVenueTypeCriteria = Pick<VenueTypeCriteria, 'ALL'> & {
  [venueType in VenueTypeCodeKey]?: { label: string; facetFilter: VenueTypeCodeKey }
}

export const VENUE_TYPE_CRITERIA: VenueTypeCriteria = {
  ALL: {
    label: 'Tous les types de lieu',
    facetFilter: '',
  },
  [VenueTypeCodeKey.ARTISTICCOURSE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.ARTISTICCOURSE],
    facetFilter: VenueTypeCodeKey.ARTISTICCOURSE,
  },
  [VenueTypeCodeKey.BOOKSTORE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.BOOKSTORE],
    facetFilter: VenueTypeCodeKey.BOOKSTORE,
  },
  [VenueTypeCodeKey.CONCERTHALL]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.CONCERTHALL],
    facetFilter: VenueTypeCodeKey.CONCERTHALL,
  },
  [VenueTypeCodeKey.CREATIVEARTSSTORE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.CREATIVEARTSSTORE],
    facetFilter: VenueTypeCodeKey.CREATIVEARTSSTORE,
  },
  [VenueTypeCodeKey.CULTURALCENTRE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.CULTURALCENTRE],
    facetFilter: VenueTypeCodeKey.CULTURALCENTRE,
  },
  [VenueTypeCodeKey.DIGITAL]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.DIGITAL],
    facetFilter: VenueTypeCodeKey.DIGITAL,
  },
  [VenueTypeCodeKey.FESTIVAL]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.FESTIVAL],
    facetFilter: VenueTypeCodeKey.FESTIVAL,
  },
  [VenueTypeCodeKey.GAMES]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.GAMES],
    facetFilter: VenueTypeCodeKey.GAMES,
  },
  [VenueTypeCodeKey.LIBRARY]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.LIBRARY],
    facetFilter: VenueTypeCodeKey.LIBRARY,
  },
  [VenueTypeCodeKey.MUSEUM]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.MUSEUM],
    facetFilter: VenueTypeCodeKey.MUSEUM,
  },
  [VenueTypeCodeKey.MUSICALINSTRUMENTSTORE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.MUSICALINSTRUMENTSTORE],
    facetFilter: VenueTypeCodeKey.MUSICALINSTRUMENTSTORE,
  },
  [VenueTypeCodeKey.MOVIE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.MOVIE],
    facetFilter: VenueTypeCodeKey.MOVIE,
  },
  [VenueTypeCodeKey.OTHER]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.OTHER],
    facetFilter: VenueTypeCodeKey.OTHER,
  },
  [VenueTypeCodeKey.PATRIMONYTOURISM]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.PATRIMONYTOURISM],
    facetFilter: VenueTypeCodeKey.PATRIMONYTOURISM,
  },
  [VenueTypeCodeKey.PERFORMINGARTS]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.PERFORMINGARTS],
    facetFilter: VenueTypeCodeKey.PERFORMINGARTS,
  },
  [VenueTypeCodeKey.RECORDSTORE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.RECORDSTORE],
    facetFilter: VenueTypeCodeKey.RECORDSTORE,
  },
  [VenueTypeCodeKey.SCIENTIFICCULTURE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.SCIENTIFICCULTURE],
    facetFilter: VenueTypeCodeKey.SCIENTIFICCULTURE,
  },
  [VenueTypeCodeKey.VISUALARTS]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.VISUALARTS],
    facetFilter: VenueTypeCodeKey.VISUALARTS,
  },
}
