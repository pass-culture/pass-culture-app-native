import { SearchGroupNameEnum, VenueTypeCodeKey } from 'api/gen'
import { MAP_VENUE_TYPE_TO_LABEL, VenueTypeCode } from 'libs/parsers'
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

type CategoryCriteria = {
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
  [SearchGroupNameEnum.CARTE_JEUNES]: {
    icon: CategoryIcon.CarteJeunes,
    facetFilter: SearchGroupNameEnum.CARTE_JEUNES,
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

type VenueTypeCriteria = { ALL: { label: string; facetFilter: '' } } & {
  [venueType in VenueTypeCode]: { label: string; facetFilter: VenueTypeCode }
}

export const VENUE_TYPE_CRITERIA: VenueTypeCriteria = {
  ALL: {
    label: 'Tous les types de lieu',
    facetFilter: '',
  },
  [VenueTypeCodeKey.ARTISTIC_COURSE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.ARTISTIC_COURSE],
    facetFilter: VenueTypeCodeKey.ARTISTIC_COURSE,
  },
  [VenueTypeCodeKey.BOOKSTORE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.BOOKSTORE],
    facetFilter: VenueTypeCodeKey.BOOKSTORE,
  },
  [VenueTypeCodeKey.CONCERT_HALL]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.CONCERT_HALL],
    facetFilter: VenueTypeCodeKey.CONCERT_HALL,
  },
  [VenueTypeCodeKey.CREATIVE_ARTS_STORE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.CREATIVE_ARTS_STORE],
    facetFilter: VenueTypeCodeKey.CREATIVE_ARTS_STORE,
  },
  [VenueTypeCodeKey.CULTURAL_CENTRE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.CULTURAL_CENTRE],
    facetFilter: VenueTypeCodeKey.CULTURAL_CENTRE,
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
  [VenueTypeCodeKey.MUSICAL_INSTRUMENT_STORE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.MUSICAL_INSTRUMENT_STORE],
    facetFilter: VenueTypeCodeKey.MUSICAL_INSTRUMENT_STORE,
  },
  [VenueTypeCodeKey.MOVIE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.MOVIE],
    facetFilter: VenueTypeCodeKey.MOVIE,
  },
  [VenueTypeCodeKey.OTHER]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.OTHER],
    facetFilter: VenueTypeCodeKey.OTHER,
  },
  [VenueTypeCodeKey.PATRIMONY_TOURISM]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.PATRIMONY_TOURISM],
    facetFilter: VenueTypeCodeKey.PATRIMONY_TOURISM,
  },
  [VenueTypeCodeKey.PERFORMING_ARTS]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.PERFORMING_ARTS],
    facetFilter: VenueTypeCodeKey.PERFORMING_ARTS,
  },
  [VenueTypeCodeKey.RECORD_STORE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.RECORD_STORE],
    facetFilter: VenueTypeCodeKey.RECORD_STORE,
  },
  [VenueTypeCodeKey.SCIENTIFIC_CULTURE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.SCIENTIFIC_CULTURE],
    facetFilter: VenueTypeCodeKey.SCIENTIFIC_CULTURE,
  },
  [VenueTypeCodeKey.VISUAL_ARTS]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.VISUAL_ARTS],
    facetFilter: VenueTypeCodeKey.VISUAL_ARTS,
  },
}
