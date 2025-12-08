import { Activity } from 'api/gen'
import { activitiesIconNameMapping } from 'features/venueMap/helpers/activitiesMapping/activitiesMapping'

export const getActivityIconName = (selected: boolean, activity?: Activity | null) => {
  const activityIcon = activity ? activitiesIconNameMapping[activity] : null
  const iconName = activityIcon ? `map_pin_${activityIcon}` : 'map_pin_center'
  if (selected) {
    return `${iconName}_selected`
  }
  return iconName
}
