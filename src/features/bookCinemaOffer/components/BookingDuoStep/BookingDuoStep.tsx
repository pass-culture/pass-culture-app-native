import React from 'react'
import { View } from 'react-native'

import { useBookingSelectedStockQuery } from 'features/bookCinemaOffer/queries/useBookingSelectedStockQuery/useBookingSelectedStockQuery'
import {
  BookingQuantity,
  getQuantityByLabel,
  LABEL_BY_QUANTITY,
  LABEL_TO_QUANTITY,
} from 'features/bookOffer/helpers/bookingQuantity'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'
import { RadioButtonGroupOption } from 'ui/designSystem/RadioButtonGroup/types'

type Props = {
  offerId: number
  stockId?: number
  quantity?: BookingQuantity
  onSelectQuantity: (quantity: BookingQuantity) => void
}

export const BookingDuoStep: React.FC<Props> = ({
  offerId,
  stockId,
  quantity,
  onSelectQuantity,
}) => {
  const { data: stock } = useBookingSelectedStockQuery(offerId, stockId)
  const { data: offer } = useOfferQuery({ offerId })
  const offerCredit = useCreditForOffer(offerId)
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const priceInCents = stock?.price

  const hasEnoughCreditForQuantity = (qty: BookingQuantity): boolean =>
    typeof priceInCents === 'number' && qty * priceInCents <= offerCredit

  const getDescriptionForQuantity = (qty: BookingQuantity): string => {
    if (!hasEnoughCreditForQuantity(qty) || priceInCents === undefined) return 'crédit insuffisant'
    return formatCurrencyFromCents(qty * priceInCents, currency, euroToPacificFrancRate)
  }

  const allEntries = Object.entries(LABEL_TO_QUANTITY)
  const visibleEntries = offer?.isDuo ? allEntries : allEntries.slice(0, 1)

  const options: ReadonlyArray<RadioButtonGroupOption> = visibleEntries.map(
    ([optionLabel, qty]) => ({
      key: optionLabel.toLowerCase(),
      label: optionLabel,
      description: getDescriptionForQuantity(qty),
      disabled: !hasEnoughCreditForQuantity(qty),
    })
  )

  const currentValue = (quantity && LABEL_BY_QUANTITY[quantity]) ?? ''

  const handleChange = (selectedLabel: string) => {
    const selectedQuantity = getQuantityByLabel(selectedLabel)
    if (selectedQuantity) {
      onSelectQuantity(selectedQuantity)
    }
  }

  if (!offer) return null

  return (
    <View testID="BookingDuoStep">
      <RadioButtonGroup
        label="Nombre de places"
        labelVariant="title3"
        options={[...options]}
        value={currentValue}
        onChange={handleChange}
        variant="detailed"
        display="vertical"
      />
    </View>
  )
}
