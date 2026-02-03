import { Activity, SearchGroupNameEnumv2 } from 'api/gen'
import { MAP_ACTIVITY_TO_LABEL } from 'libs/parsers/activity'
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
  [SearchGroupNameEnumv2.CARTES_JEUNES]: {
    icon: categoriesIcons.Card,
    illustration: SearchCategoriesIllustrations.YouthCards,
    facetFilter: SearchGroupNameEnumv2.CARTES_JEUNES,
    position: 1,
    borderColor: 'decorative03',
    fillColor: 'decorative03',
  },
  [SearchGroupNameEnumv2.CONCERTS_FESTIVALS]: {
    icon: categoriesIcons.Conference,
    illustration: SearchCategoriesIllustrations.ConcertsFestivals,
    facetFilter: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
    position: 2,
    borderColor: 'decorative03',
    fillColor: 'decorative03',
  },
  [SearchGroupNameEnumv2.CINEMA]: {
    icon: categoriesIcons.Cinema,
    illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
    facetFilter: SearchGroupNameEnumv2.CINEMA,
    position: 3,
    borderColor: 'decorative01',
    fillColor: 'decorative01',
  },
  [SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES]: {
    icon: categoriesIcons.Cinema,
    illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
    facetFilter: SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES,
    position: 4,
    borderColor: 'decorative02',
    fillColor: 'decorative02',
  },
  [SearchGroupNameEnumv2.LIVRES]: {
    icon: categoriesIcons.Book,
    illustration: SearchCategoriesIllustrations.Books,
    facetFilter: SearchGroupNameEnumv2.LIVRES,
    position: 5,
    borderColor: 'decorative05',
    fillColor: 'decorative05',
  },
  [SearchGroupNameEnumv2.MUSIQUE]: {
    icon: categoriesIcons.Disk,
    illustration: SearchCategoriesIllustrations.CDVinylsOnlineMusic,
    facetFilter: SearchGroupNameEnumv2.MUSIQUE,
    position: 6,
    borderColor: 'decorative04',
    fillColor: 'decorative04',
  },
  [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS]: {
    icon: categoriesIcons.Palette,
    illustration: SearchCategoriesIllustrations.ArtsCrafts,
    facetFilter: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
    position: 7,
    borderColor: 'decorative01',
    fillColor: 'decorative01',
  },
  [SearchGroupNameEnumv2.SPECTACLES]: {
    icon: categoriesIcons.Show,
    illustration: SearchCategoriesIllustrations.Shows,
    facetFilter: SearchGroupNameEnumv2.SPECTACLES,
    position: 8,
    borderColor: 'decorative05',
    fillColor: 'decorative05',
  },
  [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES]: {
    icon: categoriesIcons.Museum,
    illustration: SearchCategoriesIllustrations.MuseumCulturalVisits,
    facetFilter: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
    position: 9,
    borderColor: 'decorative03',
    fillColor: 'decorative03',
  },
  [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS]: {
    icon: categoriesIcons.VideoGame,
    illustration: SearchCategoriesIllustrations.GamesVideoGames,
    facetFilter: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
    position: 10,
    borderColor: 'decorative04',
    fillColor: 'decorative04',
  },
  [SearchGroupNameEnumv2.MEDIA_PRESSE]: {
    icon: categoriesIcons.Press,
    illustration: SearchCategoriesIllustrations.MediaPress,
    facetFilter: SearchGroupNameEnumv2.MEDIA_PRESSE,
    position: 11,
    borderColor: 'decorative02',
    fillColor: 'decorative02',
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

type ActivityCriteria = { ALL: { label: string; facetFilter: '' } } & {
  [activity in Activity]: { label: string; facetFilter: activity }
}

export const ACTIVITY_CRITERIA: ActivityCriteria = {
  ALL: {
    label: 'Tous les types de lieu',
    facetFilter: '',
  },
  [Activity.ART_GALLERY]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.ART_GALLERY],
    facetFilter: Activity.ART_GALLERY,
  },
  [Activity.ART_SCHOOL]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.ART_SCHOOL],
    facetFilter: Activity.ART_SCHOOL,
  },
  [Activity.ARTS_CENTRE]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.ARTS_CENTRE],
    facetFilter: Activity.ARTS_CENTRE,
  },
  [Activity.BOOKSTORE]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.BOOKSTORE],
    facetFilter: Activity.BOOKSTORE,
  },
  [Activity.CINEMA]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.CINEMA],
    facetFilter: Activity.CINEMA,
  },
  [Activity.COMMUNITY_CENTRE]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.COMMUNITY_CENTRE],
    facetFilter: Activity.COMMUNITY_CENTRE,
  },
  [Activity.CREATIVE_ARTS_STORE]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.CREATIVE_ARTS_STORE],
    facetFilter: Activity.CREATIVE_ARTS_STORE,
  },
  [Activity.CULTURAL_CENTRE]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.CULTURAL_CENTRE],
    facetFilter: Activity.CULTURAL_CENTRE,
  },
  [Activity.DISTRIBUTION_STORE]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.DISTRIBUTION_STORE],
    facetFilter: Activity.DISTRIBUTION_STORE,
  },
  [Activity.FESTIVAL]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.FESTIVAL],
    facetFilter: Activity.FESTIVAL,
  },
  [Activity.GAMES_CENTRE]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.GAMES_CENTRE],
    facetFilter: Activity.GAMES_CENTRE,
  },
  [Activity.HERITAGE_SITE]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.HERITAGE_SITE],
    facetFilter: Activity.HERITAGE_SITE,
  },
  [Activity.LIBRARY]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.LIBRARY],
    facetFilter: Activity.LIBRARY,
  },
  [Activity.MUSEUM]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.MUSEUM],
    facetFilter: Activity.MUSEUM,
  },
  [Activity.MUSIC_INSTRUMENT_STORE]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.MUSIC_INSTRUMENT_STORE],
    facetFilter: Activity.MUSIC_INSTRUMENT_STORE,
  },
  [Activity.NOT_ASSIGNED]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.NOT_ASSIGNED],
    facetFilter: Activity.NOT_ASSIGNED,
  },
  [Activity.OTHER]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.OTHER],
    facetFilter: Activity.OTHER,
  },
  [Activity.PERFORMANCE_HALL]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.PERFORMANCE_HALL],
    facetFilter: Activity.PERFORMANCE_HALL,
  },
  [Activity.RECORD_STORE]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.RECORD_STORE],
    facetFilter: Activity.RECORD_STORE,
  },
  [Activity.SCIENCE_CENTRE]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.SCIENCE_CENTRE],
    facetFilter: Activity.SCIENCE_CENTRE,
  },
  [Activity.TOURIST_INFORMATION_CENTRE]: {
    label: MAP_ACTIVITY_TO_LABEL[Activity.TOURIST_INFORMATION_CENTRE],
    facetFilter: Activity.TOURIST_INFORMATION_CENTRE,
  },
}

export enum FilterBehaviour {
  SEARCH = 'Search',
  APPLY_WITHOUT_SEARCHING = 'ApplyWithoutSearching',
}
