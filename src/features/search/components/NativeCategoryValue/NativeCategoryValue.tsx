import React from 'react'
import styled from 'styled-components/native'

import { NativeCategoryIdEnumv2, SubcategoriesResponseModelv2 } from 'api/gen'
import { getNativeCategoryFromEnum } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { Typo } from 'ui/theme'

interface NativeCategoryValueProps {
  nativeCategoryId: NativeCategoryIdEnumv2
  data?: SubcategoriesResponseModelv2
}

export const NativeCategoryValue = ({ nativeCategoryId, data }: NativeCategoryValueProps) => {
  const { value } = getNativeCategoryFromEnum(data, nativeCategoryId) || {}

  return value ? (
    <Body ellipsizeMode="tail" numberOfLines={1} testID="native-category-value">
      {value}
    </Body>
  ) : null
}

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
