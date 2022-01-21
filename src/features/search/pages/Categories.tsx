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
import { Validate } from 'ui/svg/icons/Validate'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { ColorsEnum } from 'ui/theme/colors'
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
      <ScrollView contentContainerStyle={contentContainerStyle}>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={16} />

        {Object.entries(CATEGORY_CRITERIA).map(([category, { icon: Icon }]) => {
          const searchGroup = category as SearchGroupNameEnum
          const isSelected = isCategorySelected(searchGroup)
          const color2 = isSelected ? ColorsEnum.PRIMARY : ColorsEnum.SECONDARY
          const textColor = isSelected ? ColorsEnum.PRIMARY : ColorsEnum.BLACK

          return (
            <LabelContainer
              key={searchGroup}
              onPress={selectCategory(searchGroup)}
              testID={searchGroup}>
              <Spacer.Row numberOfSpaces={4} />
              <Icon size={getSpacing(9)} color={ColorsEnum.PRIMARY} color2={color2} />
              <Spacer.Row numberOfSpaces={4} />
              <Typo.ButtonText numberOfLines={2} color={textColor}>
                {searchGroupLabelMapping[searchGroup]}
              </Typo.ButtonText>
              <Spacer.Flex />
              {!!isSelected && <Validate color={ColorsEnum.PRIMARY} size={getSpacing(6)} />}
            </LabelContainer>
          )
        })}
      </ScrollView>

      <PageHeader title={t`Catégories`} />
    </Container>
  )
}

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
  marginBottom: getSpacing(4),
})
