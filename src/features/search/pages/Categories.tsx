import { t } from '@lingui/macro'
import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Again } from 'ui/svg/icons/Again'
import { getSpacing, Spacer } from 'ui/theme'
import { Li } from 'ui/web/list/Li'
import { VerticalUl } from 'ui/web/list/Ul'

const useSelectCategory = () => {
  const { searchState, dispatch } = useStagedSearch()

  return {
    isCategorySelected(category: SearchGroupNameEnumv2) {
      const [selectedCategory] = [...searchState.offerCategories, SearchGroupNameEnumv2.NONE]
      return selectedCategory === category
    },
    selectCategory: (category: SearchGroupNameEnumv2) => () => {
      const payload = category === SearchGroupNameEnumv2.NONE ? [] : [category]
      dispatch({ type: 'SET_CATEGORY', payload })
    },
  }
}

export const Categories: React.FC = () => {
  const { isCategorySelected, selectCategory } = useSelectCategory()
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const titleID = uuidv4()
  return (
    <Container>
      <PageHeader titleID={titleID} title={t`Catégories`} background="primary" withGoBackButton />
      <StyledScrollView accessibilityRole={AccessibilityRole.RADIOGROUP} aria-labelledby={titleID}>
        <Spacer.Column numberOfSpaces={4} />
        <VerticalUl>
          {Object.entries(CATEGORY_CRITERIA).map(([category, { icon: Icon }]) => {
            const searchGroup = category as SearchGroupNameEnumv2
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
      <BottomButtonsContainer>
        <ResetButton wording="Réinitialiser" icon={Again} />
        <SearchButton wording="Rechercher" />
      </BottomButtonsContainer>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const StyledScrollView = styled(ScrollView)({
  flexGrow: 1,
  paddingHorizontal: getSpacing(6),
})

const BottomButtonsContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
  padding: getSpacing(6),
  paddingTop: getSpacing(2),
})

const ResetButton = styledButton(ButtonQuaternaryBlack)({
  width: 'auto',
  marginRight: getSpacing(4),
})

const SearchButton = styledButton(ButtonPrimary)({
  flexGrow: 1,
  width: 'auto',
})
