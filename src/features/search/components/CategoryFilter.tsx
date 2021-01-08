import React from 'react'
import { Hit } from 'react-instantsearch-core'
import { connectRefinementList } from 'react-instantsearch-native'
import styled from 'styled-components/native'

import { AlgoliaCategory } from 'libs/algolia'
import { CheckboxInput } from 'ui/components/inputs/CheckboxInput'
import { Typo, getSpacing } from 'ui/theme'

interface Props {
  items: Array<Hit<{ count: number; isRefined: boolean; label: string; value: string[] }>>
  isFromSearch: boolean
  refine: any
  searchForItems: any
  createURL: any
  currentRefinement: any
}

const CategoryFilterComponent: React.FC<Props> = ({ refine, currentRefinement }) => {
  const selectedCategories = new Set(currentRefinement)

  const onCheck = (category: string) => {
    if (selectedCategories.has(category)) {
      refine(currentRefinement.filter((c: string) => c !== category))
    } else {
      refine([...currentRefinement, category])
    }
  }

  return (
    <Container>
      {Object.keys(AlgoliaCategory).map((category) => (
        <StyledCheckBox key={category}>
          <CheckboxInput
            isChecked={selectedCategories.has(category)}
            setIsChecked={() => onCheck(category)}
          />
          <CheckBoxText>{category}</CheckBoxText>
        </StyledCheckBox>
      ))}
    </Container>
  )
}

const Container = styled.View({})

const CheckBoxText = styled(Typo.Body)({
  alignSelf: 'center',
  paddingLeft: getSpacing(4),
  paddingRight: getSpacing(20),
})

const StyledCheckBox = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  padding: getSpacing(1),
})

export const CategoryFilter = connectRefinementList(CategoryFilterComponent)
