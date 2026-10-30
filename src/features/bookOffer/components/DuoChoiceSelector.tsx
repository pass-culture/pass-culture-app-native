import React, { useCallback } from 'react'
import { View } from 'react-native'

import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { useBookingOfferQuery } from 'queries/offer/useBookingOfferQuery'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'
import { LabelVariant, RadioButtonGroupOption } from 'ui/designSystem/RadioButtonGroup/types'

const QUANTITY_BY_KEY = { solo: 1, duo: 2 } as const

type Quantity = (typeof QUANTITY_BY_KEY)[keyof typeof QUANTITY_BY_KEY]

const KEY_BY_QUANTITY: Readonly<Record<number, string>> = { 1: 'solo', 2: 'duo' }

type DuoChoiceSelectorProps = {
  label?: string
  labelVariant?: LabelVariant
}

export const DuoChoiceSelector: React.FC<DuoChoiceSelectorProps> = ({
  label = 'Nombre de places',
  labelVariant = 'body',
}) => {
  const { bookingState, dispatch } = useBookingContext()
  const { isDuo } = useBookingOfferQuery() ?? {}
  const stock = useBookingStock()
  const offerCredit = useCreditForOffer(bookingState.offerId)
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()

  const hasEnoughCreditForQuantity = (quantity: Quantity): boolean =>
    stock ? quantity * stock.price <= offerCredit : false

  const getDescriptionForQuantity = (quantity: Quantity): string => {
    if (!hasEnoughCreditForQuantity(quantity) || !stock) return 'crédit insuffisant'
    return formatCurrencyFromCents(quantity * stock.price, currency, euroToPacificFrancRate)
  }

  const optionKeys: ReadonlyArray<keyof typeof QUANTITY_BY_KEY> = isDuo ? ['solo', 'duo'] : ['solo']
  const options: ReadonlyArray<RadioButtonGroupOption> = optionKeys.map((key) => {
    const quantity = QUANTITY_BY_KEY[key]
    return {
      key,
      label: key === 'solo' ? 'Solo' : 'Duo',
      description: getDescriptionForQuantity(quantity),
      disabled: !hasEnoughCreditForQuantity(quantity),
    }
  })

  const currentValue = (bookingState.quantity && KEY_BY_QUANTITY[bookingState.quantity]) ?? ''

  const handleChange = useCallback(
    (selectedKey: string) => {
      const quantity = QUANTITY_BY_KEY[selectedKey as keyof typeof QUANTITY_BY_KEY]
      if (!quantity) return
      dispatch({ type: 'SELECT_QUANTITY', payload: quantity })
    },
    [dispatch]
  )

  return (
    <View testID="DuoChoiceSelector">
      <RadioButtonGroup
        label={label}
        labelVariant={labelVariant}
        options={[...options]}
        value={currentValue}
        onChange={handleChange}
        variant="detailed"
        display="vertical"
      />
    </View>
  )
}
