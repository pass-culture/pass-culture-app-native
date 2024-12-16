import { SearchGroupNameEnumv2 } from 'api/gen'
import { EVERY_CATEGORIES } from 'features/search/constants'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'

export const useSearchGroupLabel = (searchGroupName: SearchGroupNameEnumv2): string => {
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  return searchGroupLabelMapping[searchGroupName] || EVERY_CATEGORIES
}
