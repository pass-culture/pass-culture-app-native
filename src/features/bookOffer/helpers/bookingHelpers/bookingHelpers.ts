import { OfferStockResponse } from 'api/gen'
import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { formatToKeyDate } from 'features/bookOffer/helpers/utils'
import { MovieScreeningBookingData } from 'features/offer/components/MovieScreeningCalendar/types'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

export const getButtonState = (bookingState: BookingState) => {
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

export const getButtonWording = (step: Step) => {
  switch (step) {
    case Step.DATE:
      return 'Valider la date'

    case Step.HOUR:
      return 'Valider lʼhoraire'

    case Step.PRICE:
      return 'Valider le prix'

    case Step.DUO:
      return 'Finaliser ma réservation'

    default:
      return ''
  }
}

export function getHourWording(
  price: number,
  isBookable: boolean,
  enoughCredit: boolean,
  currency: Currency,
  euroToPacificFrancRate: number,
  hasSeveralPrices?: boolean
) {
  const parsePrice = formatCurrencyFromCents(price, currency, euroToPacificFrancRate)

  if (!enoughCredit) return 'crédit insuffisant'
  if (hasSeveralPrices && isBookable) return `dès ${parsePrice}`
  if (isBookable) return parsePrice
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
  offerIsDuo?: boolean,
  bookingDataMovieScreening?: MovieScreeningBookingData
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
    stocksWithCategory.length <= 1 &&
    !bookingDataMovieScreening
  ) {
    return Step.HOUR
  } else if (currentStep === Step.CONFIRMATION && bookingDataMovieScreening) {
    return Step.DUO
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

export const shouldDisplayPricesStep = (
  stocks?: OfferStockResponse[],
  date?: Date,
  hour?: string,
  isEvent?: boolean
) => {
  const stocksWithCategory = getStockWithCategory(stocks, date, hour)
  return stocksWithCategory.length > 1 || isEvent === true
}
