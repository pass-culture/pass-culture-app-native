import { t } from '@lingui/macro'

import { SearchGroupNameEnum } from 'api/gen'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'

export const useSearchGroupLabel = (searchGroupName: SearchGroupNameEnum): string => {
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  return searchGroupLabelMapping[searchGroupName] || t`Toutes les catégories`
}
