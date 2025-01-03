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
import { AccessibleBicolorIcon, AccessibleIcon } from 'ui/svg/icons/types'
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

export type CategoryAppearance = {
  illustration: React.FC<AccessibleIcon>
  baseColor: ColorsEnum
  gradients: Gradient
  fillColor: ColorsEnum
  borderColor: ColorsEnum
  textColor: ColorsEnum
}

export const CATEGORY_ICONS: Record<SearchGroupNameEnumv2, React.FC<AccessibleBicolorIcon>> = {
  NONE: categoriesIcons.All,
  CONCERTS_FESTIVALS: categoriesIcons.Conference,
  FILMS_SERIES_CINEMA: categoriesIcons.Cinema,
  CINEMA: categoriesIcons.Cinema,
  FILMS_DOCUMENTAIRES_SERIES: categoriesIcons.Cinema,
  LIVRES: categoriesIcons.Book,
  CD_VINYLE_MUSIQUE_EN_LIGNE: categoriesIcons.Disk,
  MUSIQUE: categoriesIcons.Disk,
  ARTS_LOISIRS_CREATIFS: categoriesIcons.Palette,
  SPECTACLES: categoriesIcons.Show,
  MUSEES_VISITES_CULTURELLES: categoriesIcons.Museum,
  JEUX_JEUX_VIDEOS: categoriesIcons.VideoGame,
  INSTRUMENTS: categoriesIcons.Instrument,
  MEDIA_PRESSE: categoriesIcons.Press,
  CARTES_JEUNES: categoriesIcons.Card,
  RENCONTRES_CONFERENCES: categoriesIcons.Microphone,
  EVENEMENTS_EN_LIGNE: categoriesIcons.LiveEvent,
}

export const CATEGORY_APPEARANCE: Record<
  Exclude<SearchGroupNameEnumv2, SearchGroupNameEnumv2.NONE>,
  CategoryAppearance
> = {
  [SearchGroupNameEnumv2.CONCERTS_FESTIVALS]: {
    illustration: SearchCategoriesIllustrations.ConcertsFestivals,
    baseColor: theme.colors.goldDark,
    gradients: gradientColorsMapping.Gold,
    textColor: theme.colors.lilacDark,
    borderColor: theme.colors.goldLight200,
    fillColor: theme.colors.goldLight100,
  },
  [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA]: {
    illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
    baseColor: theme.colors.aquamarineDark,
    gradients: gradientColorsMapping.Aquamarine,
    textColor: theme.colors.skyBlueDark,
    borderColor: theme.colors.coral,
    fillColor: theme.colors.coralLight,
  },
  [SearchGroupNameEnumv2.CINEMA]: {
    illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
    baseColor: theme.colors.skyBlueDark,
    gradients: gradientColorsMapping.SkyBlue,
    textColor: theme.colors.coralDark,
    borderColor: theme.colors.skyBlue,
    fillColor: theme.colors.skyBlueLight,
  },
  [SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES]: {
    illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
    baseColor: theme.colors.lilacDark,
    gradients: gradientColorsMapping.Lilac,
    textColor: theme.colors.deepPinkDark,
    borderColor: theme.colors.lilac,
    fillColor: theme.colors.lilacLight,
  },
  [SearchGroupNameEnumv2.LIVRES]: {
    illustration: SearchCategoriesIllustrations.Books,
    baseColor: theme.colors.goldDark,
    gradients: gradientColorsMapping.Gold,
    textColor: theme.colors.skyBlueDark,
    borderColor: theme.colors.coral,
    fillColor: theme.colors.coralLight,
  },
  [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE]: {
    illustration: SearchCategoriesIllustrations.CDVinylsOnlineMusic,
    baseColor: theme.colors.coralDark,
    gradients: gradientColorsMapping.Coral,
    textColor: theme.colors.lilacDark,
    borderColor: theme.colors.aquamarineDark,
    fillColor: theme.colors.aquamarineLight,
  },
  [SearchGroupNameEnumv2.MUSIQUE]: {
    illustration: SearchCategoriesIllustrations.CDVinylsOnlineMusic,
    baseColor: theme.colors.coralDark,
    gradients: gradientColorsMapping.Coral,
    textColor: theme.colors.lilacDark,
    borderColor: theme.colors.aquamarineDark,
    fillColor: theme.colors.aquamarineLight,
  },
  [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS]: {
    illustration: SearchCategoriesIllustrations.ArtsCrafts,
    baseColor: theme.colors.deepPinkDark,
    gradients: gradientColorsMapping.DeepPink,
    textColor: theme.colors.aquamarineDark,
    borderColor: theme.colors.deepPink,
    fillColor: theme.colors.deepPinkLight,
  },
  [SearchGroupNameEnumv2.SPECTACLES]: {
    illustration: SearchCategoriesIllustrations.Shows,
    baseColor: theme.colors.aquamarineDark,
    gradients: gradientColorsMapping.Aquamarine,
    textColor: theme.colors.lilacDark,
    borderColor: theme.colors.goldLight200,
    fillColor: theme.colors.goldLight100,
  },
  [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES]: {
    illustration: SearchCategoriesIllustrations.MuseumCulturalVisits,
    baseColor: theme.colors.skyBlueDark,
    gradients: gradientColorsMapping.SkyBlue,
    textColor: theme.colors.coralDark,
    borderColor: theme.colors.skyBlue,
    fillColor: theme.colors.skyBlueLight,
  },
  [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS]: {
    illustration: SearchCategoriesIllustrations.GamesVideoGames,
    baseColor: theme.colors.lilacDark,
    gradients: gradientColorsMapping.Lilac,
    textColor: theme.colors.deepPinkDark,
    borderColor: theme.colors.lilac,
    fillColor: theme.colors.lilacLight,
  },
  [SearchGroupNameEnumv2.INSTRUMENTS]: {
    illustration: SearchCategoriesIllustrations.MusicalInstruments,
    baseColor: theme.colors.goldDark,
    gradients: gradientColorsMapping.Gold,
    textColor: theme.colors.skyBlueDark,
    borderColor: theme.colors.coral,
    fillColor: theme.colors.coralLight,
  },
  [SearchGroupNameEnumv2.MEDIA_PRESSE]: {
    illustration: SearchCategoriesIllustrations.MediaPress,
    baseColor: theme.colors.goldDark,
    gradients: gradientColorsMapping.Gold,
    textColor: theme.colors.skyBlueDark,
    borderColor: theme.colors.coral,
    fillColor: theme.colors.coralLight,
  },
  [SearchGroupNameEnumv2.CARTES_JEUNES]: {
    illustration: SearchCategoriesIllustrations.YouthCards,
    baseColor: theme.colors.goldDark,
    gradients: gradientColorsMapping.Gold,
    textColor: theme.colors.lilacDark,
    borderColor: theme.colors.aquamarineDark,
    fillColor: theme.colors.aquamarineLight,
  },
  [SearchGroupNameEnumv2.RENCONTRES_CONFERENCES]: {
    illustration: SearchCategoriesIllustrations.ConferencesMeetings,
    baseColor: theme.colors.deepPinkDark,
    gradients: gradientColorsMapping.DeepPink,
    textColor: theme.colors.aquamarineDark,
    borderColor: theme.colors.deepPink,
    fillColor: theme.colors.deepPinkLight,
  },
  [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE]: {
    illustration: SearchCategoriesIllustrations.OnlineEvents,
    baseColor: theme.colors.goldDark,
    gradients: gradientColorsMapping.Gold,
    textColor: theme.colors.lilacDark,
    borderColor: theme.colors.goldLight200,
    fillColor: theme.colors.goldLight100,
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
