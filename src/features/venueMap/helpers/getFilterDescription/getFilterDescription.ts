import { Activity } from 'api/gen'
import { FILTERS_ACTIVITY_MAPPING } from 'features/venueMap/constant'
import { MAP_ACTIVITY_TO_LABEL } from 'libs/parsers/activity'

export function getFilterDescription(
  filterGroup: 'OUTINGS' | 'SHOPS' | 'OTHERS',
  venueFilters: Activity[]
) {
  const activitiesGroup: Activity[] = FILTERS_ACTIVITY_MAPPING[filterGroup].filter(
    (item): item is Activity => item in MAP_ACTIVITY_TO_LABEL
  )

  const selectedActivitiesGroup = activitiesGroup.filter((type) => venueFilters.includes(type))

  return selectedActivitiesGroup.length === activitiesGroup.length
    ? 'Tout'
    : selectedActivitiesGroup.map((type) => MAP_ACTIVITY_TO_LABEL[type]).join(', ')
}
