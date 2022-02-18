import { t } from '@lingui/macro'

import { VenueTypeCodeKey } from 'api/gen'
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

export type VenueTypeCode = Exclude<VenueTypeCodeKey, VenueTypeCodeKey.ADMINISTRATIVE>

// Map the facetFilter (in search backend) to the label displayed in the front
export const MAP_VENUE_TYPE_TO_LABEL: {
  [k in VenueTypeCode]: string
} = {
  [VenueTypeCodeKey.ARTISTIC_COURSE]: t`Cours et pratique artistiques`,
  [VenueTypeCodeKey.BOOKSTORE]: t`Librairie`,
  [VenueTypeCodeKey.CONCERT_HALL]: t`Musique - Salle de concerts`,
  [VenueTypeCodeKey.CREATIVE_ARTS_STORE]: t`Magasin arts créatifs`,
  [VenueTypeCodeKey.CULTURAL_CENTRE]: t`Centre culturel`,
  [VenueTypeCodeKey.DIGITAL]: t`Offre numérique`,
  [VenueTypeCodeKey.FESTIVAL]: t`Festival`,
  [VenueTypeCodeKey.GAMES]: t`Jeux / Jeux vidéos`,
  [VenueTypeCodeKey.LIBRARY]: t`Bibliothèque ou médiathèque`,
  [VenueTypeCodeKey.MUSEUM]: t`Musée`,
  [VenueTypeCodeKey.MUSICAL_INSTRUMENT_STORE]: t`Musique - Magasin d’instruments`,
  [VenueTypeCodeKey.MOVIE]: t`Cinéma - Salle de projections`,
  [VenueTypeCodeKey.OTHER]: t`Autre type de lieu`,
  [VenueTypeCodeKey.PATRIMONY_TOURISM]: t`Patrimoine et tourisme`,
  [VenueTypeCodeKey.PERFORMING_ARTS]: t`Spectacle vivant`,
  [VenueTypeCodeKey.RECORD_STORE]: t`Musique - Disquaire`,
  [VenueTypeCodeKey.SCIENTIFIC_CULTURE]: t`Culture scientifique`,
  [VenueTypeCodeKey.VISUAL_ARTS]: t`Arts visuels, arts plastiques et galeries`,
}

export const parseType = (types: VenueTypeCode | null | undefined): string => {
  if (types && types in MAP_VENUE_TYPE_TO_LABEL) return MAP_VENUE_TYPE_TO_LABEL[types]
  return MAP_VENUE_TYPE_TO_LABEL.OTHER
}

// Map the facetFilter (in search backend) to the label displayed for home page in the front
const MAP_TYPE_TO_HOME_LABEL: {
  [k in VenueTypeCode]: string
} = {
  [VenueTypeCodeKey.ARTISTIC_COURSE]: t`Pratique artistiques`,
  [VenueTypeCodeKey.BOOKSTORE]: t`Librairie`,
  [VenueTypeCodeKey.CONCERT_HALL]: t`Salle de concerts`,
  [VenueTypeCodeKey.CREATIVE_ARTS_STORE]: t`Magasin d’arts créatifs`,
  [VenueTypeCodeKey.CULTURAL_CENTRE]: t`Centre culturel`,
  [VenueTypeCodeKey.DIGITAL]: t`Offre numérique`,
  [VenueTypeCodeKey.FESTIVAL]: t`Festival`,
  [VenueTypeCodeKey.GAMES]: t`Jeux`,
  [VenueTypeCodeKey.LIBRARY]: t`Bibliothèque / médiathèque`,
  [VenueTypeCodeKey.MUSEUM]: t`Musée`,
  [VenueTypeCodeKey.MUSICAL_INSTRUMENT_STORE]: t`Magasin d’instruments`,
  [VenueTypeCodeKey.MOVIE]: t`Salle de projections`,
  [VenueTypeCodeKey.OTHER]: t`Autre type de lieu`,
  [VenueTypeCodeKey.PATRIMONY_TOURISM]: t`Patrimoine / tourisme`,
  [VenueTypeCodeKey.PERFORMING_ARTS]: t`Spectacle vivant`,
  [VenueTypeCodeKey.RECORD_STORE]: t`Disquaire`,
  [VenueTypeCodeKey.SCIENTIFIC_CULTURE]: t`Culture scientifique`,
  [VenueTypeCodeKey.VISUAL_ARTS]: t`Galeries d’art`,
}

export const parseTypeHomeLabel = (types: VenueTypeCode | null | undefined): string => {
  if (types && types in MAP_TYPE_TO_HOME_LABEL) return MAP_TYPE_TO_HOME_LABEL[types]
  return MAP_TYPE_TO_HOME_LABEL.OTHER
}

// Map the facetFilter (in search backend) to the category Icon
export const MAP_TYPE_TO_ICON: {
  [k in VenueTypeCode]: React.FC<IconInterface>
} = {
  [VenueTypeCodeKey.ARTISTIC_COURSE]: ArtisticCourseIcon,
  [VenueTypeCodeKey.BOOKSTORE]: BookstoreIcon,
  [VenueTypeCodeKey.CONCERT_HALL]: ConcertHallIcon,
  [VenueTypeCodeKey.CREATIVE_ARTS_STORE]: CreativeArtsStoreIcon,
  [VenueTypeCodeKey.CULTURAL_CENTRE]: CulturalCentreIcon,
  [VenueTypeCodeKey.DIGITAL]: DigitalIcon,
  [VenueTypeCodeKey.FESTIVAL]: FestivalIcon,
  [VenueTypeCodeKey.GAMES]: GamesIcon,
  [VenueTypeCodeKey.LIBRARY]: LibraryIcon,
  [VenueTypeCodeKey.MUSEUM]: MuseumIcon,
  [VenueTypeCodeKey.MUSICAL_INSTRUMENT_STORE]: MusicalInstrumentStoreIcon,
  [VenueTypeCodeKey.MOVIE]: MovieIcon,
  [VenueTypeCodeKey.OTHER]: OtherIcon,
  [VenueTypeCodeKey.PATRIMONY_TOURISM]: PatrimonyTourismIcon,
  [VenueTypeCodeKey.PERFORMING_ARTS]: PerformingArtsIcon,
  [VenueTypeCodeKey.RECORD_STORE]: RecordStoreIcon,
  [VenueTypeCodeKey.SCIENTIFIC_CULTURE]: ScientificCultureIcon,
  [VenueTypeCodeKey.VISUAL_ARTS]: VisualArtIcon,
}

export const mapVenueTypeToIcon = (types: VenueTypeCode | null): React.FC<IconInterface> => {
  if (types && types in MAP_TYPE_TO_ICON) return MAP_TYPE_TO_ICON[types]
  return OtherIcon
}
