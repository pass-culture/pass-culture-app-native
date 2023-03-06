import { OfferStockResponse } from 'api/gen'
import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { formatToFrenchDecimal } from 'libs/parsers'
import { RadioSelectorType } from 'ui/components/radioSelector/RadioSelector'

export function getButtonState(enablePricesByCategories: boolean, bookingState: BookingState) {
  const { step, stockId, quantity, date, hour } = bookingState

  if (enablePricesByCategories) {
    switch (step) {
      case Step.DATE: {
        return date !== undefined
      }
      case Step.HOUR: {
        return hour !== undefined || stockId !== undefined
      }
      case Step.PRICE: {
        return stockId !== undefined
      }
      case Step.DUO: {
        return quantity !== undefined
      }
    }
  }

  return typeof stockId === 'number' && typeof quantity === 'number'
}

export function getTotalBookingSteps(stocks: OfferStockResponse[], offerIsDuo?: boolean) {
  let totalSteps = 2
  const stocksNotExpired = stocks.filter((stock) => !stock.isExpired)

  if (offerIsDuo && stocksNotExpired.length > 1) {
    totalSteps = 4
  } else if (
    (offerIsDuo && stocksNotExpired.length === 1) ||
    (!offerIsDuo && stocksNotExpired.length > 1)
  ) {
    totalSteps = 3
  }

  return totalSteps
}

export function getButtonWording(enablePricesByCategories: boolean, enabled: boolean, step: Step) {
  if (enablePricesByCategories) {
    switch (step) {
      case Step.DATE: {
        return 'Valider la date'
      }
      case Step.HOUR: {
        return 'Valider lʼhoraire'
      }
      case Step.PRICE: {
        return 'Valider le prix'
      }
      case Step.DUO: {
        return 'Finaliser ma réservation'
      }
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
