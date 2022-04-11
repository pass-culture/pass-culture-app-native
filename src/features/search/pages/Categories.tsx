import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useRef } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnum } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Validate } from 'ui/svg/icons/Validate'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { Li } from 'ui/web/list/Li'
import { VerticalUl } from 'ui/web/list/Ul'
const DEBOUNCED_CALLBACK = 200

const useSelectCategory = (callback: () => void) => {
  const { searchState, dispatch } = useStagedSearch()
  const debouncedCallback = useRef(debounce(callback, DEBOUNCED_CALLBACK)).current

  return {
    isCategorySelected: (category: SearchGroupNameEnum) => {
      const [selectedCategory] = [...searchState.offerCategories, SearchGroupNameEnum.NONE]
      return selectedCategory === category
    },
    selectCategory: (category: SearchGroupNameEnum) => () => {
      const payload = category === SearchGroupNameEnum.NONE ? [] : [category]
      dispatch({ type: 'SET_CATEGORY', payload })
      debouncedCallback()
    },
  }
}

export const Categories: React.FC = () => {
  const { goBack } = useNavigation()
  const { isCategorySelected, selectCategory } = useSelectCategory(goBack)
  const searchGroupLabelMapping = useSearchGroupLabelMapping()

  return (
    <Container>
      <PageHeader title={t`Catégories`} />
      <StyledScrollView>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={16} />
        <VerticalUl>
          {Object.entries(CATEGORY_CRITERIA).map(([category, { icon: Icon }]) => {
            const searchGroup = category as SearchGroupNameEnum
            const isSelected = isCategorySelected(searchGroup)
            const StyledIcon = styled(Icon).attrs(({ theme }) => ({
              color: theme.colors.primary,
              color2: isSelected ? theme.colors.primary : theme.colors.secondary,
              size: theme.icons.sizes.small,
            }))``

            return (
              <Li key={searchGroup}>
                <StyledTouchableOpacity
                  onPress={selectCategory(searchGroup)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  testID={searchGroup}>
                  <LabelContainer>
                    <StyledIcon />
                    <Spacer.Row numberOfSpaces={4} />
                    <Label isSelected={isSelected}>{searchGroupLabelMapping[searchGroup]}</Label>
                  </LabelContainer>
                  {!!isSelected && <ValidateIconPrimary />}
                </StyledTouchableOpacity>
              </Li>
            )
          })}
        </VerticalUl>
      </StyledScrollView>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const StyledScrollView = styled(ScrollView)({
  flexGrow: 1,
  marginLeft: getSpacing(4),
  marginRight: getSpacing(6),
})

const StyledTouchableOpacity = styled(TouchableOpacity)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: getSpacing(6),
  justifyContent: theme.isMobileViewport ? 'space-between' : undefined,
}))

const LabelContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: theme.isMobileViewport ? 0 : getSpacing(6),
}))

const Label = styled(Typo.ButtonText).attrs({
  numberOfLines: 2,
})<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected ? theme.colors.primary : theme.colors.black,
}))

const ValidateIconPrimary = styled(Validate).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))``
