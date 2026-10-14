import {
  DatePreset,
  FreeDigitalPlaylist,
  FreeDigitalPlaylistId,
} from 'features/generalPublicHome/types'

export const GENERAL_PUBLIC_HOME_ENTRY_ID = 'generalPublicHome'

export const DATE_PRESETS: { preset: DatePreset; label: string }[] = [
  { preset: 'today', label: 'Aujourd’hui' },
  { preset: 'tomorrow', label: 'Demain' },
  { preset: 'thisWeek', label: 'Cette semaine' },
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
