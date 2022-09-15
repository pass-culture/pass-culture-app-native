import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik'
import React, { FunctionComponent, useCallback } from 'react'
import { ScrollView, StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'

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
import { formatToFrenchDecimal } from 'libs/parsers'
import { Banner } from 'ui/components/Banner'
import { Form } from 'ui/components/Form'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { Separator } from 'ui/components/Separator'
import { getSpacing, Spacer } from 'ui/theme'

// 3 integers max separate by a dot or point with 2 decimals max
const priceRegex = /^\d+(?:[,.]\d{0,2})?$/

const formatPriceError =
  'Tu as renseigné trop de chiffre après la virgule. Exemple de format attendu : 10,00'

const SearchPriceSchema = Yup.object().shape({
  minPrice: Yup.string().matches(priceRegex, formatPriceError),
  maxPrice: Yup.string().matches(priceRegex, formatPriceError),
  isLimitCreditSearch: Yup.boolean(),
  isOnlyFreeOffersSearch: Yup.boolean(),
})

type SearchPriceFormFields = {
  minPrice: string
  maxPrice: string
  isLimitCreditSearch: boolean
  isOnlyFreeOffersSearch: boolean
}

export const SearchPrice: FunctionComponent = () => {
  const logUsePriceFilter = useLogFilterOnce(SectionTitle.Price)
  const logUseFreeOffersFilter = useLogFilterOnce(SectionTitle.Free)
  const { navigate } = useNavigation<UseNavigationType>()
  const { isLoggedIn } = useAuthContext()
  const { data: user } = useUserProfileInfo()
  const { searchState, dispatch } = useSearch()
  const availableCredit = useAvailableCredit()
  const formatAvailableCredit = availableCredit?.amount
    ? formatToFrenchDecimal(availableCredit.amount).slice(0, -2)
    : '0'

  const isLimitCreditSearchDefaultValue = searchState?.maxPrice === formatAvailableCredit
  const isLoggedInAndBeneficiary = isLoggedIn && user?.isBeneficiary

  const isOnlyFreeOffersSearchDefaultValue = searchState?.offerIsFree ?? false

  const initialValues: SearchPriceFormFields = {
    minPrice: searchState?.minPrice || '',
    maxPrice: searchState?.maxPrice || '',
    isLimitCreditSearch: isLimitCreditSearchDefaultValue,
    isOnlyFreeOffersSearch: isOnlyFreeOffersSearchDefaultValue,
  }

  const goBack = useCallback(() => {
    navigate(
      ...getTabNavConfig('Search', {
        ...searchState,
        view: SearchView.Results,
      })
    )
  }, [navigate, searchState])

  function search(searchPriceFormValues: SearchPriceFormFields) {
    const offerIsFree =
      searchPriceFormValues.isOnlyFreeOffersSearch ||
      (searchPriceFormValues.maxPrice === '0' && searchPriceFormValues.minPrice === '')
    let additionalSearchState: SearchState = {
      ...searchState,
      priceRange: null,
      minPrice: undefined,
      maxPrice: undefined,
      offerIsFree,
    }

    if (searchPriceFormValues.minPrice) {
      dispatch({ type: 'SET_MIN_PRICE', payload: searchPriceFormValues.minPrice })
      additionalSearchState = { ...additionalSearchState, minPrice: searchPriceFormValues.minPrice }
    }
    if (searchPriceFormValues.maxPrice) {
      dispatch({ type: 'SET_MAX_PRICE', payload: searchPriceFormValues.maxPrice })
      additionalSearchState = { ...additionalSearchState, maxPrice: searchPriceFormValues.maxPrice }
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
      <Formik initialValues={initialValues} validationSchema={SearchPriceSchema} onSubmit={search}>
        {({ handleChange, handleSubmit, resetForm, values, errors, setFieldValue }) => (
          <React.Fragment>
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
                  isActive={values.isOnlyFreeOffersSearch}
                  toggle={() => {
                    const toggleOnlyFreeOffersSearchValue = !values.isOnlyFreeOffersSearch
                    setFieldValue('isOnlyFreeOffersSearch', toggleOnlyFreeOffersSearchValue)
                    if (toggleOnlyFreeOffersSearchValue) {
                      setFieldValue('maxPrice', '0')
                      setFieldValue('minPrice', '0')
                      setFieldValue('isLimitCreditSearch', false)
                      return
                    }
                    const maxPrice =
                      searchState?.maxPrice !== '0' ? searchState?.maxPrice || '' : ''
                    const minPrice =
                      searchState?.minPrice !== '0' ? searchState?.minPrice || '' : ''
                    setFieldValue('maxPrice', maxPrice)
                    setFieldValue('minPrice', minPrice)
                  }}
                  label="Uniquement les offres gratuites"
                  testID="onlyFreeOffers"
                />
                <Spacer.Column numberOfSpaces={6} />
                <Separator />
                <Spacer.Column numberOfSpaces={6} />
                {!!isLoggedInAndBeneficiary && (
                  <React.Fragment>
                    <FilterSwitchWithLabel
                      isActive={values.isLimitCreditSearch}
                      toggle={() => {
                        const toggleLimitCreditSearchValue = !values.isLimitCreditSearch
                        setFieldValue('isLimitCreditSearch', toggleLimitCreditSearchValue)

                        if (toggleLimitCreditSearchValue) {
                          setFieldValue('maxPrice', formatAvailableCredit)
                          setFieldValue('isOnlyFreeOffersSearch', false)
                          return
                        }

                        const availableCreditIsMaxPriceSearch =
                          searchState?.maxPrice === formatAvailableCredit
                        setFieldValue(
                          'maxPrice',
                          availableCreditIsMaxPriceSearch ? '' : searchState?.maxPrice || ''
                        )
                      }}
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
                  isError={!!errors.minPrice}
                  keyboardType="numeric"
                  label="Prix minimum (en €)"
                  value={values.minPrice}
                  onChangeText={handleChange('minPrice')}
                  textContentType="none" // disable autofill on iOS
                  accessibilityDescribedBy={minPriceInputId}
                  testID="Entrée pour le prix minimum"
                  placeholder="0"
                  disabled={values.isOnlyFreeOffersSearch}
                />
                <InputError
                  visible={!!errors.minPrice}
                  messageId={errors.minPrice}
                  numberOfSpacesTop={getSpacing(0.5)}
                  relatedInputId={minPriceInputId}
                />
                <Spacer.Column numberOfSpaces={6} />
                <TextInput
                  autoComplete="off" // disable autofill on android
                  autoCapitalize="none"
                  isError={!!errors.maxPrice}
                  keyboardType="numeric"
                  label="Prix maximum (en €)"
                  value={values.maxPrice}
                  onChangeText={handleChange('maxPrice')}
                  textContentType="none" // disable autofill on iOS
                  accessibilityDescribedBy={maxPriceInputId}
                  testID="Entrée pour le prix maximum"
                  rightLabel={`max : ${MAX_PRICE} €`}
                  placeholder={`${MAX_PRICE}`}
                  disabled={values.isLimitCreditSearch || values.isOnlyFreeOffersSearch}
                />
                <InputError
                  visible={!!errors.maxPrice}
                  messageId={errors.maxPrice}
                  numberOfSpacesTop={getSpacing(0.5)}
                  relatedInputId={maxPriceInputId}
                />
              </Form.MaxWidth>
            </StyledScrollView>

            <FilterPageButtons
              onSearchPress={handleSubmit}
              onResetPress={resetForm}
              isSearchDisabled={!!errors.minPrice || !!errors.maxPrice}
            />
          </React.Fragment>
        )}
      </Formik>
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
