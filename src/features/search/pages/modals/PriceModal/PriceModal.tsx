import { yupResolver } from '@hookform/resolvers/yup'
import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { useTheme } from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel/FilterSwitchWithLabel'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { MAX_PRICE } from 'features/search/helpers/reducer.helpers'
import { makeSearchPriceSchema } from 'features/search/helpers/schema/makeSearchPriceSchema/makeSearchPriceSchema'
import { SearchState } from 'features/search/types'
import { parseCurrency } from 'libs/parsers/getDisplayPrice'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { AppModal } from 'ui/components/modals/AppModal'
import { Separator } from 'ui/components/Separator'
import { Close } from 'ui/svg/icons/Close'
import { Error } from 'ui/svg/icons/Error'
import { getSpacing, Spacer } from 'ui/theme'

type PriceModalFormData = {
  minPrice: string
  maxPrice: string
  isLimitCreditSearch: boolean
  isOnlyFreeOffersSearch: boolean
}

export type PriceModalProps = {
  title: string
  accessibilityLabel: string
  isVisible: boolean
  hideModal: () => void
  filterBehaviour: FilterBehaviour
  onClose?: VoidFunction
}

const titleId = uuidv4()
const minPriceInputId = uuidv4()
const maxPriceInputId = uuidv4()

export const PriceModal: FunctionComponent<PriceModalProps> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
  filterBehaviour,
  onClose,
}) => {
  const { searchState, dispatch } = useSearch()
  const { isLoggedIn, user } = useAuthContext()

  const currency = useGetCurrencyToDisplay('full')

  const availableCredit = useAvailableCredit()?.amount
  const formatAvailableCredit = availableCredit ? convertCentsToEuros(availableCredit) : 0
  const formatAvailableCreditWithCurrency = parseCurrency(formatAvailableCredit)
  const bannerTitle = `Il te reste ${formatAvailableCreditWithCurrency} sur ton pass Culture.`

  const initialCredit = user?.domainsCredit?.all?.initial
  const formatInitialCredit = initialCredit ? convertCentsToEuros(initialCredit) : MAX_PRICE
  const formatInitialCreditWithCurrency = parseCurrency(formatInitialCredit)

  const searchPriceSchema = makeSearchPriceSchema(String(formatInitialCredit))

  const isLimitCreditSearchDefaultValue = Number(searchState?.maxPrice) === formatAvailableCredit
  const isLoggedInAndBeneficiary = isLoggedIn && user?.isBeneficiary

  const isOnlyFreeOffersSearchDefaultValue = searchState?.offerIsFree ?? false

  const { modal } = useTheme()

  const [keyboardHeight, setKeyboardHeight] = useState(0)
  useForHeightKeyboardEvents(setKeyboardHeight)

  function search(values: PriceModalFormData) {
    const offerIsFree =
      values.isOnlyFreeOffersSearch ||
      (values.maxPrice === '0' && (values.minPrice === '' || values.minPrice === '0'))
    let additionalSearchState: SearchState = {
      ...searchState,
      priceRange: null,
      minPrice: undefined,
      maxPrice: undefined,
      offerIsFree,
    }

    if (values.minPrice) {
      additionalSearchState = { ...additionalSearchState, minPrice: values.minPrice }
    }
    if (values.maxPrice) {
      additionalSearchState = {
        ...additionalSearchState,
        maxPrice: values.maxPrice,
        maxPossiblePrice: undefined,
      }
    } else {
      // Only the offers that can be reserved by the beneficiary user
      additionalSearchState = {
        ...additionalSearchState,
        maxPossiblePrice: String(formatInitialCredit),
      }
    }

    dispatch({ type: 'SET_STATE', payload: additionalSearchState })
    hideModal()
  }

  const initialFormValues = useMemo(() => {
    return {
      minPrice: searchState?.minPrice ?? '',
      maxPrice: searchState?.maxPrice ?? '',
      isLimitCreditSearch: isLimitCreditSearchDefaultValue,
      isOnlyFreeOffersSearch: isOnlyFreeOffersSearchDefaultValue,
    }
  }, [
    isLimitCreditSearchDefaultValue,
    isOnlyFreeOffersSearchDefaultValue,
    searchState?.maxPrice,
    searchState?.minPrice,
  ])

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    trigger,
    formState: { isSubmitting, isValid, isValidating },
  } = useForm<PriceModalFormData>({
    mode: 'onChange',
    defaultValues: initialFormValues,
    resolver: yupResolver(searchPriceSchema),
  })

  useEffect(() => {
    reset(initialFormValues)
  }, [initialFormValues, reset])

  const onSubmit = handleSubmit(search)

  const toggleOnlyFreeOffersSearch = useCallback(() => {
    const toggleOnlyFreeOffersSearchValue = !getValues('isOnlyFreeOffersSearch')
    setValue('isOnlyFreeOffersSearch', toggleOnlyFreeOffersSearchValue)
    if (toggleOnlyFreeOffersSearchValue) {
      setValue('maxPrice', '0')
      setValue('minPrice', '0')
      setValue('isLimitCreditSearch', false)
      trigger(['minPrice', 'maxPrice'])
      return
    }
    const maxPrice = searchState?.maxPrice === '0' ? '' : searchState?.maxPrice ?? ''
    const minPrice = searchState?.minPrice === '0' ? '' : searchState?.minPrice ?? ''
    setValue('maxPrice', maxPrice)
    setValue('minPrice', minPrice)
    trigger(['minPrice', 'maxPrice'])
  }, [setValue, getValues, trigger, searchState?.maxPrice, searchState?.minPrice])

  const toggleLimitCreditSearch = useCallback(() => {
    const toggleLimitCreditSearchValue = !getValues('isLimitCreditSearch')
    setValue('isLimitCreditSearch', toggleLimitCreditSearchValue)

    if (toggleLimitCreditSearchValue) {
      setValue('maxPrice', String(formatAvailableCredit))
      setValue('isOnlyFreeOffersSearch', false)
      trigger(['minPrice', 'maxPrice'])
      return
    }

    const availableCreditIsMaxPriceSearch = Number(searchState?.maxPrice) === formatAvailableCredit
    setValue('maxPrice', availableCreditIsMaxPriceSearch ? '' : searchState?.maxPrice ?? '')
    trigger(['minPrice', 'maxPrice'])
  }, [setValue, getValues, trigger, formatAvailableCredit, searchState?.maxPrice])

  const closeModal = useCallback(() => {
    reset({
      minPrice: searchState?.minPrice ?? '',
      maxPrice: searchState?.maxPrice ?? '',
      isLimitCreditSearch: isLimitCreditSearchDefaultValue,
      isOnlyFreeOffersSearch: isOnlyFreeOffersSearchDefaultValue,
    })
    hideModal()
  }, [
    hideModal,
    isLimitCreditSearchDefaultValue,
    isOnlyFreeOffersSearchDefaultValue,
    reset,
    searchState?.maxPrice,
    searchState?.minPrice,
  ])

  const close = useCallback(() => {
    closeModal()
    if (onClose) {
      onClose()
    }
  }, [closeModal, onClose])

  const onResetPress = useCallback(() => {
    reset(
      {
        minPrice: '',
        maxPrice: '',
        isLimitCreditSearch: false,
        isOnlyFreeOffersSearch: false,
      },
      { keepDefaultValues: true }
    )
  }, [reset])

  const disabled = !isValid || (!isValidating && isSubmitting)

  const isKeyboardOpen = keyboardHeight > 0
  const shouldDisplayBackButton = filterBehaviour === FilterBehaviour.APPLY_WITHOUT_SEARCHING

  return (
    <AppModal
      visible={isVisible}
      customModalHeader={
        <SearchCustomModalHeader
          titleId={titleId}
          title={title}
          onGoBack={closeModal}
          onClose={close}
          shouldDisplayBackButton={shouldDisplayBackButton}
          shouldDisplayCloseButton
        />
      }
      title={title}
      isUpToStatusBar
      noPadding
      modalSpacing={modal.spacing.MD}
      rightIconAccessibilityLabel={accessibilityLabel}
      rightIcon={Close}
      onRightIconPress={closeModal}
      fixedModalBottom={
        <SearchFixedModalBottom
          onSearchPress={onSubmit}
          onResetPress={onResetPress}
          isSearchDisabled={disabled}
          filterBehaviour={filterBehaviour}
        />
      }>
      <Spacer.Column numberOfSpaces={6} />
      <Form.MaxWidth>
        {isLoggedInAndBeneficiary ? (
          <View testID="creditBanner">
            <InfoBanner message={bannerTitle} icon={Error} />
            <Spacer.Column numberOfSpaces={6} />
          </View>
        ) : null}
        <Controller
          control={control}
          name="isOnlyFreeOffersSearch"
          render={({ field: { value } }) => (
            <FilterSwitchWithLabel
              isActive={value}
              toggle={toggleOnlyFreeOffersSearch}
              label="Uniquement les offres gratuites"
              testID="onlyFreeOffers"
            />
          )}
        />
        <Spacer.Column numberOfSpaces={6} />
        <Separator.Horizontal />
        <Spacer.Column numberOfSpaces={6} />
        {isLoggedInAndBeneficiary ? (
          <Controller
            control={control}
            name="isLimitCreditSearch"
            render={({ field: { value } }) => (
              <React.Fragment>
                <FilterSwitchWithLabel
                  isActive={value}
                  toggle={toggleLimitCreditSearch}
                  label="Limiter la recherche à mon crédit"
                  testID="limitCreditSearch"
                />
                <Spacer.Column numberOfSpaces={6} />
                <Separator.Horizontal />
                <Spacer.Column numberOfSpaces={6} />
              </React.Fragment>
            )}
          />
        ) : null}
        <Controller
          control={control}
          name="minPrice"
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <React.Fragment>
              <TextInput
                autoComplete="off" // disable autofill on android
                autoCapitalize="none"
                isError={error && value.length > 0}
                keyboardType="numeric"
                label={`Prix minimum (en\u00a0${currency})`}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                textContentType="none" // disable autofill on iOS
                accessibilityDescribedBy={minPriceInputId}
                testID="Entrée pour le prix minimum"
                placeholder="0"
                disabled={getValues('isOnlyFreeOffersSearch')}
              />
              <InputError
                visible={!!error}
                messageId={error?.message}
                numberOfSpacesTop={getSpacing(0.5)}
                relatedInputId={minPriceInputId}
              />
            </React.Fragment>
          )}
        />
        <Spacer.Column numberOfSpaces={6} />
        <Controller
          control={control}
          name="maxPrice"
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <React.Fragment>
              <TextInput
                autoComplete="off" // disable autofill on android
                autoCapitalize="none"
                isError={error && value.length > 0}
                keyboardType="numeric"
                label={`Prix maximum (en\u00a0${currency})`}
                value={value}
                onChangeText={(value) => {
                  onChange(value)
                  trigger('minPrice')
                }}
                onBlur={onBlur}
                textContentType="none" // disable autofill on iOS
                accessibilityDescribedBy={maxPriceInputId}
                testID="Entrée pour le prix maximum"
                rightLabel={`max\u00a0: ${formatInitialCreditWithCurrency}`}
                placeholder={`${formatInitialCredit}`}
                disabled={getValues('isLimitCreditSearch') || getValues('isOnlyFreeOffersSearch')}
              />
              <InputError
                visible={!!error}
                messageId={error?.message}
                numberOfSpacesTop={getSpacing(0.5)}
                relatedInputId={maxPriceInputId}
              />
            </React.Fragment>
          )}
        />
      </Form.MaxWidth>
      {isKeyboardOpen ? <Spacer.Column numberOfSpaces={8} /> : null}
    </AppModal>
  )
}
