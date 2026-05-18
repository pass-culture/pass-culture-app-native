import { getFormattedHour } from 'features/bookOffer/helpers/getFormattedHour'

type GetSelectedValueParams = {
  hasPotentialPricesStep: boolean
  selectedHour?: string
  selectedStockBeginningDatetime?: string | null
}

export const getSelectedValue = ({
  hasPotentialPricesStep,
  selectedHour,
  selectedStockBeginningDatetime,
}: GetSelectedValueParams) => {
  if (hasPotentialPricesStep) return selectedHour ? getFormattedHour(selectedHour) : ''
  return selectedStockBeginningDatetime ? getFormattedHour(selectedStockBeginningDatetime) : ''
}
