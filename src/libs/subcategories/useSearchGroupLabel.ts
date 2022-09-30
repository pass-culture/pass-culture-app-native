import { SearchGroupNameEnumv2 } from 'api/gen'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'

export const useSearchGroupLabel = (searchGroupName: SearchGroupNameEnumv2): string => {
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  return searchGroupLabelMapping[searchGroupName] || 'Toutes les catégories'
}
