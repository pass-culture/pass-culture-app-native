import { OfferStockResponse } from 'api/gen'
import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { formatToKeyDate } from 'features/bookOffer/helpers/utils'
import { formatToFrenchDecimal } from 'libs/parsers'

export function getButtonState(bookingState: BookingState) {
  const { step, stockId, quantity, date, hour } = bookingState

  switch (step) {
    case Step.DATE:
      return date !== undefined
    case Step.HOUR:
      return hour !== undefined || stockId !== undefined
    case Step.PRICE:
      return stockId !== undefined
    case Step.DUO:
      return quantity !== undefined
    default:
      return false
  }
}

export function getButtonWording(enablePricesByCategories: boolean, enabled: boolean, step: Step) {
  if (enablePricesByCategories) {
    switch (step) {
      case Step.DATE:
        return 'Valider la date'

      case Step.HOUR:
        return 'Valider lʼhoraire'

      case Step.PRICE:
        return 'Valider le prix'

      case Step.DUO:
        return 'Finaliser ma réservation'
    }
  }

  if (enabled) {
    return 'Valider ces options'
  }

  return 'Choisir les options'
}

export function getHourWording(
  price: number,
  isBookable: boolean,
  enoughCredit: boolean,
  hasSeveralPrices?: boolean
) {
  if (!enoughCredit) return 'crédit insuffisant'
  if (hasSeveralPrices && isBookable) return `dès ${formatToFrenchDecimal(price).replace(' ', '')}`
  if (isBookable) return formatToFrenchDecimal(price).replace(' ', '')
  return 'épuisé'
}

export function getPriceWording(stock: OfferStockResponse, offerCredit: number) {
  if (stock.isSoldOut) {
    return 'Épuisé'
  } else if (stock.price > offerCredit) {
    return 'Crédit insuffisant'
  }
  return ''
}

const getStockWithCategoryFromHour = (selectedHour: string) => (stock: OfferStockResponse) =>
  !stock.isExpired &&
  stock.priceCategoryLabel &&
  stock.beginningDatetime &&
  stock.beginningDatetime === selectedHour

export function getPreviousStep(
  bookingState: BookingState,
  stocks: OfferStockResponse[],
  offerIsDuo?: boolean
) {
  const currentStep = bookingState.step
  let stocksWithCategory: OfferStockResponse[] = []
  if (bookingState.hour) {
    stocksWithCategory = stocks.filter(getStockWithCategoryFromHour(bookingState.hour))
  } else {
    stocksWithCategory = bookingState.date
      ? stocks.filter(getStockWithCategoryFromDate(formatToKeyDate(bookingState.date)))
      : []
  }

  if (
    (currentStep === Step.DUO || (currentStep === Step.CONFIRMATION && !offerIsDuo)) &&
    stocksWithCategory.length <= 1
  ) {
    return Step.HOUR
  } else if (currentStep === Step.CONFIRMATION && !offerIsDuo && stocksWithCategory.length > 1) {
    return Step.PRICE
  } else if (currentStep === Step.CONFIRMATION && offerIsDuo) {
    return Step.DUO
  }

  return currentStep - 1
}

const getAllAvailableStockFromOffer = (stock: OfferStockResponse) =>
  !stock.isExpired && stock.beginningDatetime

const getAllAvailableStockWithCategoryFromOffer = (stock: OfferStockResponse) =>
  !stock.isExpired && stock.priceCategoryLabel && stock.beginningDatetime

export const getStockWithCategoryFromDate =
  (selectedDate?: string) => (stock: OfferStockResponse) =>
    !stock.isExpired &&
    stock.priceCategoryLabel &&
    stock.beginningDatetime &&
    formatToKeyDate(stock.beginningDatetime) === selectedDate

export const sortByDateStringPredicate = (
  a: OfferStockResponse['beginningDatetime'],
  b: OfferStockResponse['beginningDatetime']
) => {
  if (a && b) {
    return new Date(a).getTime() - new Date(b).getTime()
  }
  return -1
}

const filterBool = <T>(value: T | null | undefined): value is T => {
  return Boolean(value)
}

export function getSortedHoursFromDate(stocks: OfferStockResponse[], selectedDate?: string) {
  return stocks
    .filter(getStockWithCategoryFromDate(selectedDate))
    .map((stock) => stock.beginningDatetime)
    .filter(filterBool)
    .sort(sortByDateStringPredicate)
}

export function getDistinctPricesFromAllStock(stocks: OfferStockResponse[]) {
  const pricesStocks = stocks.filter(getAllAvailableStockFromOffer).map((stock) => stock.price)
  const distinctPrices: number[] = [...new Set(pricesStocks)]
  return distinctPrices
}

const sortByPricePredicate = (a: OfferStockResponse, b: OfferStockResponse) => {
  return b.price - a.price
}

export function getStockSortedByPriceFromHour(stocks: OfferStockResponse[], selectedHour: string) {
  return stocks.filter(getStockWithCategoryFromHour(selectedHour)).sort(sortByPricePredicate)
}

export function getStockWithCategory(
  stocks?: OfferStockResponse[],
  selectedDate?: Date,
  selectedHour?: string
) {
  if (!stocks) return []
  if (selectedHour) {
    return stocks.filter(getStockWithCategoryFromHour(selectedHour))
  }
  if (selectedDate) {
    return stocks.filter(getStockWithCategoryFromDate(formatToKeyDate(selectedDate)))
  }

  return stocks.filter(getAllAvailableStockWithCategoryFromOffer)
}
