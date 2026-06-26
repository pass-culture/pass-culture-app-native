import { yupResolver } from '@hookform/resolvers/yup'
import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel/FilterSwitchWithLabel'
import { PriceInputController } from 'features/search/components/PriceInputController/PriceInputController'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { priceSchema } from 'features/search/helpers/schema/priceSchema/priceSchema'
import { SearchState } from 'features/search/types'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { RoundUnit, convertCurrency } from 'shared/currency/convertEuroToPacificFranc'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { Currency, useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { isCurrentBeneficiary } from 'shared/user/checkStatusType'
import { getAvailableCredit } from 'shared/user/getAvailableCredit'
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

const formatCurrencyFromCentsWithoutCurrencySymbol = (
  priceInCents: number,
  currency: Currency,
  euroToPacificFrancRate: number
): number => {
  const priceInEuro = convertCentsToEuros(priceInCents)

  if (currency === Currency.PACIFIC_FRANC_SHORT || currency === Currency.PACIFIC_FRANC_FULL) {
    return convertCurrency(priceInEuro, euroToPacificFrancRate, RoundUnit.UNITS)
  }
  return Math.floor(priceInEuro * 100) / 100
}

const priceToString = (price?: number) => (price ? String(price) : '')

export const PriceModal: FunctionComponent<PriceModalProps> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
  filterBehaviour,
  onClose,
}) => {
  const { isLoggedIn, user } = useAuthContext()
  const currencyFull = useGetCurrencyToDisplay('full')
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const [previousCurrency, setPreviousCurrency] = useState(currency)
  const { searchState, dispatch } = useSearch()

  const availableCredit = getAvailableCredit(user)?.amount ?? 0
  const formattedCredit = formatCurrencyFromCentsWithoutCurrencySymbol(
    availableCredit,
    currency,
    euroToPacificFrancRate
  )
  const formattedCreditWithCurrency = formatCurrencyFromCents(
    availableCredit,
    currency,
    euroToPacificFrancRate
  )
  const searchPriceSchema = priceSchema()

  const isLoggedInAndBeneficiary = isLoggedIn && isCurrentBeneficiary(user)
  const creditTypeIsNotGrantFreeOrEmpty =
    user && ![UserCreditType.CREDIT_V3_FREE, UserCreditType.CREDIT_EMPTY].includes(user.creditType)

  const { modal } = useTheme()

  const [keyboardHeight, setKeyboardHeight] = useState(0)
  useForHeightKeyboardEvents(setKeyboardHeight)

  const search = (values: PriceModalFormData) => {
    const conversionRate = currency === Currency.PACIFIC_FRANC_SHORT ? euroToPacificFrancRate : 1
    const formatPrice = (rawPrice: string) =>
      rawPrice ? Number(rawPrice.replace(',', '.')) * conversionRate : undefined

    const newSearchState: SearchState = {
      ...searchState,
      minPrice: formatPrice(values.minPrice),
      maxPrice: formatPrice(values.maxPrice),
    }

    dispatch({ type: 'SET_STATE', payload: newSearchState })
    hideModal()
  }

  const initialFormValues = useMemo(() => {
    return {
      minPrice: priceToString(searchState?.minPrice),
      maxPrice: priceToString(searchState?.maxPrice),
      isLimitCreditSearch: false,
      isOnlyFreeOffersSearch: false,
    }
  }, [searchState?.minPrice, searchState?.maxPrice])

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

  const onSubmit = handleSubmit(search)

  const onToggleOnlyFreeOffersSearch = useCallback(() => {
    const wasActive = getValues('isOnlyFreeOffersSearch')
    setValue('isOnlyFreeOffersSearch', !wasActive)
    const isActive = !wasActive
    if (isActive) {
      setValue('maxPrice', '0')
      setValue('minPrice', '0')
      setValue('isLimitCreditSearch', false)
      trigger(['minPrice', 'maxPrice'])
      return
    }

    setValue('maxPrice', priceToString(searchState?.maxPrice))
    setValue('minPrice', priceToString(searchState?.minPrice))
    trigger(['minPrice', 'maxPrice'])
  }, [setValue, getValues, trigger, searchState?.maxPrice, searchState?.minPrice])

  const onToggleLimitCreditSearch = useCallback(() => {
    const wasActive = getValues('isLimitCreditSearch')
    setValue('isLimitCreditSearch', !wasActive)
    const isActive = !wasActive
    if (isActive) {
      setValue('maxPrice', String(formattedCredit))
      setValue('isOnlyFreeOffersSearch', false)
      trigger(['minPrice', 'maxPrice'])
      return
    }

    setValue('maxPrice', priceToString(searchState?.maxPrice))
    trigger(['minPrice', 'maxPrice'])
  }, [setValue, getValues, trigger, formattedCredit, searchState?.maxPrice])

  const closeModal = useCallback(() => {
    reset({
      minPrice: priceToString(searchState?.minPrice),
      maxPrice: priceToString(searchState?.maxPrice),
      isLimitCreditSearch: false,
      isOnlyFreeOffersSearch: false,
    })
    hideModal()
  }, [hideModal, reset, searchState?.maxPrice, searchState?.minPrice])

  const close = useCallback(() => {
    closeModal()
    onClose?.()
  }, [closeModal, onClose])

  const resetForm = useCallback(() => {
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
        minPrice: undefined,
        maxPrice: undefined,
        defaultMinPrice: '',
        defaultMaxPrice: '',
      },
    })
  }, [dispatch, reset, searchState])

  useEffect(() => {
    if (currency !== previousCurrency) {
      resetForm()
      setPreviousCurrency(currency)
    }
  }, [currency, previousCurrency, resetForm])

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
          onResetPress={resetForm}
          isSearchDisabled={disabled}
          filterBehaviour={filterBehaviour}
        />
      }>
      <FormContainer isKeyboardOpen={isKeyboardOpen}>
        <Form.MaxWidth>
          {isLoggedInAndBeneficiary && creditTypeIsNotGrantFreeOrEmpty ? (
            <Container>
              <Banner
                label={`Il te reste ${formattedCreditWithCurrency} sur ton pass Culture.`}
                Icon={Error}
                testID="creditBanner"
              />
            </Container>
          ) : null}
          <Controller
            control={control}
            name="isOnlyFreeOffersSearch"
            render={({ field: { value } }) => (
              <FilterSwitchWithLabel
                isActive={value}
                toggle={onToggleOnlyFreeOffersSearch}
                label="Uniquement les offres gratuites"
                testID="onlyFreeOffers"
              />
            )}
          />
          <StyledSeparator />
          {isLoggedInAndBeneficiary && creditTypeIsNotGrantFreeOrEmpty ? (
            <Controller
              control={control}
              name="isLimitCreditSearch"
              render={({ field: { value } }) => (
                <React.Fragment>
                  <FilterSwitchWithLabel
                    isActive={value}
                    toggle={onToggleLimitCreditSearch}
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
