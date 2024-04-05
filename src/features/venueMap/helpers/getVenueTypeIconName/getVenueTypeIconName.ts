import { venueTypesIconNameMapping } from 'features/venueMap/helpers/venueTypesMapping/venueTypesMapping'
import { VenueTypeCode } from 'libs/parsers/venueType'

export const getVenueTypeIconName = (selected: boolean, venueType?: VenueTypeCode | null) => {
  const iconName = venueType ? `map_pin_${venueTypesIconNameMapping[venueType]}` : 'map_pin'
  if (selected) {
    return `${iconName}_selected`
  }
  return iconName
}
