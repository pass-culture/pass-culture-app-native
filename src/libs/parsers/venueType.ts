import { VenueTypeCodeKey } from 'api/gen'
import { venueTypesIcons } from 'ui/svg/icons/exports/venueTypesIcons'
import { AccessibleIcon } from 'ui/svg/icons/types'

export type VenueTypeCode = Exclude<VenueTypeCodeKey, VenueTypeCodeKey.ADMINISTRATIVE>

// Map the facetFilter (in search backend) to the label displayed in the front
export const MAP_VENUE_TYPE_TO_LABEL: {
  [k in VenueTypeCode]: string
} = {
  [VenueTypeCodeKey.ARTISTIC_COURSE]: 'Cours et pratique artistiques',
  [VenueTypeCodeKey.BOOKSTORE]: 'Librairie',
  [VenueTypeCodeKey.CONCERT_HALL]: 'Musique - Salle de concerts',
  [VenueTypeCodeKey.CREATIVE_ARTS_STORE]: 'Magasin arts créatifs',
  [VenueTypeCodeKey.DISTRIBUTION_STORE]: 'Magasin culturel',
  [VenueTypeCodeKey.CULTURAL_CENTRE]: 'Centre culturel',
  [VenueTypeCodeKey.DIGITAL]: 'Offre numérique',
  [VenueTypeCodeKey.FESTIVAL]: 'Festival',
  [VenueTypeCodeKey.GAMES]: 'Jeux / Jeux vidéos',
  [VenueTypeCodeKey.LIBRARY]: 'Bibliothèque ou médiathèque',
  [VenueTypeCodeKey.MUSEUM]: 'Musée',
  [VenueTypeCodeKey.MUSICAL_INSTRUMENT_STORE]: 'Musique - Magasin d’instruments',
  [VenueTypeCodeKey.MOVIE]: 'Cinéma - Salle de projections',
  [VenueTypeCodeKey.TRAVELING_CINEMA]: 'Cinéma itinérant',
  [VenueTypeCodeKey.OTHER]: 'Autre type de lieu',
  [VenueTypeCodeKey.PATRIMONY_TOURISM]: 'Patrimoine et tourisme',
  [VenueTypeCodeKey.PERFORMING_ARTS]: 'Spectacle vivant',
  [VenueTypeCodeKey.RECORD_STORE]: 'Musique - Disquaire',
  [VenueTypeCodeKey.SCIENTIFIC_CULTURE]: 'Culture scientifique',
  [VenueTypeCodeKey.VISUAL_ARTS]: 'Arts visuels, arts plastiques et galeries',
}

export const parseType = (types: VenueTypeCode | null | undefined): string => {
  if (types && types in MAP_VENUE_TYPE_TO_LABEL) return MAP_VENUE_TYPE_TO_LABEL[types]
  return MAP_VENUE_TYPE_TO_LABEL.OTHER
}

// Map the facetFilter (in search backend) to the category Icon
const MAP_TYPE_TO_ICON: {
  [k in VenueTypeCode]: React.FC<AccessibleIcon>
} = {
  [VenueTypeCodeKey.ARTISTIC_COURSE]: venueTypesIcons.Bag,
  [VenueTypeCodeKey.BOOKSTORE]: venueTypesIcons.Bookstore,
  [VenueTypeCodeKey.CONCERT_HALL]: venueTypesIcons.Opera,
  [VenueTypeCodeKey.CREATIVE_ARTS_STORE]: venueTypesIcons.ArtMaterial,
  [VenueTypeCodeKey.CULTURAL_CENTRE]: venueTypesIcons.CulturalCentre,
  [VenueTypeCodeKey.DIGITAL]: venueTypesIcons.Digital,
  [VenueTypeCodeKey.DISTRIBUTION_STORE]: venueTypesIcons.Store,
  [VenueTypeCodeKey.FESTIVAL]: venueTypesIcons.Festival,
  [VenueTypeCodeKey.GAMES]: venueTypesIcons.Games,
  [VenueTypeCodeKey.LIBRARY]: venueTypesIcons.Library,
  [VenueTypeCodeKey.MUSEUM]: venueTypesIcons.Museum,
  [VenueTypeCodeKey.MUSICAL_INSTRUMENT_STORE]: venueTypesIcons.MusicalInstrumentStore,
  [VenueTypeCodeKey.MOVIE]: venueTypesIcons.Movie,
  [VenueTypeCodeKey.TRAVELING_CINEMA]: venueTypesIcons.Movie,
  [VenueTypeCodeKey.OTHER]: venueTypesIcons.Other,
  [VenueTypeCodeKey.PATRIMONY_TOURISM]: venueTypesIcons.PatrimonyTourism,
  [VenueTypeCodeKey.PERFORMING_ARTS]: venueTypesIcons.PerformingArts,
  [VenueTypeCodeKey.RECORD_STORE]: venueTypesIcons.RecordStore,
  [VenueTypeCodeKey.SCIENTIFIC_CULTURE]: venueTypesIcons.ScientificCulture,
  [VenueTypeCodeKey.VISUAL_ARTS]: venueTypesIcons.VisualArt,
}

export const mapVenueTypeToIcon = (types: VenueTypeCode | null): React.FC<AccessibleIcon> => {
  if (types && types in MAP_TYPE_TO_ICON) return MAP_TYPE_TO_ICON[types]
  return venueTypesIcons.Other
}
