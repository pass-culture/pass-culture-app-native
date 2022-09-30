import debounce from 'lodash/debounce'
import React, { useRef, useState } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { PageHeader } from 'ui/components/headers/PageHeader'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { getSpacing, Spacer } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { SuggestedPlaces } from './SuggestedPlaces'

const SEARCH_DEBOUNCE_MS = 500

export const LocationPicker: React.FC = () => {
  const [value, setValue] = useState<string>('')
  const [debouncedValue, setDebouncedValue] = useState<string>(value)
  const debouncedSetValue = useRef(debounce(setDebouncedValue, SEARCH_DEBOUNCE_MS)).current
  const accessibilityDescribedBy = uuidv4()
  const titleID = uuidv4()

  const resetSearch = () => {
    setValue('')
    setDebouncedValue('')
  }

  const onChangeText = (newValue: string) => {
    setValue(newValue)
    debouncedSetValue(newValue)
  }

  return (
    <Container>
      <PageHeader titleID={titleID} title="Choisir un lieu" background="primary" withGoBackButton />
      <Spacer.Column numberOfSpaces={6} />
      <StyledInput>
        <HiddenAccessibleText {...getHeadingAttrs(1)}>
          Recherche une adresse, un lieu...
        </HiddenAccessibleText>
        <SearchInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Saisis une adresse ou le nom d’un lieu"
          autoFocus={true}
          inputHeight="regular"
          accessibilityLabel="Recherche un lieu, une adresse"
          onPressRightIcon={resetSearch}
          accessibilityDescribedBy={accessibilityDescribedBy}
        />
      </StyledInput>
      <HiddenAccessibleText nativeID={accessibilityDescribedBy}>
        Indique un lieu pour découvrir toutes les offres de ce lieu puis clique sur le lieu pour
        valider ton choix
      </HiddenAccessibleText>
      <Spacer.Column numberOfSpaces={4} />
      <SuggestedPlaces query={debouncedValue} accessibilityLabelledBy={titleID} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const StyledInput = styled.View({ alignItems: 'center', marginHorizontal: getSpacing(6) })
