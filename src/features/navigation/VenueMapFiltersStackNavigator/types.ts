import { FilterGroupKey } from 'features/venueMap/types'

export type VenueMapFiltersModalStackParamList = {
  VenueMapFiltersList: undefined
  VenueMapTypeFilter: { title: string; filterGroup: FilterGroupKey }
}
