import { VenueTypeCode } from 'api/gen'
import { IconInterface } from 'ui/svg/icons/types'
import { Type } from 'ui/svg/icons/venueTypes'

// All offers without category are the 'Art' ones
const DEFAULT_TYPE = 'Autre'

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
  OTHER: 'Autre',
  PATRIMONY_TOURISM: 'Patrimoine et tourisme',
  PERFORMING_ARTS: 'Spectacle vivant',
  RECORD_STORE: 'Musique - Disquaire',
  SCIENTIFIC_CULTURE: 'Culture scientifique',
  VISUAL_ARTS: 'Arts visuels, arts plastiques et galeries',
}

export const parseType = (types: VenueTypeCode | null | undefined): string => {
  if (types && types in MAP_TYPE_TO_LABEL) return MAP_TYPE_TO_LABEL[types]
  return DEFAULT_TYPE || ''
}

// Map the facetFilter (in algolia) to the category Icon
export const MAP_TYPE_TO_ICON: {
  [k in VenueTypeCode]: React.FC<IconInterface>
} = {
  ARTISTIC_COURSE: Type.ArtisticCourse,
  BOOKSTORE: Type.Bookstore,
  CONCERT_HALL: Type.ConcertHall,
  CREATIVE_ARTS_STORE: Type.Other,
  CULTURAL_CENTRE: Type.CulturalCentre,
  DIGITAL: Type.Digital,
  FESTIVAL: Type.Festival,
  GAMES: Type.Games,
  LIBRARY: Type.Library,
  MUSEUM: Type.Museum,
  MUSICAL_INSTRUMENT_STORE: Type.MusicalInstrumentStore,
  MOVIE: Type.Movie,
  OTHER: Type.Other,
  PATRIMONY_TOURISM: Type.PatrimonyTourism,
  PERFORMING_ARTS: Type.PerformingArts,
  RECORD_STORE: Type.RecordStore,
  SCIENTIFIC_CULTURE: Type.ScientificCulture,
  VISUAL_ARTS: Type.VisualArt,
}

export const mapTypeToIcon = (types: VenueTypeCode | null): React.FC<IconInterface> => {
  if (types && types in MAP_TYPE_TO_ICON) return MAP_TYPE_TO_ICON[types]
  return Type.Other
}
