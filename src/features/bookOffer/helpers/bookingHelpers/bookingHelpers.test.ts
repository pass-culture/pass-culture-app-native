import { OfferStockResponse } from 'api/gen'
import { BookingState, Step } from 'features/bookOffer/context/reducer'
import {
  getButtonState,
  getTotalBookingSteps,
  getButtonWording,
} from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'

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
    describe('when prices by categories feature flag desactivated', () => {
      describe('should return false', () => {
        it('when stock id & quantity not selected', () => {
          const buttonState = getButtonState(false, defaultBookingState)
          expect(buttonState).toEqual(false)
        })

        it('when stock id selected & quantity not selected', () => {
          const buttonState = getButtonState(false, { ...defaultBookingState, stockId: 1 })
          expect(buttonState).toEqual(false)
        })

        it('when stock id not selected & quantity selected', () => {
          const buttonState = getButtonState(false, { ...defaultBookingState, quantity: 1 })
          expect(buttonState).toEqual(false)
        })
      })

      it('should return true when stock id & quantity selected', () => {
        const buttonState = getButtonState(false, {
          ...defaultBookingState,
          stockId: 1,
          quantity: 1,
        })
        expect(buttonState).toEqual(true)
      })
    })

    describe('when prices by categories feature flag activated', () => {
      describe('should return false', () => {
        it('when step is date selection & date not selected', () => {
          const buttonState = getButtonState(true, defaultBookingState)
          expect(buttonState).toEqual(false)
        })

        it('when step is hour selection & hour & stock not selected', () => {
          const buttonState = getButtonState(true, { ...defaultBookingState, step: Step.HOUR })
          expect(buttonState).toEqual(false)
        })

        it('when step is price selection & stock not selected', () => {
          const buttonState = getButtonState(true, { ...defaultBookingState, step: Step.PRICE })
          expect(buttonState).toEqual(false)
        })

        it('when step is quantity selection & quantity not selected', () => {
          const buttonState = getButtonState(true, { ...defaultBookingState, step: Step.DUO })
          expect(buttonState).toEqual(false)
        })
      })

      describe('should return true', () => {
        it('when step is date selection & date selected', () => {
          const buttonState = getButtonState(true, { ...defaultBookingState, date: new Date() })
          expect(buttonState).toEqual(true)
        })

        describe('when step is hour selection', () => {
          it('& hour selected', () => {
            const buttonState = getButtonState(true, {
              ...defaultBookingState,
              step: Step.HOUR,
              hour: '2023-03-01T20:00:00Z',
            })
            expect(buttonState).toEqual(true)
          })

          it('& stock selected', () => {
            const buttonState = getButtonState(true, {
              ...defaultBookingState,
              step: Step.HOUR,
              stockId: 1,
            })
            expect(buttonState).toEqual(true)
          })

          it('& hour & stock selected', () => {
            const buttonState = getButtonState(true, {
              ...defaultBookingState,
              step: Step.HOUR,
              hour: '2023-03-01T20:00:00Z',
              stockId: 1,
            })
            expect(buttonState).toEqual(true)
          })
        })

        it('when step is price selection & stock selected', () => {
          const buttonState = getButtonState(true, {
            ...defaultBookingState,
            step: Step.PRICE,
            stockId: 1,
          })
          expect(buttonState).toEqual(true)
        })

        it('when step is quantity selection & quantity selected', () => {
          const buttonState = getButtonState(true, {
            ...defaultBookingState,
            step: Step.DUO,
            quantity: 1,
          })
          expect(buttonState).toEqual(true)
        })
      })
    })
  })

  describe('getTotalBookingsSteps', () => {
    const stock1: OfferStockResponse = {
      activationCode: null,
      beginningDatetime: '2023-04-01T18:00:00Z',
      bookingLimitDatetime: '2023-04-01T18:00:00Z',
      cancellationLimitDatetime: '2023-03-08T11:35:34.283195Z',
      id: 18758,
      isBookable: true,
      isExpired: false,
      isForbiddenToUnderage: false,
      isSoldOut: false,
      price: 21000,
      priceCategoryLabel: 'Tribune présidentielle',
      remainingQuantity: 200,
    }
    const stock2: OfferStockResponse = {
      activationCode: null,
      beginningDatetime: '2023-04-01T18:00:00Z',
      bookingLimitDatetime: '2023-04-01T18:00:00Z',
      cancellationLimitDatetime: '2023-03-08T11:35:34.283195Z',
      id: 18757,
      isBookable: true,
      isExpired: false,
      isForbiddenToUnderage: false,
      isSoldOut: false,
      price: 22000,
      priceCategoryLabel: 'Pelouse or',
      remainingQuantity: 200,
    }
    it('should return 2 when only one stock not expired and offer is not duo', () => {
      const stocksExpired = [
        { ...stock1, isExpired: true },
        { ...stock2, isExpired: true },
      ]
      const totalSteps = getTotalBookingSteps(stocksExpired)
      expect(totalSteps).toEqual(2)
    })

    it('should return 4 when several stocks not expired and offer is duo', () => {
      const stocks = [stock1, stock2]
      const totalSteps = getTotalBookingSteps(stocks, true)
      expect(totalSteps).toEqual(4)
    })

    describe('should return 3', () => {
      it('when only one stock not expired and offer is duo', () => {
        const stocks = [{ ...stock1, isExpired: true }, stock2]
        const totalSteps = getTotalBookingSteps(stocks, true)
        expect(totalSteps).toEqual(3)
      })

      it('when several stock not expired and offer is not duo', () => {
        const stocks = [stock1, stock2]
        const totalSteps = getTotalBookingSteps(stocks, false)
        expect(totalSteps).toEqual(3)
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
})
