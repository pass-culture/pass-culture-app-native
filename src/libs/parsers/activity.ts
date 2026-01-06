import { Activity } from 'api/gen'
import { activityIcons } from 'ui/svg/icons/exports/activityIcons'
import { AccessibleIcon } from 'ui/svg/icons/types'

// Map the facetFilter (in search backend) to the label displayed in the front
export const MAP_ACTIVITY_TO_LABEL: {
  [k in Activity]: string
} = {
  [Activity.ART_GALLERY]: 'Galerie d’art',
  [Activity.ART_SCHOOL]: 'Centre de pratique artistique',
  [Activity.ARTS_CENTRE]: 'Centre d’art',
  [Activity.BOOKSTORE]: 'Librairie',
  [Activity.CINEMA]: 'Cinéma',
  [Activity.COMMUNITY_CENTRE]: 'Centre socio-culturel',
  [Activity.CREATIVE_ARTS_STORE]: 'Magasin d’arts créatifs',
  [Activity.CULTURAL_CENTRE]: 'Centre culturel',
  [Activity.DISTRIBUTION_STORE]: 'Magasin culturel',
  [Activity.FESTIVAL]: 'Festival',
  [Activity.GAMES_CENTRE]: 'Centre de jeux',
  [Activity.HERITAGE_SITE]: 'Centre patrimonial',
  [Activity.LIBRARY]: 'Bibliothèque et médiathèque',
  [Activity.MUSEUM]: 'Musée',
  [Activity.MUSIC_INSTRUMENT_STORE]: 'Magasin d’instruments',
  [Activity.NOT_ASSIGNED]: 'Non communiqué',
  [Activity.OTHER]: 'Autre lieu',
  [Activity.PERFORMANCE_HALL]: 'Salle de spectacle',
  [Activity.RECORD_STORE]: 'Disquaire',
  [Activity.SCIENCE_CENTRE]: 'Centre scientifique',
  [Activity.TOURIST_INFORMATION_CENTRE]: 'Office de tourisme',
}

export const parseActivity = (activity: Activity | null | undefined): string => {
  if (activity && activity in MAP_ACTIVITY_TO_LABEL) return MAP_ACTIVITY_TO_LABEL[activity]
  return MAP_ACTIVITY_TO_LABEL.OTHER
}

// Map the facetFilter (in search backend) to the category Icon
const MAP_ACTIVITY_TO_ICON: {
  [k in Activity]: React.FC<AccessibleIcon>
} = {
  [Activity.ART_GALLERY]: activityIcons.ArtGallery,
  [Activity.ART_SCHOOL]: activityIcons.ArtSchool,
  [Activity.ARTS_CENTRE]: activityIcons.Other,
  [Activity.BOOKSTORE]: activityIcons.Bookstore,
  [Activity.CINEMA]: activityIcons.Cinema,
  [Activity.COMMUNITY_CENTRE]: activityIcons.Other,
  [Activity.CREATIVE_ARTS_STORE]: activityIcons.ArtMaterial,
  [Activity.CULTURAL_CENTRE]: activityIcons.CulturalCentre,
  [Activity.DISTRIBUTION_STORE]: activityIcons.Store,
  [Activity.FESTIVAL]: activityIcons.Festival,
  [Activity.GAMES_CENTRE]: activityIcons.Games,
  [Activity.HERITAGE_SITE]: activityIcons.HeritageSite,
  [Activity.LIBRARY]: activityIcons.Library,
  [Activity.MUSEUM]: activityIcons.Museum,
  [Activity.MUSIC_INSTRUMENT_STORE]: activityIcons.MusicInstrumentStore,
  [Activity.NOT_ASSIGNED]: activityIcons.Other,
  [Activity.OTHER]: activityIcons.Other,
  [Activity.PERFORMANCE_HALL]: activityIcons.Opera,
  [Activity.RECORD_STORE]: activityIcons.RecordStore,
  [Activity.SCIENCE_CENTRE]: activityIcons.ScienceCentre,
  [Activity.TOURIST_INFORMATION_CENTRE]: activityIcons.Other,
}

export const mapActivityToIcon = (activity: Activity | null): React.FC<AccessibleIcon> => {
  if (activity && activity in MAP_ACTIVITY_TO_ICON) return MAP_ACTIVITY_TO_ICON[activity]
  return activityIcons.Other
}
