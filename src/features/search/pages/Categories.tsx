import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useRef } from 'react'
import { ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnum } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Validate as DefaultValidate } from 'ui/svg/icons/Validate'
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
      <ScrollView contentContainerStyle={contentContainerStyle}>
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
                <LabelContainer onPress={selectCategory(searchGroup)} testID={searchGroup}>
                  <Spacer.Row numberOfSpaces={4} />
                  <StyledIcon />
                  <Spacer.Row numberOfSpaces={4} />
                  <ButtonText numberOfLines={2} isSelected={isSelected}>
                    {searchGroupLabelMapping[searchGroup]}
                  </ButtonText>
                  <Spacer.Flex />
                  {!!isSelected && <Validate />}
                </LabelContainer>
              </Li>
            )
          })}
        </VerticalUl>
      </ScrollView>
    </Container>
  )
}

const Validate = styled(DefaultValidate).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))``

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const contentContainerStyle: ViewStyle = { flexGrow: 1, marginRight: getSpacing(6) }

const LabelContainer = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: getSpacing(6),
})

const ButtonText = styled(Typo.ButtonText)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected ? theme.colors.primary : theme.colors.black,
}))
