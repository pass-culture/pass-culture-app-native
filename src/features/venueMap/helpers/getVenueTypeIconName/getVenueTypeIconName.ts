import { VenueTypeCodeKey } from 'api/gen'
import { venueTypesIconNameMapping } from 'features/venueMap/helpers/venueTypesMapping/venueTypesMapping'

export const getVenueTypeIconName = (selected: boolean, venueType?: VenueTypeCodeKey | null) => {
  const venueTypeIcon = venueType ? venueTypesIconNameMapping[venueType] : null
  const iconName = venueTypeIcon ? `map_pin_${venueTypeIcon}` : 'map_pin_center'
  if (selected) {
    return `${iconName}_selected`
  }
  return iconName
}
