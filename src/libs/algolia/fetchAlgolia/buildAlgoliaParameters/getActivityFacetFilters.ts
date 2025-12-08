import { ACTIVITY_CRITERIA } from 'features/search/enums'

export const getActivityFacetFilters = (activityLabel: string | null): string => {
  const activity = Object.values(ACTIVITY_CRITERIA).find(({ label }) => label === activityLabel)
  return activity ? activity.facetFilter : ''
}
