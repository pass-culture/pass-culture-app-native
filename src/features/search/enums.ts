import { SearchGroupNameEnumv2, VenueTypeCodeKey } from 'api/gen'
import { MAP_VENUE_TYPE_TO_LABEL, VenueTypeCode } from 'libs/parsers/venueType'
import { BackgroundColorKey, BorderColorKey } from 'theme/types'
import { ArtsCrafts } from 'ui/svg/icons/categories/ArtsCrafts'
import { Books } from 'ui/svg/icons/categories/Books'
import { CDVinylsOnlineMusic } from 'ui/svg/icons/categories/CDVinylsOnlineMusic'
import { ConcertsFestivals } from 'ui/svg/icons/categories/ConcertsFestivals'
import { ConferencesMeetings } from 'ui/svg/icons/categories/ConferencesMeetings'
import { FilmsSeriesCinema } from 'ui/svg/icons/categories/FilmsSeriesCinema'
import { GamesVideoGames } from 'ui/svg/icons/categories/GamesVideoGames'
import { LibrariesMediaLibraries } from 'ui/svg/icons/categories/LibrariesMediaLibraries'
import { MediaPress } from 'ui/svg/icons/categories/MediaPress'
import { MuseumCulturalVisits } from 'ui/svg/icons/categories/MuseumCulturalVisits'
import { MusicalInstruments } from 'ui/svg/icons/categories/MusicalInstruments'
import { OnlineEvents } from 'ui/svg/icons/categories/OnlineEvents'
import { Shows } from 'ui/svg/icons/categories/Shows'
import { YouthCards } from 'ui/svg/icons/categories/YouthCards'
import { categoriesIcons } from 'ui/svg/icons/exports/categoriesIcons'
import { AccessibleIcon } from 'ui/svg/icons/types'

export enum DATE_FILTER_OPTIONS {
  TODAY = 'today',
  CURRENT_WEEK = 'currentWeek',
  CURRENT_WEEK_END = 'currentWeekEnd',
  USER_PICK = 'picked',
}

export enum CategoriesModalView {
  CATEGORIES = 'CATEGORIES',
  NATIVE_CATEGORIES = 'NATIVE_CATEGORIES',
  GENRES = 'GENRES',
}

export const SearchCategoriesIllustrations = {
  ArtsCrafts,
  Books,
  CDVinylsOnlineMusic,
  ConcertsFestivals,
  ConferencesMeetings,
  FilmsSeriesCinema,
  GamesVideoGames,
  LibrariesMediaLibraries,
  MediaPress,
  MuseumCulturalVisits,
  MusicalInstruments,
  OnlineEvents,
  Shows,
  YouthCards,
}

export type CategoryCriteria = {
  icon: React.FC<AccessibleIcon>
  illustration: React.FC<AccessibleIcon>
  facetFilter: SearchGroupNameEnumv2
  position: number
  fillColor: BackgroundColorKey
  borderColor: BorderColorKey
}

type CategoryCriteriaWithNone = {
  [category in SearchGroupNameEnumv2]: category extends SearchGroupNameEnumv2.NONE
    ? {
        icon: React.FC<AccessibleIcon>
        illustration: undefined
        facetFilter: SearchGroupNameEnumv2
        position: undefined
        fillColor: undefined
        borderColor: undefined
      }
    : CategoryCriteria
}

export const CATEGORY_CRITERIA: CategoryCriteriaWithNone = {
  [SearchGroupNameEnumv2.NONE]: {
    icon: categoriesIcons.All,
    illustration: undefined,
    facetFilter: SearchGroupNameEnumv2.NONE,
    position: undefined,
    borderColor: undefined,
    fillColor: undefined,
  },
  [SearchGroupNameEnumv2.CONCERTS_FESTIVALS]: {
    icon: categoriesIcons.Conference,
    illustration: SearchCategoriesIllustrations.ConcertsFestivals,
    facetFilter: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
    position: 1,
    borderColor: 'decorative03',
    fillColor: 'decorative03',
  },
  [SearchGroupNameEnumv2.CINEMA]: {
    icon: categoriesIcons.Cinema,
    illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
    facetFilter: SearchGroupNameEnumv2.CINEMA,
    position: 2,
    borderColor: 'decorative01',
    fillColor: 'decorative01',
  },
  [SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES]: {
    icon: categoriesIcons.Cinema,
    illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
    facetFilter: SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES,
    position: 3,
    borderColor: 'decorative02',
    fillColor: 'decorative02',
  },
  [SearchGroupNameEnumv2.LIVRES]: {
    icon: categoriesIcons.Book,
    illustration: SearchCategoriesIllustrations.Books,
    facetFilter: SearchGroupNameEnumv2.LIVRES,
    position: 4,
    borderColor: 'decorative05',
    fillColor: 'decorative05',
  },
  [SearchGroupNameEnumv2.MUSIQUE]: {
    icon: categoriesIcons.Disk,
    illustration: SearchCategoriesIllustrations.CDVinylsOnlineMusic,
    facetFilter: SearchGroupNameEnumv2.MUSIQUE,
    position: 5,
    borderColor: 'decorative04',
    fillColor: 'decorative04',
  },
  [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS]: {
    icon: categoriesIcons.Palette,
    illustration: SearchCategoriesIllustrations.ArtsCrafts,
    facetFilter: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
    position: 6,
    borderColor: 'decorative01',
    fillColor: 'decorative01',
  },
  [SearchGroupNameEnumv2.SPECTACLES]: {
    icon: categoriesIcons.Show,
    illustration: SearchCategoriesIllustrations.Shows,
    facetFilter: SearchGroupNameEnumv2.SPECTACLES,
    position: 7,
    borderColor: 'decorative05',
    fillColor: 'decorative05',
  },
  [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES]: {
    icon: categoriesIcons.Museum,
    illustration: SearchCategoriesIllustrations.MuseumCulturalVisits,
    facetFilter: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
    position: 8,
    borderColor: 'decorative03',
    fillColor: 'decorative03',
  },
  [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS]: {
    icon: categoriesIcons.VideoGame,
    illustration: SearchCategoriesIllustrations.GamesVideoGames,
    facetFilter: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
    position: 9,
    borderColor: 'decorative04',
    fillColor: 'decorative04',
  },
  [SearchGroupNameEnumv2.MEDIA_PRESSE]: {
    icon: categoriesIcons.Press,
    illustration: SearchCategoriesIllustrations.MediaPress,
    facetFilter: SearchGroupNameEnumv2.MEDIA_PRESSE,
    position: 10,
    borderColor: 'decorative02',
    fillColor: 'decorative02',
  },
  [SearchGroupNameEnumv2.CARTES_JEUNES]: {
    icon: categoriesIcons.Card,
    illustration: SearchCategoriesIllustrations.YouthCards,
    facetFilter: SearchGroupNameEnumv2.CARTES_JEUNES,
    position: 11,
    borderColor: 'decorative03',
    fillColor: 'decorative03',
  },
  [SearchGroupNameEnumv2.RENCONTRES_CONFERENCES]: {
    icon: categoriesIcons.Microphone,
    illustration: SearchCategoriesIllustrations.ConferencesMeetings,
    facetFilter: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
    position: 12,
    borderColor: 'decorative01',
    fillColor: 'decorative01',
  },
  [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE]: {
    icon: categoriesIcons.LiveEvent,
    illustration: SearchCategoriesIllustrations.OnlineEvents,
    position: 13,
    facetFilter: SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
    borderColor: 'decorative02',
    fillColor: 'decorative02',
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
  [VenueTypeCodeKey.DISTRIBUTION_STORE]: {
    label: MAP_VENUE_TYPE_TO_LABEL[VenueTypeCodeKey.DISTRIBUTION_STORE],
    facetFilter: VenueTypeCodeKey.DISTRIBUTION_STORE,
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

export enum FilterBehaviour {
  SEARCH = 'Search',
  APPLY_WITHOUT_SEARCHING = 'ApplyWithoutSearching',
}
