import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { getNativeCategoryFromEnum } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { HistoryItem } from 'features/search/types'
import { useSearchGroupLabel } from 'libs/subcategories'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { Li } from 'ui/components/Li'
import { Typo, getSpacing } from 'ui/theme'

type Props = {
  item: HistoryItem
}

export function SearchHistoryItem({ item }: Props) {
  const { data } = useSubcategories()
  const searchGroupLabel = useSearchGroupLabel(
    item.category ? item.category : SearchGroupNameEnumv2.NONE
  )
  const nativeCategoryLabel = getNativeCategoryFromEnum(data, item.nativeCategory)?.value
  const shouldDisplaySearchGroupOrNativeCategory = !!(item.nativeCategory || item.category)

  return (
    <Li key={item.addedDate}>
      <HistoryItemTouchable>
        <StyledText numberOfLines={1} ellipsizeMode="tail">
          <StyledText>{item.query}</StyledText>
          {!!shouldDisplaySearchGroupOrNativeCategory && (
            <React.Fragment>
              <Typo.Body> dans </Typo.Body>
              <Typo.ButtonTextPrimary>
                {nativeCategoryLabel ? nativeCategoryLabel : searchGroupLabel}
              </Typo.ButtonTextPrimary>
            </React.Fragment>
          )}
        </StyledText>
      </HistoryItemTouchable>
    </Li>
  )
}

const HistoryItemTouchable = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: getSpacing(4),
})

const StyledText = styled(Text)({
  marginLeft: getSpacing(2),
})
