import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Keyboard, Text } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getNativeCategoryFromEnum } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { HistoryItem, SearchState, SearchView } from 'features/search/types'
import { useSearchGroupLabel } from 'libs/subcategories'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { Li } from 'ui/components/Li'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Typo, getSpacing } from 'ui/theme'

type Props = {
  item: HistoryItem
}

export function SearchHistoryItem({ item }: Props) {
  const { data } = useSubcategories()
  const { searchState } = useSearch()
  const { navigate } = useNavigation<UseNavigationType>()
  const searchGroupLabel = useSearchGroupLabel(
    item.category ? item.category : SearchGroupNameEnumv2.NONE
  )
  const nativeCategoryLabel = getNativeCategoryFromEnum(data, item.nativeCategory)?.value
  const shouldDisplaySearchGroupOrNativeCategory = Boolean(item.nativeCategory || item.category)

  const onPress = () => {
    Keyboard.dismiss()
    // When we hit enter, we may have selected a category or a venue on the search landing page
    // these are the two potentially 'staged' filters that we want to commit to the global search state.
    // We also want to commit the price filter, as beneficiary users may have access to different offer
    // price range depending on their available credit.
    const searchId = uuidv4()
    const newSearchState: SearchState = {
      ...searchState,
      query: item.query,
      view: SearchView.Results,
      searchId,
      isAutocomplete: true,
      offerGenreTypes: undefined,
      offerNativeCategories: item.nativeCategory ? [item.nativeCategory] : undefined,
      offerCategories: item.category ? [item.category] : [],
    }

    navigate(...getTabNavConfig('Search', newSearchState))
  }

  return (
    <StyledLi>
      <HistoryItemTouchable onPress={onPress}>
        <ClockIconContainer>
          <ClockFilledIcon />
        </ClockIconContainer>
        <StyledText numberOfLines={1}>
          <ItalicText>{item.query}</ItalicText>
          {!!shouldDisplaySearchGroupOrNativeCategory && (
            <React.Fragment>
              <ItalicText> dans </ItalicText>
              <BoldItalicText>{nativeCategoryLabel ?? searchGroupLabel}</BoldItalicText>
            </React.Fragment>
          )}
        </StyledText>
      </HistoryItemTouchable>
    </StyledLi>
  )
}

const StyledLi = styled(Li)({
  flex: 1,
})

const HistoryItemTouchable = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledText = styled(Text)({
  marginLeft: getSpacing(2),
  flex: 1,
})

const ItalicText = styled(Typo.Body)(({ theme }) => ({
  ...theme.typography.placeholder,
  color: theme.colors.black,
}))

const BoldItalicText = styled(Typo.Body)(({ theme }) => theme.typography.bodyBoldItalic)

const ClockIconContainer = styled.View({ flexShrink: 0 })

const ClockFilledIcon = styled(ClockFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.greyDark,
}))``
