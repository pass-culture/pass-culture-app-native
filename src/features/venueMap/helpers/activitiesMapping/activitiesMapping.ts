import { Activity } from 'api/gen'
import { MAP_ACTIVITY_TO_LABEL } from 'libs/parsers/activity'

export const activitiesMapping = {
  trip: {
    title: 'Sorties',
    children: {
      [Activity.ART_GALLERY]: MAP_ACTIVITY_TO_LABEL[Activity.ART_GALLERY],
      [Activity.CINEMA]: MAP_ACTIVITY_TO_LABEL[Activity.CINEMA],
      [Activity.FESTIVAL]: MAP_ACTIVITY_TO_LABEL[Activity.FESTIVAL],
      [Activity.GAMES_CENTRE]: MAP_ACTIVITY_TO_LABEL[Activity.GAMES_CENTRE],
      [Activity.LIBRARY]: MAP_ACTIVITY_TO_LABEL[Activity.LIBRARY],
      [Activity.MUSEUM]: MAP_ACTIVITY_TO_LABEL[Activity.MUSEUM],
      [Activity.PERFORMANCE_HALL]: MAP_ACTIVITY_TO_LABEL[Activity.PERFORMANCE_HALL],
    },
  },
  shop: {
    title: 'Boutiques',
    children: {
      [Activity.BOOKSTORE]: MAP_ACTIVITY_TO_LABEL[Activity.BOOKSTORE],
      [Activity.CREATIVE_ARTS_STORE]: MAP_ACTIVITY_TO_LABEL[Activity.CREATIVE_ARTS_STORE],
      [Activity.DISTRIBUTION_STORE]: MAP_ACTIVITY_TO_LABEL[Activity.DISTRIBUTION_STORE],
      [Activity.MUSIC_INSTRUMENT_STORE]: MAP_ACTIVITY_TO_LABEL[Activity.MUSIC_INSTRUMENT_STORE],
      [Activity.RECORD_STORE]: MAP_ACTIVITY_TO_LABEL[Activity.RECORD_STORE],
    },
  },
  other: {
    title: 'Autres',
    children: {
      [Activity.ART_SCHOOL]: MAP_ACTIVITY_TO_LABEL[Activity.ART_SCHOOL],
      [Activity.ARTS_CENTRE]: MAP_ACTIVITY_TO_LABEL[Activity.ARTS_CENTRE],
      [Activity.COMMUNITY_CENTRE]: MAP_ACTIVITY_TO_LABEL[Activity.COMMUNITY_CENTRE],
      [Activity.CULTURAL_CENTRE]: MAP_ACTIVITY_TO_LABEL[Activity.CULTURAL_CENTRE],
      [Activity.HERITAGE_SITE]: MAP_ACTIVITY_TO_LABEL[Activity.HERITAGE_SITE],
      [Activity.OTHER]: MAP_ACTIVITY_TO_LABEL[Activity.OTHER],
      [Activity.SCIENCE_CENTRE]: MAP_ACTIVITY_TO_LABEL[Activity.SCIENCE_CENTRE],
      [Activity.TOURIST_INFORMATION_CENTRE]:
        MAP_ACTIVITY_TO_LABEL[Activity.TOURIST_INFORMATION_CENTRE],
    },
  },
}

export const activitiesIconNameMapping = {
  [Activity.ART_GALLERY]: 'visual_art',
  [Activity.ART_SCHOOL]: 'art_classes',
  [Activity.ARTS_CENTRE]: 'center',
  [Activity.BOOKSTORE]: 'bookstore',
  [Activity.CINEMA]: 'cinema',
  [Activity.COMMUNITY_CENTRE]: 'center',
  [Activity.CREATIVE_ARTS_STORE]: 'art_material',
  [Activity.CULTURAL_CENTRE]: 'center',
  [Activity.DISTRIBUTION_STORE]: 'cultural_store',
  [Activity.FESTIVAL]: 'music_live',
  [Activity.GAMES_CENTRE]: 'game',
  [Activity.HERITAGE_SITE]: 'tourism',
  [Activity.LIBRARY]: 'library',
  [Activity.MUSEUM]: 'museum',
  [Activity.MUSIC_INSTRUMENT_STORE]: 'instrument_store',
  [Activity.NOT_ASSIGNED]: 'center',
  [Activity.OTHER]: 'center',
  [Activity.PERFORMANCE_HALL]: 'music_live',
  [Activity.RECORD_STORE]: 'music_store',
  [Activity.SCIENCE_CENTRE]: 'science',
  [Activity.TOURIST_INFORMATION_CENTRE]: 'center',
}
