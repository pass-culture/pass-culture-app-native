import { t } from '@lingui/macro'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'

export const useSearchGroupLabel = (searchGroupName: SearchGroupNameEnumv2): string => {
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  return searchGroupLabelMapping[searchGroupName] || t`Toutes les catégories`
}
