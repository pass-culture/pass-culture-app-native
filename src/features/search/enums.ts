import { SearchGroupNameEnumv2, VenueTypeCodeKey } from 'api/gen'
import { MAP_VENUE_TYPE_TO_LABEL, VenueTypeCode } from 'libs/parsers'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'
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

export enum CategoriesModalView {
  CATEGORIES = 'CATEGORIES',
  NATIVE_CATEGORIES = 'NATIVE_CATEGORIES',
  GENRES = 'GENRES',
}

type CategoryCriteria = {
  [category in SearchGroupNameEnumv2]: {
    icon: React.FC<BicolorIconInterface>
    facetFilter: SearchGroupNameEnumv2
  }
}

export const CATEGORY_CRITERIA: CategoryCriteria = {
  [SearchGroupNameEnumv2.NONE]: {
    icon: categoriesIcons.All,
    facetFilter: SearchGroupNameEnumv2.NONE,
  },
  [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS]: {
    icon: categoriesIcons.Palette,
    facetFilter: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
  },
  [SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE]: {
    icon: categoriesIcons.Bookstore,
    facetFilter: SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE,
  },
  [SearchGroupNameEnumv2.CARTES_JEUNES]: {
    icon: categoriesIcons.Card,
    facetFilter: SearchGroupNameEnumv2.CARTES_JEUNES,
  },
  [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE]: {
    icon: categoriesIcons.Disk,
    facetFilter: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
  },
  [SearchGroupNameEnumv2.CONCERTS_FESTIVALS]: {
    icon: categoriesIcons.Conference,
    facetFilter: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
  },
  [SearchGroupNameEnumv2.RENCONTRES_CONFERENCES]: {
    icon: categoriesIcons.Microphone,
    facetFilter: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
  },
  [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE]: {
    icon: categoriesIcons.LiveEvent,
    facetFilter: SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
  },
  [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA]: {
    icon: categoriesIcons.Cinema,
    facetFilter: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
  },
  [SearchGroupNameEnumv2.INSTRUMENTS]: {
    icon: categoriesIcons.Instrument,
    facetFilter: SearchGroupNameEnumv2.INSTRUMENTS,
  },
  [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS]: {
    icon: categoriesIcons.VideoGame,
    facetFilter: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
  },
  [SearchGroupNameEnumv2.LIVRES]: {
    icon: categoriesIcons.Book,
    facetFilter: SearchGroupNameEnumv2.LIVRES,
  },
  [SearchGroupNameEnumv2.MEDIA_PRESSE]: {
    icon: categoriesIcons.Press,
    facetFilter: SearchGroupNameEnumv2.MEDIA_PRESSE,
  },
  [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES]: {
    icon: categoriesIcons.Museum,
    facetFilter: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
  },
  [SearchGroupNameEnumv2.SPECTACLES]: {
    icon: categoriesIcons.Show,
    facetFilter: SearchGroupNameEnumv2.SPECTACLES,
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
  [VenueTypeCodeKey.TRAVELING_CINEMA]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.TRAVELING_CINEMA],
    facetFilter: VenueTypeCodeKey.TRAVELING_CINEMA,
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

export enum RadioButtonLocation {
  EVERYWHERE = 'Partout',
  AROUND_ME = 'Autour de moi',
  CHOOSE_PLACE_OR_VENUE = 'Choisir un lieu',
  NO_LOCATION = 'Aucune localisation',
}

export enum FilterBehaviour {
  SEARCH = 'Search',
  APPLY_WITHOUT_SEARCHING = 'ApplyWithoutSearching',
}
