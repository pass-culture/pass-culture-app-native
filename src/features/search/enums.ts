import { SearchGroupNameEnumv2, VenueTypeCodeKey } from 'api/gen'
import { MAP_VENUE_TYPE_TO_LABEL, VenueTypeCode } from 'libs/parsers/venueType'
import { theme } from 'theme'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'
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
import { AccessibleIcon, AccessibleBicolorIcon } from 'ui/svg/icons/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { gradientColorsMapping } from 'ui/theme/gradientColorsMapping'

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

export type Gradient = Array<ColorsEnum>

type CategoryCriteria = {
  [category in SearchGroupNameEnumv2]: {
    icon: React.FC<AccessibleBicolorIcon>
    illustration: category extends SearchGroupNameEnumv2.NONE ? undefined : React.FC<AccessibleIcon>
    facetFilter: SearchGroupNameEnumv2
    baseColor: category extends SearchGroupNameEnumv2.NONE ? undefined : ColorsEnum | string
    gradients: category extends SearchGroupNameEnumv2.NONE ? undefined : Gradient
    position: category extends SearchGroupNameEnumv2.NONE ? undefined : number
  }
}

export const CATEGORY_CRITERIA: CategoryCriteria = {
  [SearchGroupNameEnumv2.NONE]: {
    icon: categoriesIcons.All,
    illustration: undefined,
    facetFilter: SearchGroupNameEnumv2.NONE,
    baseColor: undefined,
    gradients: undefined,
    position: undefined,
  },
  [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS]: {
    icon: categoriesIcons.Palette,
    illustration: SearchCategoriesIllustrations.ArtsCrafts,
    facetFilter: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
    baseColor: theme.colors.lilac,
    gradients: gradientColorsMapping.Lilac,
    position: 5,
  },
  [SearchGroupNameEnumv2.CARTES_JEUNES]: {
    icon: categoriesIcons.Card,
    illustration: SearchCategoriesIllustrations.YouthCards,
    facetFilter: SearchGroupNameEnumv2.CARTES_JEUNES,
    baseColor: theme.colors.lilac,
    gradients: gradientColorsMapping.Lilac,
    position: 11,
  },
  [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE]: {
    icon: categoriesIcons.Disk,
    illustration: SearchCategoriesIllustrations.CDVinylsOnlineMusic,
    facetFilter: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
    baseColor: theme.colors.skyBlue,
    gradients: gradientColorsMapping.SkyBlue,
    position: 4,
  },
  [SearchGroupNameEnumv2.CONCERTS_FESTIVALS]: {
    icon: categoriesIcons.Conference,
    illustration: SearchCategoriesIllustrations.ConcertsFestivals,
    facetFilter: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
    baseColor: theme.colors.gold,
    gradients: gradientColorsMapping.Gold,
    position: 1,
  },
  [SearchGroupNameEnumv2.RENCONTRES_CONFERENCES]: {
    icon: categoriesIcons.Microphone,
    illustration: SearchCategoriesIllustrations.ConferencesMeetings,
    facetFilter: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
    baseColor: theme.colors.gold,
    gradients: gradientColorsMapping.Gold,
    position: 12,
  },
  [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE]: {
    icon: categoriesIcons.LiveEvent,
    illustration: SearchCategoriesIllustrations.OnlineEvents,
    facetFilter: SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
    baseColor: theme.colors.aquamarine,
    gradients: gradientColorsMapping.Aquamarine,
    position: 13,
  },
  [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA]: {
    icon: categoriesIcons.Cinema,
    illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
    facetFilter: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
    baseColor: theme.colors.aquamarine,
    gradients: gradientColorsMapping.Aquamarine,
    position: 2,
  },
  [SearchGroupNameEnumv2.INSTRUMENTS]: {
    icon: categoriesIcons.Instrument,
    illustration: SearchCategoriesIllustrations.MusicalInstruments,
    facetFilter: SearchGroupNameEnumv2.INSTRUMENTS,
    baseColor: theme.colors.skyBlue,
    gradients: gradientColorsMapping.SkyBlue,
    position: 9,
  },
  [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS]: {
    icon: categoriesIcons.VideoGame,
    illustration: SearchCategoriesIllustrations.GamesVideoGames,
    facetFilter: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
    baseColor: theme.colors.gold,
    gradients: gradientColorsMapping.Gold,
    position: 8,
  },
  [SearchGroupNameEnumv2.LIVRES]: {
    icon: categoriesIcons.Book,
    illustration: SearchCategoriesIllustrations.Books,
    facetFilter: SearchGroupNameEnumv2.LIVRES,
    baseColor: theme.colors.deepPink,
    gradients: gradientColorsMapping.DeepPink,
    position: 3,
  },
  [SearchGroupNameEnumv2.MEDIA_PRESSE]: {
    icon: categoriesIcons.Press,
    illustration: SearchCategoriesIllustrations.MediaPress,
    facetFilter: SearchGroupNameEnumv2.MEDIA_PRESSE,
    baseColor: theme.colors.deepPink,
    gradients: gradientColorsMapping.DeepPink,
    position: 10,
  },
  [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES]: {
    icon: categoriesIcons.Museum,
    illustration: SearchCategoriesIllustrations.MuseumCulturalVisits,
    facetFilter: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
    baseColor: theme.colors.aquamarine,
    gradients: gradientColorsMapping.Aquamarine,
    position: 7,
  },
  [SearchGroupNameEnumv2.SPECTACLES]: {
    icon: categoriesIcons.Show,
    illustration: SearchCategoriesIllustrations.Shows,
    facetFilter: SearchGroupNameEnumv2.SPECTACLES,
    baseColor: theme.colors.coral,
    gradients: gradientColorsMapping.Coral,
    position: 6,
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
