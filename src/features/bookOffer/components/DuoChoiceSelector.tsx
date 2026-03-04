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

const SOLO_LABEL = 'Solo'
const DUO_LABEL = 'Duo'

const QUANTITY_BY_LABEL: Readonly<Record<string, 1 | 2>> = {
  [SOLO_LABEL]: 1,
  [DUO_LABEL]: 2,
}

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

  const hasEnoughCreditForQuantity = (quantity: 1 | 2): boolean =>
    stock ? quantity * stock.price <= offerCredit : false

  const getDescriptionForQuantity = (quantity: 1 | 2): string => {
    if (!hasEnoughCreditForQuantity(quantity) || !stock) return 'crédit insuffisant'
    return formatCurrencyFromCents(quantity * stock.price, currency, euroToPacificFrancRate)
  }

  const options: ReadonlyArray<RadioButtonGroupOption> = [
    {
      key: 'solo',
      label: SOLO_LABEL,
      description: getDescriptionForQuantity(1),
      disabled: !hasEnoughCreditForQuantity(1),
    },
    ...(isDuo
      ? [
          {
            key: 'duo',
            label: DUO_LABEL,
            description: getDescriptionForQuantity(2),
            disabled: !hasEnoughCreditForQuantity(2),
          },
        ]
      : []),
  ]

  const currentValue =
    bookingState.quantity === 1 ? SOLO_LABEL : bookingState.quantity === 2 ? DUO_LABEL : ''

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
