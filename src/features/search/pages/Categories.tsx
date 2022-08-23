import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useSafeState } from 'libs/hooks'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Li } from 'ui/components/Li'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { VerticalUl } from 'ui/components/Ul'
import { Again } from 'ui/svg/icons/Again'
import { getSpacing, Spacer } from 'ui/theme'

export const Categories: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState, dispatch } = useSearch()
  const [selectedCategory, setSelectedCategory] = useSafeState<SearchGroupNameEnumv2>(
    searchState?.offerCategories?.[0] || SearchGroupNameEnumv2.NONE
  )

  const selectCategory = (category: SearchGroupNameEnumv2) => () => {
    setSelectedCategory(category)
  }

  const isCategorySelected = (category: SearchGroupNameEnumv2) => {
    return selectedCategory === category
  }

  const onResetPress = () => {
    setSelectedCategory(SearchGroupNameEnumv2.NONE)
  }

  const onSearchPress = () => {
    const payload = selectedCategory === SearchGroupNameEnumv2.NONE ? [] : [selectedCategory]
    dispatch({ type: 'SET_CATEGORY', payload })
    navigate(
      ...getTabNavConfig('Search', {
        ...searchState,
        offerCategories: payload,
      })
    )
  }

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
        <ResetButton wording="Réinitialiser" icon={Again} onPress={onResetPress} />
        <SearchButton wording="Rechercher" onPress={onSearchPress} />
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
