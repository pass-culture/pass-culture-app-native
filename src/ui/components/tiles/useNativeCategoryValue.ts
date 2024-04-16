import { NativeCategoryIdEnumv2 } from 'api/gen'
import { getNativeCategoryFromEnum } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { useSubcategories } from 'libs/subcategories/useSubcategories'

type NativeCategoryValueProps = {
  nativeCategoryId: NativeCategoryIdEnumv2
}

export function useNativeCategoryValue({ nativeCategoryId }: NativeCategoryValueProps) {
  const { data } = useSubcategories()
  const { value } = getNativeCategoryFromEnum(data, nativeCategoryId) ?? {}
  return value
}
