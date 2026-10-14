import { SearchGroupNameEnumv2 } from 'api/gen'
import {
  DatePreset,
  FreeDigitalPlaylist,
  FreeDigitalPlaylistId,
  Theme,
} from 'features/generalPublicHome/types'

export const GENERAL_PUBLIC_HOME_ENTRY_ID = 'generalPublicHome'

export const DATE_PRESETS: { preset: DatePreset; label: string }[] = [
  { preset: 'today', label: 'Aujourd’hui' },
  { preset: 'thisWeek', label: 'Cette semaine' },
  { preset: 'thisMonth', label: 'Ce mois-ci' },
]

export const THEMES: Theme[] = [
  {
    id: 'shows',
    label: 'Spectacles',
    categories: ['Spectacles'],
    searchGroup: SearchGroupNameEnumv2.SPECTACLES,
  },
  {
    id: 'outings',
    label: 'Sorties',
    categories: ['Concerts et festivals', 'Conférences et rencontres', 'Arts et loisirs créatifs'],
    searchGroup: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
  },
  {
    id: 'visits',
    label: 'Visites',
    categories: ['Musées et visites'],
    searchGroup: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
  },
  {
    id: 'cinema',
    label: 'Cinéma',
    categories: ['Cinéma'],
    searchGroup: SearchGroupNameEnumv2.CINEMA,
  },
]

export const CALENDAR_DAYS_COUNT = 14

export const FREE_EVENTS_DEFAULT_TITLE = 'Offres gratuites'

export const FREE_EVENTS_HITS_PER_PAGE = 20

// Same default as the location store's around me / around place radius
export const FREE_EVENTS_DEFAULT_AROUND_RADIUS_IN_KM = 50

export const FREE_DIGITAL_PLAYLISTS: Record<FreeDigitalPlaylistId, FreeDigitalPlaylist> = {
  podcasts: {
    title: 'À écouter',
    subtitle: 'Des podcasts gratuits',
    subcategories: ['Podcast'],
  },
  videos: {
    title: 'À regarder',
    subtitle: 'Des vidéos pour voyager sans bouger',
    subcategories: ['Vidéo à la demande', 'Visite virtuelle', 'Captation musicale'],
  },
}
