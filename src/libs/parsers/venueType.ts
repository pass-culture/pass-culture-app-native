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

// Map the facetFilter (in search backend) to the label displayed in the front
export const MAP_VENUE_TYPE_TO_LABEL: { [k in VenueTypeCodeKey]: string } = {
  [VenueTypeCodeKey.ARTISTICCOURSE]: t`Cours et pratique artistiques`,
  [VenueTypeCodeKey.BOOKSTORE]: t`Bibliothèque ou médiathèque`,
  [VenueTypeCodeKey.CONCERTHALL]: t`Musique - Salle de concerts`,
  [VenueTypeCodeKey.CREATIVEARTSSTORE]: t`Magasin arts créatifs`,
  [VenueTypeCodeKey.CULTURALCENTRE]: t`Centre culturel`,
  [VenueTypeCodeKey.DIGITAL]: t`Offre numérique`,
  [VenueTypeCodeKey.FESTIVAL]: t`Festival`,
  [VenueTypeCodeKey.GAMES]: t`Jeux / Jeux vidéos`,
  [VenueTypeCodeKey.LIBRARY]: t`Librairie`,
  [VenueTypeCodeKey.MUSEUM]: t`Musée`,
  [VenueTypeCodeKey.MUSICALINSTRUMENTSTORE]: t`Musique - Magasin d’instruments`,
  [VenueTypeCodeKey.MOVIE]: t`Cinéma - Salle de projections`,
  [VenueTypeCodeKey.OTHER]: t`Autre type de lieu`,
  [VenueTypeCodeKey.PATRIMONYTOURISM]: t`Patrimoine et tourisme`,
  [VenueTypeCodeKey.PERFORMINGARTS]: t`Spectacle vivant`,
  [VenueTypeCodeKey.RECORDSTORE]: t`Musique - Disquaire`,
  [VenueTypeCodeKey.SCIENTIFICCULTURE]: t`Culture scientifique`,
  [VenueTypeCodeKey.VISUALARTS]: t`Arts visuels, arts plastiques et galeries`,
}

export const parseType = (types: VenueTypeCodeKey | null | undefined): string => {
  if (types && types in MAP_VENUE_TYPE_TO_LABEL) return MAP_VENUE_TYPE_TO_LABEL[types]
  return MAP_VENUE_TYPE_TO_LABEL.OTHER
}

// Map the facetFilter (in search backend) to the label displayed for home page in the front
const MAP_TYPE_TO_HOME_LABEL: { [k in VenueTypeCodeKey]: string } = {
  ARTISTIC_COURSE: t`Pratique artistiques`,
  BOOKSTORE: t`Librairie`,
  CONCERT_HALL: t`Salle de concerts`,
  CREATIVE_ARTS_STORE: t`Magasin d’arts créatifs`,
  CULTURAL_CENTRE: t`Centre culturel`,
  DIGITAL: t`Offre numérique`,
  FESTIVAL: t`Festival`,
  GAMES: t`Jeux`,
  LIBRARY: t`Bibliothèque / médiathèque`,
  MUSEUM: t`Musée`,
  MUSICAL_INSTRUMENT_STORE: t`Magasin d’instruments`,
  MOVIE: t`Salle de projections`,
  OTHER: t`Autre type de lieu`,
  PATRIMONY_TOURISM: t`Patrimoine / tourisme`,
  PERFORMING_ARTS: t`Spectacle vivant`,
  RECORD_STORE: t`Disquaire`,
  SCIENTIFIC_CULTURE: t`Culture scientifique`,
  VISUAL_ARTS: t`Galeries d’art`,
}

export const parseTypeHomeLabel = (types: VenueTypeCodeKey | null | undefined): string => {
  if (types && types in MAP_TYPE_TO_HOME_LABEL) return MAP_TYPE_TO_HOME_LABEL[types]
  return MAP_TYPE_TO_HOME_LABEL.OTHER
}

// Map the facetFilter (in search backend) to the category Icon
export const MAP_TYPE_TO_ICON: {
  [k in VenueTypeCodeKey]: React.FC<IconInterface>
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

export const mapVenueTypeToIcon = (types: VenueTypeCodeKey | null): React.FC<IconInterface> => {
  if (types && types in MAP_TYPE_TO_ICON) return MAP_TYPE_TO_ICON[types]
  return OtherIcon
}
