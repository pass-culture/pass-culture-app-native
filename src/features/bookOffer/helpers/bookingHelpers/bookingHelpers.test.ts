import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { mockStocks, stock1, stock2, stock3 } from 'features/bookOffer/fixtures/stocks'
import {
  getButtonState,
  getButtonWording,
  getHourWording,
  getRadioSelectorPriceState,
  getPriceWording,
  getPreviousStep,
  getBookingSteps,
  getSortedHoursFromDate,
  getStocksFromHour,
  sortByDateStringPredicate,
} from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { RadioSelectorType } from 'ui/components/radioSelector/RadioSelector'

describe('bookingHelpers', () => {
  describe('getButtonState', () => {
    const defaultBookingState: BookingState = {
      offerId: 1,
      stockId: undefined,
      step: Step.DATE,
      quantity: undefined,
      date: undefined,
      hour: undefined,
    }

    describe('should return false', () => {
      it('when step is date selection & date not selected', () => {
        const buttonState = getButtonState(defaultBookingState)
        expect(buttonState).toEqual(false)
      })

      it('when step is hour selection & hour & stock not selected', () => {
        const buttonState = getButtonState({ ...defaultBookingState, step: Step.HOUR })
        expect(buttonState).toEqual(false)
      })

      it('when step is price selection & stock not selected', () => {
        const buttonState = getButtonState({ ...defaultBookingState, step: Step.PRICE })
        expect(buttonState).toEqual(false)
      })

      it('when step is quantity selection & quantity not selected', () => {
        const buttonState = getButtonState({ ...defaultBookingState, step: Step.DUO })
        expect(buttonState).toEqual(false)
      })
    })

    describe('should return true', () => {
      it('when step is date selection & date selected', () => {
        const buttonState = getButtonState({ ...defaultBookingState, date: new Date() })
        expect(buttonState).toEqual(true)
      })

      describe('when step is hour selection', () => {
        it('& hour selected', () => {
          const buttonState = getButtonState({
            ...defaultBookingState,
            step: Step.HOUR,
            hour: '2023-03-01T20:00:00Z',
          })
          expect(buttonState).toEqual(true)
        })

        it('& stock selected', () => {
          const buttonState = getButtonState({
            ...defaultBookingState,
            step: Step.HOUR,
            stockId: 1,
          })
          expect(buttonState).toEqual(true)
        })

        it('& hour & stock selected', () => {
          const buttonState = getButtonState({
            ...defaultBookingState,
            step: Step.HOUR,
            hour: '2023-03-01T20:00:00Z',
            stockId: 1,
          })
          expect(buttonState).toEqual(true)
        })
      })

      it('when step is price selection & stock selected', () => {
        const buttonState = getButtonState({
          ...defaultBookingState,
          step: Step.PRICE,
          stockId: 1,
        })
        expect(buttonState).toEqual(true)
      })

      it('when step is quantity selection & quantity selected', () => {
        const buttonState = getButtonState({
          ...defaultBookingState,
          step: Step.DUO,
          quantity: 1,
        })
        expect(buttonState).toEqual(true)
      })
    })
  })

  describe('getBookingSteps', () => {
    it('should return an array with date and hour steps when only one stock not expired and offer is not duo', () => {
      const stocksExpired = [
        { ...stock1, isExpired: true },
        { ...stock2, isExpired: true },
      ]
      const bookingSteps = getBookingSteps(stocksExpired)
      expect(bookingSteps).toEqual([Step.DATE, Step.HOUR])
    })

    it('should return an array with date, hour, price and quantity steps when several stocks not expired and offer is duo', () => {
      const stocks = [stock1, stock2]
      const bookingSteps = getBookingSteps(stocks, true)
      expect(bookingSteps).toEqual([Step.DATE, Step.HOUR, Step.PRICE, Step.DUO])
    })

    it('should return an array with date, hour and duo steps when only one stock not expired and offer is duo', () => {
      const stocks = [{ ...stock1, isExpired: true }, stock2]
      const bookingSteps = getBookingSteps(stocks, true)
      expect(bookingSteps).toEqual([Step.DATE, Step.HOUR, Step.DUO])
    })

    it('should return an array with date, hour and price steps when several stock not expired and offer is not duo', () => {
      const stocks = [stock1, stock2]
      const bookingSteps = getBookingSteps(stocks, false)
      expect(bookingSteps).toEqual([Step.DATE, Step.HOUR, Step.PRICE])
    })
  })

  describe('getButtonWording', () => {
    describe('when prices by categories feature flag desactivated', () => {
      it('should return "Valider ces options" when button is enabled', () => {
        const wordingButton = getButtonWording(false, true, Step.DATE)
        expect(wordingButton).toEqual('Valider ces options')
      })

      it('should return "Choisir les options" when button is disabled', () => {
        const wordingButton = getButtonWording(false, false, Step.DATE)
        expect(wordingButton).toEqual('Choisir les options')
      })
    })

    describe('when prices by categories feature flag activated', () => {
      it('should return "Valider la date" when step is date selection', () => {
        const wordingButton = getButtonWording(true, false, Step.DATE)
        expect(wordingButton).toEqual('Valider la date')
      })

      it('should return "Valider lʼhoraire" when step is hour selection', () => {
        const wordingButton = getButtonWording(true, false, Step.HOUR)
        expect(wordingButton).toEqual('Valider lʼhoraire')
      })

      it('should return "Valider le prix" when step is price selection', () => {
        const wordingButton = getButtonWording(true, false, Step.PRICE)
        expect(wordingButton).toEqual('Valider le prix')
      })

      it('should return "Finaliser ma réservation" when step is quantity selection', () => {
        const wordingButton = getButtonWording(true, false, Step.DUO)
        expect(wordingButton).toEqual('Finaliser ma réservation')
      })
    })
  })

  describe('getHourWording', () => {
    it('should return "crédit insuffisant" when user has not enough credit', () => {
      const hourWording = getHourWording(2000, true, false, true)
      expect(hourWording).toEqual('crédit insuffisant')
    })

    it('should return "dès 20\u00a0€" when offer is bookable, its price is 20 and has several prices', () => {
      const hourWording = getHourWording(2000, true, true, true)
      expect(hourWording).toEqual('dès 20\u00a0€')
    })

    it('should return "20\u00a0€" when offer is bookable, its price is 20 and has not several prices', () => {
      const hourWording = getHourWording(2000, true, true, false)
      expect(hourWording).toEqual('20\u00a0€')
    })

    it('should return "épuisé" when offer is not bookable', () => {
      const hourWording = getHourWording(2000, false, true, false)
      expect(hourWording).toEqual('épuisé')
    })
  })

  describe('getRadioSelectorPriceState', () => {
    it('should return active state when it is the selected stock', () => {
      const radioSelectorState = getRadioSelectorPriceState(stock1, 25000, 18758)
      expect(radioSelectorState).toEqual(RadioSelectorType.ACTIVE)
    })

    it('should return disabled state when stock is sold out', () => {
      const radioSelectorState = getRadioSelectorPriceState(
        { ...stock1, isSoldOut: true },
        25000,
        1
      )
      expect(radioSelectorState).toEqual(RadioSelectorType.DISABLED)
    })

    it('should return disabled state when offer price > user credit', () => {
      const radioSelectorState = getRadioSelectorPriceState(stock1, 5000, 1)
      expect(radioSelectorState).toEqual(RadioSelectorType.DISABLED)
    })

    it('should return default state when stock is not selected, not sold out and price <= user credit', () => {
      const radioSelectorState = getRadioSelectorPriceState(stock1, 25000, 1)
      expect(radioSelectorState).toEqual(RadioSelectorType.DEFAULT)
    })
  })
})

describe('getPriceWording', () => {
  it('should return "Épuisé" when stock is sold out', () => {
    const priceWording = getPriceWording({ ...stock1, isSoldOut: true }, 25000)
    expect(priceWording).toEqual('Épuisé')
  })

  it('should return "Crédit insuffisant" when offer price > user credit', () => {
    const priceWording = getPriceWording(stock1, 2500)
    expect(priceWording).toEqual('Crédit insuffisant')
  })

  it('should return "1 place restante" when stock is 1', () => {
    const priceWording = getPriceWording({ ...stock1, remainingQuantity: 1 }, 25000)
    expect(priceWording).toEqual('1 place restante')
  })

  it('should return "200 places restantes" when stock is 200', () => {
    const priceWording = getPriceWording(stock1, 25000)
    expect(priceWording).toEqual('200 places restantes')
  })
})

describe('getPreviousStep', () => {
  it('should return to date step when current step is hour', () => {
    const previousStep = getPreviousStep(Step.HOUR, offerResponseSnap)
    expect(previousStep).toEqual(Step.DATE)
  })

  describe('should return to hour step', () => {
    it('when current step is price', () => {
      const previousStep = getPreviousStep(Step.PRICE, { ...offerResponseSnap, stocks: mockStocks })
      expect(previousStep).toEqual(Step.HOUR)
    })

    it('when current step is duo and has not several stock', () => {
      const previousStep = getPreviousStep(Step.DUO, { ...offerResponseSnap, stocks: [stock1] })
      expect(previousStep).toEqual(Step.HOUR)
    })

    it('when current step is confirmation, offer is not duo and has not several stock', () => {
      const previousStep = getPreviousStep(Step.CONFIRMATION, {
        ...offerResponseSnap,
        stocks: [stock1],
        isDuo: false,
      })
      expect(previousStep).toEqual(Step.HOUR)
    })
  })

  describe('should return to price step', () => {
    it('when current step is duo and has several stocks', () => {
      const previousStep = getPreviousStep(Step.DUO, {
        ...offerResponseSnap,
        stocks: mockStocks,
      })
      expect(previousStep).toEqual(Step.PRICE)
    })

    it('when current step is confirmation, offer is not duo and has several stocks', () => {
      const previousStep = getPreviousStep(Step.CONFIRMATION, {
        ...offerResponseSnap,
        stocks: mockStocks,
        isDuo: false,
      })
      expect(previousStep).toEqual(Step.PRICE)
    })
  })

  it('should return to duo step when current step is confirmation and offer is duo', () => {
    const previousStep = getPreviousStep(Step.CONFIRMATION, {
      ...offerResponseSnap,
    })
    expect(previousStep).toEqual(Step.DUO)
  })
})

describe('getSortedHoursFromDate', () => {
  it('should return an array of sorted hours from date', () => {
    const sortedHours = getSortedHoursFromDate(mockStocks, '2023-04-01')
    expect(sortedHours).toEqual([
      '2023-04-01T18:00:00Z',
      '2023-04-01T18:00:00Z',
      '2023-04-01T20:00:00Z',
    ])
  })
})

describe('getStocksFromHour', () => {
  it('should return an array of stocks from hour', () => {
    const stocks = getStocksFromHour(mockStocks, '2023-04-01T18:00:00Z')
    expect(stocks).toEqual([stock2, stock3])
  })
})

describe('sortByDateStringPredicate', () => {
  it('should return -1 when dates not defined', () => {
    const predicate = sortByDateStringPredicate(undefined, undefined)
    expect(predicate).toEqual(-1)
  })
})
