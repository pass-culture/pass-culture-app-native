import { venueTypesIconNameMapping } from 'features/venueMap/helpers/venueTypesMapping/venueTypesMapping'
import { VenueTypeCode } from 'libs/parsers/venueType'

export const getVenueTypeIconName = (selected: boolean, venueType?: VenueTypeCode | null) => {
  const venueTypeIcon = venueType ? venueTypesIconNameMapping[venueType] : null
  const iconName = venueTypeIcon ? `map_pin_${venueTypeIcon}` : 'map_pin_center'
  if (selected) {
    return `${iconName}_selected`
  }
  return iconName
}
