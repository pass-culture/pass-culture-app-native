import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { mockStocks, stock1, stock2, stock3, stock4 } from 'features/bookOffer/fixtures/stocks'
import {
  getButtonState,
  getButtonWording,
  getHourWording,
  getRadioSelectorPriceState,
  getPriceWording,
  getPreviousStep,
  getSortedHoursFromDate,
  sortByDateStringPredicate,
  getStockSortedByPriceFromHour,
  getDistinctPricesFromAllStock,
  getStockWithCategory,
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

  it('should return an empty string when stock is not sold out', () => {
    const priceWording = getPriceWording({ ...stock1, remainingQuantity: 1 }, 25000)
    expect(priceWording).toEqual('')
  })
})

describe('getPreviousStep', () => {
  const defaultBookingState: BookingState = {
    step: Step.DATE,
    offerId: offerResponseSnap.id,
    hour: undefined,
    stockId: undefined,
    quantity: undefined,
    date: undefined,
  }

  it('should return to date step when current step is hour', () => {
    const previousStep = getPreviousStep(
      { ...defaultBookingState, step: Step.HOUR },
      offerResponseSnap.stocks
    )
    expect(previousStep).toEqual(Step.DATE)
  })

  describe('should return to hour step', () => {
    it('when current step is price', () => {
      const previousStep = getPreviousStep({ ...defaultBookingState, step: Step.PRICE }, mockStocks)
      expect(previousStep).toEqual(Step.HOUR)
    })

    it('when current step is duo and has not several stock', () => {
      const previousStep = getPreviousStep(
        { ...defaultBookingState, step: Step.DUO },
        [stock1],
        true
      )
      expect(previousStep).toEqual(Step.HOUR)
    })

    it('when current step is confirmation, offer is not duo and has not several stock', () => {
      const previousStep = getPreviousStep({ ...defaultBookingState, step: Step.CONFIRMATION }, [
        stock1,
      ])
      expect(previousStep).toEqual(Step.HOUR)
    })
  })

  describe('should return to price step', () => {
    it('when current step is duo and has several stocks', () => {
      const previousStep = getPreviousStep(
        { ...defaultBookingState, step: Step.DUO, hour: '2023-04-01T18:00:00Z' },
        mockStocks,
        true
      )
      expect(previousStep).toEqual(Step.PRICE)
    })

    it('when current step is confirmation, offer is not duo and has several stocks', () => {
      const previousStep = getPreviousStep(
        { ...defaultBookingState, step: Step.CONFIRMATION, hour: '2023-04-01T18:00:00Z' },
        mockStocks
      )
      expect(previousStep).toEqual(Step.PRICE)
    })
  })

  it('should return to duo step when current step is confirmation and offer is duo', () => {
    const previousStep = getPreviousStep(
      { ...defaultBookingState, step: Step.CONFIRMATION },
      mockStocks,
      true
    )
    expect(previousStep).toEqual(Step.DUO)
  })
})

describe('getSortedHoursFromDate', () => {
  it('should return an array of sorted hours from date', () => {
    const sortedHours = getSortedHoursFromDate(mockStocks, '2023-04-01')
    expect(sortedHours).toEqual([
      '2023-04-01T18:00:00Z',
      '2023-04-01T18:00:00Z',
      '2023-04-01T18:00:00Z',
      '2023-04-01T20:00:00Z',
    ])
  })
})

describe('getStockSortedByPriceFromHour', () => {
  it('should return an array of stocks from highest to lowest price from hour', () => {
    const stocks = getStockSortedByPriceFromHour(mockStocks, '2023-04-01T18:00:00Z')
    expect(stocks).toEqual([stock2, stock4, stock3])
  })
})

describe('sortByDateStringPredicate', () => {
  it('should return -1 when dates not defined', () => {
    const predicate = sortByDateStringPredicate(undefined, undefined)
    expect(predicate).toEqual(-1)
  })
})

describe('getDistinctPricesFromAllStock', () => {
  it('should return only one price when several stocks have the same price', () => {
    const distinctPrices = getDistinctPricesFromAllStock([
      { ...stock1, price: 22000 },
      stock2,
      stock3,
      stock4,
    ])
    expect(distinctPrices).toEqual([22000, 10000, 19000])
  })

  it('should not return several prices when several stocks have the same price', () => {
    const distinctPrices = getDistinctPricesFromAllStock([
      { ...stock1, price: 22000 },
      stock2,
      stock3,
      stock4,
    ])
    expect(distinctPrices).not.toEqual([22000, 22000, 10000, 19000])
  })
})

describe('getStockWithCategory', () => {
  it('should return an empty array when stock not defined', () => {
    const stockWithCategory = getStockWithCategory()
    expect(stockWithCategory).toEqual([])
  })

  it('should return all stock with category when stock defined and hour and date not defined', () => {
    const stockWithCategory = getStockWithCategory([
      { ...stock1, priceCategoryLabel: null },
      stock2,
      stock3,
      stock4,
    ])
    expect(stockWithCategory).toEqual([stock2, stock3, stock4])
  })

  it('should return stock with category from hour when stock, hour and date defined', () => {
    const stockWithCategory = getStockWithCategory(
      mockStocks,
      new Date('2023-04-01T20:00:00Z'),
      '2023-04-01T20:00:00Z'
    )
    expect(stockWithCategory).toEqual([stock1])
  })

  it('should return stock with category from date when stock and date defined and hour not defined', () => {
    const stockWithCategory = getStockWithCategory(
      [
        { ...stock1, beginningDatetime: '2023-04-02T20:00:00Z' },
        { ...stock2, beginningDatetime: '2023-04-01T20:00:00Z' },
        stock3,
        stock4,
      ],
      new Date('2023-04-01T20:00:00Z')
    )
    expect(stockWithCategory).toEqual([
      { ...stock2, beginningDatetime: '2023-04-01T20:00:00Z' },
      stock3,
      stock4,
    ])
  })
})
