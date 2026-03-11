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

const LABEL_TO_QUANTITY = { Solo: 1, Duo: 2 } as const

type Quantity = (typeof LABEL_TO_QUANTITY)[keyof typeof LABEL_TO_QUANTITY]

const QUANTITY_BY_LABEL: Readonly<Record<string, Quantity>> = LABEL_TO_QUANTITY

const LABEL_BY_QUANTITY: Readonly<Record<number, string>> = Object.fromEntries(
  Object.entries(LABEL_TO_QUANTITY).map(([label, qty]) => [qty, label])
)

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

  const allEntries = Object.entries(LABEL_TO_QUANTITY)
  const visibleEntries = isDuo ? allEntries : allEntries.slice(0, 1)

  const options: ReadonlyArray<RadioButtonGroupOption> = visibleEntries.map(
    ([optionLabel, quantity]) => ({
      key: optionLabel.toLowerCase(),
      label: optionLabel,
      description: getDescriptionForQuantity(quantity),
      disabled: !hasEnoughCreditForQuantity(quantity),
    })
  )

  const currentValue = (bookingState.quantity && LABEL_BY_QUANTITY[bookingState.quantity]) ?? ''

  const handleChange = useCallback(
    (selectedLabel: string) => {
      const quantity = QUANTITY_BY_LABEL[selectedLabel]
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
