import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useSearch } from 'features/search/pages/SearchWrapper'
import { CATEGORY_CRITERIA } from 'libs/algolia/enums'
import { _ } from 'libs/i18n'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { Validate } from 'ui/svg/icons/Validate'

export const Categories: React.FC = () => {
  const { searchState } = useSearch()
  const [selectedCategory] = [...searchState.offerCategories, 'All']

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
              <LabelContainer key={category}>
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
const LabelContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: getSpacing(4),
})
