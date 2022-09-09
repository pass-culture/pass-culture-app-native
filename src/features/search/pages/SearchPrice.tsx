import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import { ScrollView, StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAuthContext } from 'features/auth/AuthContext'
import { useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useUserProfileInfo } from 'features/profile/api'
import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'
import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel'
import { MAX_PRICE } from 'features/search/pages/reducer.helpers'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { SearchState, SearchView } from 'features/search/types'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { useSafeState } from 'libs/hooks'
import { formatToFrenchDecimal } from 'libs/parsers'
import { Banner } from 'ui/components/Banner'
import { Form } from 'ui/components/Form'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { TextInput } from 'ui/components/inputs/TextInput'
import { Separator } from 'ui/components/Separator'
import { getSpacing, Spacer } from 'ui/theme'

// 3 integers max separate by a dot or point with 2 decimals max
const priceRegex = /^\d{1,3}(?:[,.]\d{0,2})?$/

export const SearchPrice: FunctionComponent = () => {
  const logUsePriceFilter = useLogFilterOnce(SectionTitle.Price)
  const logUseFreeOffersFilter = useLogFilterOnce(SectionTitle.Free)
  const { navigate } = useNavigation<UseNavigationType>()
  const { isLoggedIn } = useAuthContext()
  const { data: user } = useUserProfileInfo()
  const { searchState, dispatch } = useSearch()
  const [selectedMinPrice, setSelectedMinPrice] = useSafeState<string>(searchState?.minPrice || '')
  const [selectedMaxPrice, setSelectedMaxPrice] = useSafeState<string>(searchState?.maxPrice || '')
  const availableCredit = useAvailableCredit()
  const formatAvailableCredit = availableCredit?.amount
    ? formatToFrenchDecimal(availableCredit.amount).slice(0, -2)
    : '0'

  const isLimitCreditSearchDefaultValue = searchState?.maxPrice === formatAvailableCredit
  const [isLimitCreditSearch, setIsLimitCreditSearch] = useSafeState<boolean>(
    isLimitCreditSearchDefaultValue
  )
  const isLoggedInAndBeneficiary = isLoggedIn && user?.isBeneficiary

  const isOnlyFreeOffersSearchDefaultValue = searchState?.offerIsFree ?? false
  const [isOnlyFreeOffersSearch, setIsOnlyFreeOffersSearch] = useSafeState<boolean>(
    isOnlyFreeOffersSearchDefaultValue
  )

  const onSearchPress = () => {
    const offerIsFree =
      isOnlyFreeOffersSearch || (selectedMaxPrice === '0' && selectedMinPrice === '')
    let additionalSearchState: SearchState = {
      ...searchState,
      priceRange: null,
      minPrice: undefined,
      maxPrice: undefined,
      offerIsFree,
    }

    if (selectedMinPrice) {
      dispatch({ type: 'SET_MIN_PRICE', payload: selectedMinPrice })
      additionalSearchState = { ...additionalSearchState, minPrice: selectedMinPrice }
    }
    if (selectedMaxPrice) {
      dispatch({ type: 'SET_MAX_PRICE', payload: selectedMaxPrice })
      additionalSearchState = { ...additionalSearchState, maxPrice: selectedMaxPrice }
    }

    if (offerIsFree) {
      dispatch({ type: 'TOGGLE_OFFER_FREE' })
      logUseFreeOffersFilter()
    } else {
      logUsePriceFilter()
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
    setIsLimitCreditSearch(false)
    setIsOnlyFreeOffersSearch(false)
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

  const toggleLimitCreditSearch = useCallback(() => {
    const toggleLimitCreditSearchValue = isLimitCreditSearch ? false : true
    setIsLimitCreditSearch(toggleLimitCreditSearchValue)

    if (toggleLimitCreditSearchValue) {
      setSelectedMaxPrice(formatAvailableCredit)
      setIsOnlyFreeOffersSearch(false)
      return
    }

    const availableCreditIsMaxPriceSearch = searchState?.maxPrice === formatAvailableCredit
    setSelectedMaxPrice(availableCreditIsMaxPriceSearch ? '' : searchState?.maxPrice || '')
  }, [
    formatAvailableCredit,
    isLimitCreditSearch,
    searchState?.maxPrice,
    setIsLimitCreditSearch,
    setIsOnlyFreeOffersSearch,
    setSelectedMaxPrice,
  ])

  const toggleOnlyFreeOffersSearch = useCallback(() => {
    const toggleOnlyFreeOffersSearchValue = isOnlyFreeOffersSearch ? false : true
    setIsOnlyFreeOffersSearch(toggleOnlyFreeOffersSearchValue)

    if (toggleOnlyFreeOffersSearchValue) {
      setSelectedMaxPrice('0')
      setSelectedMinPrice('0')
      setIsLimitCreditSearch(false)
      return
    }

    const maxPrice = searchState?.maxPrice !== '0' ? searchState?.maxPrice || '' : ''
    const minPrice = searchState?.minPrice !== '0' ? searchState?.minPrice || '' : ''

    setSelectedMaxPrice(maxPrice)
    setSelectedMinPrice(minPrice)
  }, [
    isOnlyFreeOffersSearch,
    searchState?.maxPrice,
    searchState?.minPrice,
    setIsLimitCreditSearch,
    setIsOnlyFreeOffersSearch,
    setSelectedMaxPrice,
    setSelectedMinPrice,
  ])

  const titleID = uuidv4()
  const minPriceInputId = uuidv4()
  const maxPriceInputId = uuidv4()
  const bannerTitle = `Il te reste ${formatAvailableCredit}\u00a0€ sur ton pass Culture.`
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
          {!!isLoggedInAndBeneficiary && (
            <BannerContainer testID="creditBanner">
              <Banner title={bannerTitle} />
              <Spacer.Column numberOfSpaces={6} />
            </BannerContainer>
          )}
          <FilterSwitchWithLabel
            isActive={isOnlyFreeOffersSearch}
            toggle={toggleOnlyFreeOffersSearch}
            label="Uniquement les offres gratuites"
            testID="onlyFreeOffers"
          />
          <Spacer.Column numberOfSpaces={6} />
          <Separator />
          <Spacer.Column numberOfSpaces={6} />
          {!!isLoggedInAndBeneficiary && (
            <React.Fragment>
              <FilterSwitchWithLabel
                isActive={isLimitCreditSearch}
                toggle={toggleLimitCreditSearch}
                label="Limiter la recherche à mon crédit"
                testID="limitCreditSearch"
              />
              <Spacer.Column numberOfSpaces={6} />
              <Separator />
              <Spacer.Column numberOfSpaces={6} />
            </React.Fragment>
          )}

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
            disabled={isOnlyFreeOffersSearch}
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
            disabled={isLimitCreditSearch || isOnlyFreeOffersSearch}
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

const BannerContainer = styled.View({})
