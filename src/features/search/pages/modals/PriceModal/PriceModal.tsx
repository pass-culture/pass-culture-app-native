import { yupResolver } from '@hookform/resolvers/yup'
import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { DepositType } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel/FilterSwitchWithLabel'
import { PriceInputController } from 'features/search/components/PriceInputController/PriceInputController'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { MAX_PRICE_IN_CENTS } from 'features/search/helpers/reducer.helpers'
import { priceSchema } from 'features/search/helpers/schema/priceSchema/priceSchema'
import { SearchState } from 'features/search/types'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { formatCurrencyFromCentsWithoutCurrencySymbol } from 'shared/currency/formatCurrencyFromCentsWithoutCurrencySymbol'
import { Currency, useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'
import { Form } from 'ui/components/Form'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { AppModal } from 'ui/components/modals/AppModal'
import { Separator } from 'ui/components/Separator'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Close } from 'ui/svg/icons/Close'
import { Error } from 'ui/svg/icons/Error'

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

const getConversionRate = (currency: Currency, euroToPacificFrancRate: number) => {
  return currency === Currency.PACIFIC_FRANC_SHORT ? euroToPacificFrancRate : 1
}

export const PriceModal: FunctionComponent<PriceModalProps> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
  filterBehaviour,
  onClose,
}) => {
  const currencyFull = useGetCurrencyToDisplay('full')
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const conversionRate = getConversionRate(currency, euroToPacificFrancRate)

  const [previousCurrency, setPreviousCurrency] = useState(currency)

  const { searchState, dispatch } = useSearch()
  const { isLoggedIn, user } = useAuthContext()

  const availableCredit = useAvailableCredit()?.amount ?? 0
  const formatAvailableCredit = formatCurrencyFromCentsWithoutCurrencySymbol(
    availableCredit,
    currency,
    euroToPacificFrancRate
  )
  const formatAvailableCreditWithCurrency = formatCurrencyFromCents(
    availableCredit,
    currency,
    euroToPacificFrancRate
  )
  const bannerTitle = `Il te reste ${formatAvailableCreditWithCurrency} sur ton pass Culture.`

  const initialCredit = user?.domainsCredit?.all?.initial ?? MAX_PRICE_IN_CENTS
  const formatInitialCredit = formatCurrencyFromCentsWithoutCurrencySymbol(
    initialCredit,
    currency,
    euroToPacificFrancRate
  )
  const formatInitialCreditWithCurrency = formatCurrencyFromCents(
    initialCredit,
    currency,
    euroToPacificFrancRate
  )

  const searchPriceSchema = priceSchema({ initialCredit: formatInitialCredit, currency })

  const isLimitCreditSearchDefaultValue = Number(searchState?.maxPrice) === formatAvailableCredit
  const isLoggedInAndBeneficiary = isLoggedIn && user?.isBeneficiary
  const depositTypeIsNotGrantFree = user?.depositType !== DepositType.GRANT_FREE

  const isOnlyFreeOffersSearchDefaultValue = searchState?.offerIsFree ?? false

  const { modal } = useTheme()

  const [keyboardHeight, setKeyboardHeight] = useState(0)
  useForHeightKeyboardEvents(setKeyboardHeight)

  function search(values: PriceModalFormData) {
    const transformedValues = {
      ...values,
      minPrice: values.minPrice ? String(Number(values.minPrice) * conversionRate) : '',
      maxPrice: values.maxPrice ? String(Number(values.maxPrice) * conversionRate) : '',
    }

    const offerIsFree =
      transformedValues.isOnlyFreeOffersSearch ||
      (transformedValues.maxPrice === '0' &&
        (transformedValues.minPrice === '' || transformedValues.minPrice === '0'))

    let additionalSearchState: SearchState = {
      ...searchState,
      priceRange: null,
      minPrice: undefined,
      maxPrice: undefined,
      defaultMinPrice: values.minPrice,
      defaultMaxPrice: values.maxPrice,
      offerIsFree,
    }

    if (transformedValues.minPrice) {
      additionalSearchState = {
        ...additionalSearchState,
        minPrice: transformedValues.minPrice,
      }
    }

    if (transformedValues.maxPrice) {
      additionalSearchState = {
        ...additionalSearchState,
        maxPrice: transformedValues.maxPrice,
        maxPossiblePrice: undefined,
      }
    } else {
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
      minPrice: searchState?.defaultMinPrice ?? '',
      maxPrice: searchState?.defaultMaxPrice ?? '',
      isLimitCreditSearch: isLimitCreditSearchDefaultValue,
      isOnlyFreeOffersSearch: isOnlyFreeOffersSearchDefaultValue,
    }
  }, [isLimitCreditSearchDefaultValue, isOnlyFreeOffersSearchDefaultValue, searchState])

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    trigger,
    formState: { isSubmitting, isValid, isValidating },
    watch,
  } = useForm<PriceModalFormData>({
    mode: 'onChange',
    defaultValues: initialFormValues,
    resolver: yupResolver(searchPriceSchema),
  })

  const { minPrice, maxPrice, isLimitCreditSearch, isOnlyFreeOffersSearch } = watch()

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
    const maxPrice = searchState?.maxPrice === '0' ? '' : (searchState?.maxPrice ?? '')
    const minPrice = searchState?.minPrice === '0' ? '' : (searchState?.minPrice ?? '')

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
    setValue('maxPrice', availableCreditIsMaxPriceSearch ? '' : (searchState?.maxPrice ?? ''))
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
    dispatch({
      type: 'SET_STATE',
      payload: {
        ...searchState,
        priceRange: null,
        minPrice: undefined,
        maxPrice: undefined,
        defaultMinPrice: '',
        defaultMaxPrice: '',
        offerIsFree: false,
      },
    })
  }, [dispatch, reset, searchState])

  useEffect(() => {
    if (currency !== previousCurrency) {
      onResetPress()
      setPreviousCurrency(currency)
    }
  }, [currency, previousCurrency, onResetPress])

  const disabled = !isValid || (!isValidating && isSubmitting)
  const isKeyboardOpen = keyboardHeight > 0
  const shouldDisplayBackButton = filterBehaviour === FilterBehaviour.APPLY_WITHOUT_SEARCHING
  const hasDefaultValues =
    !isLimitCreditSearch && !isOnlyFreeOffersSearch && maxPrice === '' && minPrice === ''

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
          isResetDisabled={hasDefaultValues}
        />
      }>
      <FormContainer isKeyboardOpen={isKeyboardOpen}>
        <Form.MaxWidth>
          {isLoggedInAndBeneficiary && depositTypeIsNotGrantFree ? (
            <Container>
              <Banner label={bannerTitle} Icon={Error} testID="creditBanner" />
            </Container>
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
          <StyledSeparator />
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
                  <StyledSeparator />
                </React.Fragment>
              )}
            />
          ) : null}
          <Container>
            <PriceInputController
              control={control}
              name="minPrice"
              label={`Prix minimum (en\u00a0${currencyFull})`}
              testID="Entrée pour le prix minimum"
              isDisabled={getValues('isOnlyFreeOffersSearch')}
            />
          </Container>
          <PriceInputController
            control={control}
            name="maxPrice"
            label={`Prix maximum (en\u00a0${currencyFull})`}
            description={`max\u00a0: ${formatInitialCreditWithCurrency}`}
            testID="Entrée pour le prix maximum"
            isDisabled={getValues('isLimitCreditSearch') || getValues('isOnlyFreeOffersSearch')}
          />
        </Form.MaxWidth>
      </FormContainer>
    </AppModal>
  )
}

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.xl,
}))

const Container = styled.View(({ theme }) => ({ marginBottom: theme.designSystem.size.spacing.xl }))

const FormContainer = styled.View<{ isKeyboardOpen: boolean }>(({ isKeyboardOpen, theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
  marginBottom: isKeyboardOpen ? theme.designSystem.size.spacing.xxl : 0,
}))
