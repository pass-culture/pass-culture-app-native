import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'

export const getVenueSelectionHeaderMessage = (
  selectedLocationMode: LocationMode,
  place?: SuggestedPlace | null,
  venueName?: string
) => {
  switch (selectedLocationMode) {
    case LocationMode.AROUND_PLACE:
      return place?.label ? `Lieux à proximité de “${place?.label}”` : ''
    case LocationMode.EVERYWHERE:
      return venueName ? `Lieux à proximité de “${venueName}”` : ''
    case LocationMode.AROUND_ME:
      return 'Lieux disponibles autour de moi'
  }
}
