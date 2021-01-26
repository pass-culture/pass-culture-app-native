import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useSearch } from 'features/search/pages/SearchWrapper'
import { CATEGORY_CRITERIA } from 'libs/algolia/enums'
import { _ } from 'libs/i18n'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { Validate } from 'ui/svg/icons/Validate'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

const ALL = 'ALL'

export const Categories: React.FC = () => {
  const { searchState, dispatch } = useSearch()
  const [selectedCategory] = [...searchState.offerCategories, ALL]

  const selectCategory = (category: string) => {
    const payload = category === ALL ? [] : [category]
    dispatch({ type: 'SET_CATEGORY', payload })
  }

  return (
    <React.Fragment>
      <React.Fragment>
        <Container>
          <Spacer.TopScreen />
          <Spacer.Column numberOfSpaces={16} />

          {Object.entries(CATEGORY_CRITERIA).map(([category, { label, icon: Icon }]) => {
            const isSelected = selectedCategory === category
            const color2 = isSelected ? ColorsEnum.PRIMARY : ColorsEnum.SECONDARY
            const textColor = isSelected ? ColorsEnum.PRIMARY : ColorsEnum.BLACK

            return (
              <LabelContainer key={category} onPress={() => selectCategory(category)}>
                <Spacer.Row numberOfSpaces={4} />
                <Icon size={getSpacing(12)} color={ColorsEnum.PRIMARY} color2={color2} />
                <Spacer.Row numberOfSpaces={2} />
                <Typo.ButtonText color={textColor}>{label}</Typo.ButtonText>
                <Spacer.Flex />
                {isSelected && <Validate color={ColorsEnum.PRIMARY} size={getSpacing(8)} />}
                <Spacer.Row numberOfSpaces={6} />
              </LabelContainer>
            )
          })}

          <Spacer.Column numberOfSpaces={30} />
        </Container>
      </React.Fragment>

      <PageHeader title={_(t`Catégories`)} />
    </React.Fragment>
  )
}

const Container = styled.ScrollView({ flex: 1 })

const LabelContainer = styled.TouchableOpacity.attrs({
  activeOpacity: ACTIVE_OPACITY,
})({
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: getSpacing(4),
})
