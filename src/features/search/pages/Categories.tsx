import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useRef } from 'react'
import { ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { CATEGORY_CRITERIA } from 'libs/algolia/enums'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

const ALL = 'ALL'
export const DEBOUNCED_CALLBACK = 200

export const useSelectCategory = (callback: () => void) => {
  const { searchState, dispatch } = useStagedSearch()
  const debouncedCallback = useRef(debounce(callback, DEBOUNCED_CALLBACK)).current

  return {
    isCategorySelected: (category: string) => {
      const [selectedCategory] = [...searchState.offerCategories, ALL]
      return selectedCategory === category
    },
    selectCategory: (category: string) => () => {
      const payload = category === ALL ? [] : [category]
      dispatch({ type: 'SET_CATEGORY', payload })
      debouncedCallback()
    },
  }
}

export const Categories: React.FC = () => {
  const { goBack } = useNavigation()
  const { isCategorySelected, selectCategory } = useSelectCategory(goBack)

  return (
    <React.Fragment>
      <ScrollView contentContainerStyle={contentContainerStyle}>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={16} />

        {Object.entries(CATEGORY_CRITERIA).map(([category, { label, icon: Icon }]) => {
          const isSelected = isCategorySelected(category)
          const color2 = isSelected ? ColorsEnum.PRIMARY : ColorsEnum.SECONDARY
          const textColor = isSelected ? ColorsEnum.PRIMARY : ColorsEnum.BLACK

          return (
            <LabelContainer key={category} onPress={selectCategory(category)} testID={category}>
              <Spacer.Row numberOfSpaces={4} />
              <Icon size={getSpacing(12)} color={ColorsEnum.PRIMARY} color2={color2} />
              <Spacer.Row numberOfSpaces={2} />
              <Typo.ButtonText numberOfLines={2} color={textColor}>
                {label}
              </Typo.ButtonText>
              <Spacer.Flex />
              {isSelected && <Validate color={ColorsEnum.PRIMARY} size={getSpacing(8)} />}
            </LabelContainer>
          )
        })}
      </ScrollView>

      <PageHeader title={t`Catégories`} />
    </React.Fragment>
  )
}

const contentContainerStyle: ViewStyle = { flexGrow: 1, marginRight: getSpacing(6) }

const LabelContainer = styled.TouchableOpacity.attrs({
  activeOpacity: ACTIVE_OPACITY,
})({
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: getSpacing(4),
})
