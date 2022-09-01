import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import { ScrollView, StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'
import { MAX_PRICE } from 'features/search/pages/reducer.helpers'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { SearchState, SearchView } from 'features/search/types'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { useSafeState } from 'libs/hooks'
import { Form } from 'ui/components/Form'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { TextInput } from 'ui/components/inputs/TextInput'
import { getSpacing, Spacer } from 'ui/theme'

// 3 integers max separate by a dot or point with 2 decimals max
const priceRegex = /^\d{1,3}(?:[,.]\d{0,2})?$/

export const SearchPrice: FunctionComponent = () => {
  const logUseFilter = useLogFilterOnce(SectionTitle.Price)
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState, dispatch } = useSearch()
  const [selectedMinPrice, setSelectedMinPrice] = useSafeState<string>(searchState?.minPrice || '')
  const [selectedMaxPrice, setSelectedMaxPrice] = useSafeState<string>(searchState?.maxPrice || '')

  const onSearchPress = () => {
    logUseFilter()
    let additionalSearchState: SearchState = {
      ...searchState,
      priceRange: null,
      minPrice: undefined,
      maxPrice: undefined,
    }

    if (selectedMinPrice) {
      dispatch({ type: 'SET_MIN_PRICE', payload: selectedMinPrice })
      additionalSearchState = { ...additionalSearchState, minPrice: selectedMinPrice }
    }
    if (selectedMaxPrice) {
      dispatch({ type: 'SET_MAX_PRICE', payload: selectedMaxPrice })
      additionalSearchState = { ...additionalSearchState, maxPrice: selectedMaxPrice }
    }

    navigate(
      ...getTabNavConfig('Search', {
        ...additionalSearchState,
        view: SearchView.Results,
      })
    )
  }

  const onResetPress = () => {
    setSelectedMinPrice('')
    setSelectedMaxPrice('')
  }

  const onChangeMinPrice = (price: string) => {
    if (priceRegex.test(price) || price === '') {
      setSelectedMinPrice(price)
    }
  }

  const onChangeMaxPrice = (price: string) => {
    if (priceRegex.test(price) || price === '') {
      setSelectedMaxPrice(price)
    }
  }

  const goBack = useCallback(() => {
    navigate(
      ...getTabNavConfig('Search', {
        ...searchState,
        view: SearchView.Results,
      })
    )
  }, [navigate, searchState])

  const titleID = uuidv4()
  const minPriceInputId = uuidv4()
  const maxPriceInputId = uuidv4()
  return (
    <Container>
      <PageHeader
        titleID={titleID}
        title="Prix"
        background="primary"
        withGoBackButton
        onGoBack={goBack}
      />
      <Spacer.Column numberOfSpaces={6} />
      {/* https://stackoverflow.com/questions/29685421/hide-keyboard-in-react-native */}
      <StyledScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={getScrollViewContentContainerStyle()}>
        <Form.MaxWidth>
          <TextInput
            autoComplete="off" // disable autofill on android
            autoCapitalize="none"
            isError={false}
            keyboardType="numeric"
            label="Prix minimum (en €)"
            value={selectedMinPrice}
            onChangeText={onChangeMinPrice}
            textContentType="none" // disable autofill on iOS
            accessibilityDescribedBy={minPriceInputId}
            testID="Entrée pour le prix minimum"
            placeholder="0"
          />
          <Spacer.Column numberOfSpaces={6} />
          <TextInput
            autoComplete="off" // disable autofill on android
            autoCapitalize="none"
            isError={false}
            keyboardType="numeric"
            label="Prix maximum (en €)"
            value={selectedMaxPrice}
            onChangeText={onChangeMaxPrice}
            textContentType="none" // disable autofill on iOS
            accessibilityDescribedBy={maxPriceInputId}
            testID="Entrée pour le prix maximum"
            rightLabel={`max : ${MAX_PRICE} €`}
            placeholder={`${MAX_PRICE}`}
          />
        </Form.MaxWidth>
      </StyledScrollView>

      <FilterPageButtons onSearchPress={onSearchPress} onResetPress={onResetPress} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const getScrollViewContentContainerStyle = (): StyleProp<ViewStyle> => ({
  flexDirection: 'column',
  alignItems: 'center',
})

const StyledScrollView = styled(ScrollView)({
  flexGrow: 1,
  paddingHorizontal: getSpacing(6),
})
