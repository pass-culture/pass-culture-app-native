import { FilterGroupKey } from 'features/venueMap/types'

export type VenueMapFiltersModalStackParamList = {
  VenueMapFiltersList: undefined
  VenueMapActivityFilter: { title: string; filterGroup: FilterGroupKey }
}
