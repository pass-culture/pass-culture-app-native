import { VenueTypeCode } from 'api/gen'
import { IconInterface } from 'ui/svg/icons/types'
import {
  ArtisticCourseIcon,
  BookstoreIcon,
  ConcertHallIcon,
  CreativeArtsStoreIcon,
  CulturalCentreIcon,
  DigitalIcon,
  FestivalIcon,
  GamesIcon,
  LibraryIcon,
  MovieIcon,
  MuseumIcon,
  MusicalInstrumentStoreIcon,
  OtherIcon,
  PatrimonyTourismIcon,
  PerformingArtsIcon,
  RecordStoreIcon,
  ScientificCultureIcon,
  VisualArtIcon,
} from 'ui/svg/icons/venueTypes'

// Map the facetFilter (in algolia) to the label displayed in the front
const MAP_TYPE_TO_LABEL: { [k in VenueTypeCode]: string } = {
  ARTISTIC_COURSE: 'Cours et pratique artistiques',
  BOOKSTORE: 'Bibliothèque ou médiathèque',
  CONCERT_HALL: 'Musique - Salle de concerts',
  CREATIVE_ARTS_STORE: 'Magasin arts créatifs',
  CULTURAL_CENTRE: 'Centre culturel',
  DIGITAL: 'Offre numérique',
  FESTIVAL: 'Festival',
  GAMES: 'Jeux / Jeux vidéos',
  LIBRARY: 'Librairie',
  MUSEUM: 'Musée',
  MUSICAL_INSTRUMENT_STORE: 'Musique - Magasin d’instruments',
  MOVIE: 'Cinéma - Salle de projections',
  OTHER: 'Autre type de lieu',
  PATRIMONY_TOURISM: 'Patrimoine et tourisme',
  PERFORMING_ARTS: 'Spectacle vivant',
  RECORD_STORE: 'Musique - Disquaire',
  SCIENTIFIC_CULTURE: 'Culture scientifique',
  VISUAL_ARTS: 'Arts visuels, arts plastiques et galeries',
}

export const parseType = (types: VenueTypeCode | null | undefined): string => {
  if (types && types in MAP_TYPE_TO_LABEL) return MAP_TYPE_TO_LABEL[types]
  return MAP_TYPE_TO_LABEL.OTHER
}

// Map the facetFilter (in algolia) to the label displayed for home page in the front
const MAP_TYPE_TO_HOME_LABEL: { [k in VenueTypeCode]: string } = {
  ARTISTIC_COURSE: 'Pratique artistiques',
  BOOKSTORE: 'Bibliothèque / médiathèque',
  CONCERT_HALL: 'Salle de concerts',
  CREATIVE_ARTS_STORE: 'Magasin d’arts créatifs',
  CULTURAL_CENTRE: 'Centre culturel',
  DIGITAL: 'Offre numérique',
  FESTIVAL: 'Festival',
  GAMES: 'Jeux',
  LIBRARY: 'Librairie',
  MUSEUM: 'Musée',
  MUSICAL_INSTRUMENT_STORE: 'Magasin d’instruments',
  MOVIE: 'Salle de projections',
  OTHER: 'Autre type de lieu',
  PATRIMONY_TOURISM: 'Patrimoine / tourisme',
  PERFORMING_ARTS: 'Spectacle vivant',
  RECORD_STORE: 'Disquaire',
  SCIENTIFIC_CULTURE: 'Culture scientifique',
  VISUAL_ARTS: 'Galeries d’art',
}

export const parseTypeHomeLabel = (types: VenueTypeCode | null | undefined): string => {
  if (types && types in MAP_TYPE_TO_HOME_LABEL) return MAP_TYPE_TO_HOME_LABEL[types]
  return MAP_TYPE_TO_HOME_LABEL.OTHER
}

// Map the facetFilter (in algolia) to the category Icon
export const MAP_TYPE_TO_ICON: {
  [k in VenueTypeCode]: React.FC<IconInterface>
} = {
  ARTISTIC_COURSE: ArtisticCourseIcon,
  BOOKSTORE: BookstoreIcon,
  CONCERT_HALL: ConcertHallIcon,
  CREATIVE_ARTS_STORE: CreativeArtsStoreIcon,
  CULTURAL_CENTRE: CulturalCentreIcon,
  DIGITAL: DigitalIcon,
  FESTIVAL: FestivalIcon,
  GAMES: GamesIcon,
  LIBRARY: LibraryIcon,
  MUSEUM: MuseumIcon,
  MUSICAL_INSTRUMENT_STORE: MusicalInstrumentStoreIcon,
  MOVIE: MovieIcon,
  OTHER: OtherIcon,
  PATRIMONY_TOURISM: PatrimonyTourismIcon,
  PERFORMING_ARTS: PerformingArtsIcon,
  RECORD_STORE: RecordStoreIcon,
  SCIENTIFIC_CULTURE: ScientificCultureIcon,
  VISUAL_ARTS: VisualArtIcon,
}

export const mapVenueTypeToIcon = (types: VenueTypeCode | null): React.FC<IconInterface> => {
  if (types && types in MAP_TYPE_TO_ICON) return MAP_TYPE_TO_ICON[types]
  return OtherIcon
}
