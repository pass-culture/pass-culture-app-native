import React from 'react'
import styled from 'styled-components/native'

import { NativeCategoryIdEnumv2, SubcategoriesResponseModelv2 } from 'api/gen'
import { getNativeCategoryValue } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { Typo } from 'ui/theme'

interface NativeCategoryValueProps {
  nativeCategoryId: NativeCategoryIdEnumv2
  data: SubcategoriesResponseModelv2 | undefined
}

export const NativeCategoryValue = ({ nativeCategoryId, data }: NativeCategoryValueProps) => {
  const nativeCategoryValue = getNativeCategoryValue(data, nativeCategoryId)

  return (nativeCategoryValue?.length ?? 0) > 0 ? (
    <Body ellipsizeMode="tail" numberOfLines={1} testID="native-category-value">
      {nativeCategoryValue}
    </Body>
  ) : null
}

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
