import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useRef } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnum } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { getSpacing, Spacer } from 'ui/theme'
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
  const titleID = uuidv4()
  return (
    <Container>
      <PageHeader titleID={titleID} title={t`Catégories`} />
      <StyledScrollView accessibilityRole="radiogroup" aria-labelledby={titleID}>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={16} />
        <VerticalUl>
          {Object.entries(CATEGORY_CRITERIA).map(([category, { icon: Icon }]) => {
            const searchGroup = category as SearchGroupNameEnum
            return (
              <Li key={searchGroup}>
                <RadioButton
                  label={searchGroupLabelMapping[searchGroup]}
                  isSelected={isCategorySelected(searchGroup)}
                  onSelect={selectCategory(searchGroup)}
                  testID={searchGroup}
                  marginVertical={getSpacing(3)}
                  icon={Icon}
                />
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
  paddingHorizontal: getSpacing(4),
})
