import { useNavigation } from '@react-navigation/native'
import { useFormik } from 'formik'
import React, { FunctionComponent, useCallback } from 'react'
import { ScrollView, StyleProp, ViewStyle, View } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAuthContext } from 'features/auth/AuthContext'
import { useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useUserProfileInfo } from 'features/profile/api'
import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { MAX_PRICE } from 'features/search/pages/reducer.helpers'
import { makeSearchPriceSchema } from 'features/search/pages/schema/makeSearchPriceSchema'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { SearchState, SearchView } from 'features/search/types'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { formatToFrenchDecimal } from 'libs/parsers'
import { Banner } from 'ui/components/Banner'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalSpacing } from 'ui/components/modals/enum'
import { Separator } from 'ui/components/Separator'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer } from 'ui/theme'

type SearchPriceFormFields = {
  minPrice: string
  maxPrice: string
  isLimitCreditSearch: boolean
  isOnlyFreeOffersSearch: boolean
}

type Props = {
  title: string
  accessibilityLabel: string
  isVisible: boolean
  hideModal: () => void
}

const titleId = uuidv4()
const minPriceInputId = uuidv4()
const maxPriceInputId = uuidv4()

export const SearchPrice: FunctionComponent<Props> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
}) => {
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
  const bannerTitle = `Il te reste ${formatAvailableCredit}\u00a0€ sur ton pass Culture.`

  const initialCredit = user?.domainsCredit?.all?.initial
  const formatInitialCredit = initialCredit
    ? Number(formatToFrenchDecimal(initialCredit).slice(0, -2))
    : MAX_PRICE

  const searchPriceSchema = makeSearchPriceSchema(String(formatInitialCredit))

  const isLimitCreditSearchDefaultValue = searchState?.maxPrice === formatAvailableCredit
  const isLoggedInAndBeneficiary = isLoggedIn && user?.isBeneficiary

  const isOnlyFreeOffersSearchDefaultValue = searchState?.offerIsFree ?? false

  const { isDesktopViewport } = useTheme()

  function search(values: SearchPriceFormFields) {
    hideModal()
    const offerIsFree =
      values.isOnlyFreeOffersSearch || (values.maxPrice === '0' && values.minPrice === '')
    let additionalSearchState: SearchState = {
      ...searchState,
      priceRange: null,
      minPrice: undefined,
      maxPrice: undefined,
      offerIsFree,
    }

    if (values.minPrice) {
      dispatch({ type: 'SET_MIN_PRICE', payload: values.minPrice })
      additionalSearchState = { ...additionalSearchState, minPrice: values.minPrice }
    }
    if (values.maxPrice) {
      dispatch({ type: 'SET_MAX_PRICE', payload: values.maxPrice })
      additionalSearchState = { ...additionalSearchState, maxPrice: values.maxPrice }
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

  const { values, resetForm, handleSubmit, isValid, errors, handleChange, setValues } =
    useFormik<SearchPriceFormFields>({
      initialValues: {
        minPrice: searchState?.minPrice || '',
        maxPrice: searchState?.maxPrice || '',
        isLimitCreditSearch: isLimitCreditSearchDefaultValue,
        isOnlyFreeOffersSearch: isOnlyFreeOffersSearchDefaultValue,
      },
      validationSchema: searchPriceSchema,
      onSubmit(values: SearchPriceFormFields) {
        return search(values)
      },
    })

  const toggleOnlyFreeOffersSearch = useCallback(() => {
    const toggleOnlyFreeOffersSearchValue = !values.isOnlyFreeOffersSearch
    setValues({
      ...values,
      isOnlyFreeOffersSearch: toggleOnlyFreeOffersSearchValue,
      ...(toggleOnlyFreeOffersSearchValue
        ? {
            minPrice: '0',
            maxPrice: '0',
            isLimitCreditSearch: false,
          }
        : {
            minPrice: searchState?.minPrice !== '0' ? searchState?.minPrice || '' : '',
            maxPrice: searchState?.maxPrice !== '0' ? searchState?.maxPrice || '' : '',
          }),
    })
  }, [searchState?.maxPrice, searchState?.minPrice, setValues, values])

  const toggleLimitCreditSearch = useCallback(() => {
    const availableCreditIsMaxPriceSearch = searchState?.maxPrice === formatAvailableCredit
    const toggleLimitCreditSearchValue = !values.isLimitCreditSearch

    setValues({
      ...values,
      isLimitCreditSearch: toggleLimitCreditSearchValue,
      ...(toggleLimitCreditSearchValue
        ? {
            maxPrice: formatAvailableCredit,
            isOnlyFreeOffersSearch: false,
          }
        : {
            maxPrice: availableCreditIsMaxPriceSearch ? '' : searchState?.maxPrice || '',
          }),
    })
  }, [formatAvailableCredit, searchState?.maxPrice, setValues, values])

  const close = useCallback(() => {
    resetForm({
      values: {
        minPrice: searchState?.minPrice || '',
        maxPrice: searchState?.maxPrice || '',
        isLimitCreditSearch: isLimitCreditSearchDefaultValue,
        isOnlyFreeOffersSearch: isOnlyFreeOffersSearchDefaultValue,
      },
    })
    hideModal()
  }, [
    hideModal,
    isLimitCreditSearchDefaultValue,
    isOnlyFreeOffersSearchDefaultValue,
    resetForm,
    searchState?.maxPrice,
    searchState?.minPrice,
  ])

  const onResetPress = useCallback(() => {
    resetForm({
      values: {
        minPrice: '',
        maxPrice: '',
        isLimitCreditSearch: false,
        isOnlyFreeOffersSearch: false,
      },
    })
  }, [resetForm])

  return (
    <AppModal
      visible={isVisible}
      customModalHeader={
        isDesktopViewport ? undefined : (
          <SearchCustomModalHeader titleId={titleId} title={title} onGoBack={close} />
        )
      }
      title={title}
      isFullscreen={true}
      noPadding={true}
      modalSpacing={ModalSpacing.MD}
      rightIconAccessibilityLabel={accessibilityLabel}
      rightIcon={Close}
      onRightIconPress={close}
      fixedModalBottom={
        <SearchFixedModalBottom
          onSearchPress={handleSubmit}
          onResetPress={onResetPress}
          isSearchDisabled={!isValid}
        />
      }>
      <Spacer.Column numberOfSpaces={6} />
      {/* https://stackoverflow.com/questions/29685421/hide-keyboard-in-react-native */}
      <StyledScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={getScrollViewContentContainerStyle()}>
        <Form.MaxWidth>
          {!!isLoggedInAndBeneficiary && (
            <View testID="creditBanner">
              <Banner title={bannerTitle} />
              <Spacer.Column numberOfSpaces={6} />
            </View>
          )}
          <FilterSwitchWithLabel
            isActive={values.isOnlyFreeOffersSearch}
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
                isActive={values.isLimitCreditSearch}
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
            isError={!!errors.minPrice}
            keyboardType="numeric"
            label="Prix minimum (en&nbsp;€)"
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
            label="Prix maximum (en&nbsp;€)"
            value={values.maxPrice}
            onChangeText={handleChange('maxPrice')}
            textContentType="none" // disable autofill on iOS
            accessibilityDescribedBy={maxPriceInputId}
            testID="Entrée pour le prix maximum"
            rightLabel={`max\u00a0: ${formatInitialCredit}\u00a0€`}
            placeholder={`${formatInitialCredit}`}
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
    </AppModal>
  )
}

const getScrollViewContentContainerStyle = (): StyleProp<ViewStyle> => ({
  flexDirection: 'column',
  alignItems: 'center',
})

const StyledScrollView = styled(ScrollView)({
  flexGrow: 1,
})
