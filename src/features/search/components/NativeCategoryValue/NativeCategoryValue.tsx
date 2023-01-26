import React from 'react'
import styled from 'styled-components/native'

import { NativeCategoryIdEnumv2 } from 'api/gen'
import { getNativeCategoryFromEnum } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { Typo } from 'ui/theme'

interface NativeCategoryValueProps {
  nativeCategoryId: NativeCategoryIdEnumv2
}

export const NativeCategoryValue = ({ nativeCategoryId }: NativeCategoryValueProps) => {
  const { data } = useSubcategories()
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
