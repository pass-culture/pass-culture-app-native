import { t } from '@lingui/macro'
import debounce from 'lodash.debounce'
import React, { useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { SearchView } from 'features/search/enums'
import { useSearchView } from 'features/search/pages/SearchWrapper'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Spacer } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

import { SuggestedPlaces } from './SuggestedPlaces'

const SEARCH_DEBOUNCE_MS = 500

const RightIcon: React.FC<{ value: string; onPress: () => void }> = (props) =>
  props.value.length > 0 ? (
    <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={props.onPress}>
      <Invalidate size={24} />
    </TouchableOpacity>
  ) : null

export const LocationPicker: React.FC = () => {
  const { setSearchView } = useSearchView()

  const [value, setValue] = useState<string>('')
  const [debouncedValue, setDebouncedValue] = useState<string>(value)
  const debouncedSetValue = useRef(debounce(setDebouncedValue, SEARCH_DEBOUNCE_MS)).current

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
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={18} />
      <StyledInput>
        <SearchInput
          value={value}
          onChangeText={onChangeText}
          placeholder={t`Saisir une adresse...`}
          autoFocus={true}
          inputHeight="tall"
          RightIcon={() => <RightIcon value={value} onPress={resetSearch} />}
        />
      </StyledInput>
      <Spacer.Column numberOfSpaces={4} />
      <SuggestedPlaces query={debouncedValue} />

      <PageHeader
        title={t`Choisir un lieu`}
        onGoBack={() => setSearchView(SearchView.LOCATION_FILTERS)}
      />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const StyledInput = styled.View({ alignItems: 'center', marginHorizontal: getSpacing(6) })
