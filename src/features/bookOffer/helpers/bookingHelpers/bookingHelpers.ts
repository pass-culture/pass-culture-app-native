import { OfferResponse, OfferStockResponse } from 'api/gen'
import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { formatToKeyDate } from 'features/bookOffer/helpers/utils'
import { formatToFrenchDecimal } from 'libs/parsers'
import { RadioSelectorType } from 'ui/components/radioSelector/RadioSelector'

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

export function getBookingSteps(stocks: OfferStockResponse[], offerIsDuo?: boolean) {
  const stocksNotExpired = stocks.filter((stock) => !stock.isExpired)
  let bookingSteps = [Step.DATE, Step.HOUR]

  if (offerIsDuo && stocksNotExpired.length > 1) {
    bookingSteps = [...bookingSteps, Step.PRICE, Step.DUO]
  } else if (offerIsDuo && stocksNotExpired.length === 1) {
    bookingSteps = [...bookingSteps, Step.DUO]
  } else if (!offerIsDuo && stocksNotExpired.length > 1) {
    bookingSteps = [...bookingSteps, Step.PRICE]
  }

  return bookingSteps
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

export function getRadioSelectorPriceState(
  stock: OfferStockResponse,
  offerCredit: number,
  stockId?: number
) {
  if (stock.id === stockId) {
    return RadioSelectorType.ACTIVE
  } else if (stock.isSoldOut || stock.price > offerCredit) {
    return RadioSelectorType.DISABLED
  }

  return RadioSelectorType.DEFAULT
}

export function getPriceWording(stock: OfferStockResponse, offerCredit: number) {
  if (stock.isSoldOut) {
    return 'Épuisé'
  } else if (stock.price > offerCredit) {
    return 'Crédit insuffisant'
  } else if (stock.remainingQuantity === 1) {
    return '1 place restante'
  }

  return `${stock.remainingQuantity} places restantes`
}

export function getPreviousStep(currentStep: number, offer: OfferResponse) {
  const stocksWithCategory = offer?.stocks?.filter(
    (stock) => !stock.isExpired && stock.priceCategoryLabel
  ).length

  if (
    (currentStep === Step.DUO || (currentStep === Step.CONFIRMATION && !offer.isDuo)) &&
    stocksWithCategory <= 1
  ) {
    return Step.HOUR
  } else if (currentStep === Step.CONFIRMATION && !offer.isDuo && stocksWithCategory > 1) {
    return Step.PRICE
  } else if (currentStep === Step.CONFIRMATION && offer.isDuo) {
    return Step.DUO
  }

  return currentStep - 1
}

export function getSortedHoursFromDatePredicate(
  stocks: OfferStockResponse[],
  selectedDate?: string
) {
  return (
    stocks
      .filter(
        (stock) =>
          !stock.isExpired &&
          stock.beginningDatetime &&
          formatToKeyDate(stock.beginningDatetime) === selectedDate
      )
      .map((stock) => stock.beginningDatetime && stock.beginningDatetime)
      //@ts-expect-error : stocks with no beginningDatetime was filtered
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) as string[]
  )
}

export function getStocksFromHourPredicate(stocks: OfferStockResponse[], selectedHour: string) {
  return stocks.filter(
    (stock) =>
      !stock.isExpired &&
      stock.isBookable &&
      stock.beginningDatetime &&
      stock.beginningDatetime === selectedHour
  )
}
