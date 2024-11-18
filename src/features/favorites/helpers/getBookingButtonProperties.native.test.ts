import { YoungStatusType } from 'api/gen'
import { favoriteOfferResponseSnap } from 'features/favorites/fixtures/favoriteOfferResponseSnap'
import * as getBeneficiaryBookingButtonPropsAPI from 'features/favorites/helpers/getBeneficiaryBookingButtonProps'
import { getBookingButtonProperties } from 'features/favorites/helpers/getBookingButtonProperties'
import * as getEligibleBookingButtonPropsAPI from 'features/favorites/helpers/getEligibleBookingButtonProps'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { getAvailableCredit } from 'shared/user/useAvailableCredit'

const getEligibleBookingButtonPropsSpy = jest.spyOn(
  getEligibleBookingButtonPropsAPI,
  'getEligibleBookingButtonProps'
)

const getBeneficiaryBookingButtonPropsSpy = jest.spyOn(
  getBeneficiaryBookingButtonPropsAPI,
  'getBeneficiaryBookingButtonProps'
)

jest.mock('shared/user/useAvailableCredit')
const mockGetAvailableCredit = getAvailableCredit as jest.MockedFunction<typeof getAvailableCredit>

const favoriteOffer = favoriteOfferResponseSnap
const mockOnInAppBooking = jest.fn()
const user = beneficiaryUser

describe('getBookingButtonProperties', () => {
  describe('when user is eligible', () => {
    it('should call eligible button props helpers', () => {
      getBookingButtonProperties({
        offer: favoriteOffer,
        onInAppBooking: mockOnInAppBooking,
        user: { ...user, status: { statusType: YoungStatusType.eligible } },
      })

      expect(getEligibleBookingButtonPropsSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('when user is beneficiary', () => {
    mockGetAvailableCredit.mockReturnValueOnce({
      amount: 300,
      isExpired: false,
    })

    it('should call eligible button props helpers', () => {
      getBookingButtonProperties({
        offer: favoriteOffer,
        onInAppBooking: mockOnInAppBooking,
        user,
      })

      expect(getBeneficiaryBookingButtonPropsSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('when user is ex beneficiary', () => {
    mockGetAvailableCredit.mockReturnValue({
      amount: 0,
      isExpired: true,
    })

    it('should return "Offre réservée" and button should be disabled when offer is already booked', () => {
      const buttonProps = getBookingButtonProperties({
        offer: favoriteOffer,
        onInAppBooking: mockOnInAppBooking,
        user: { ...user, bookedOffers: { [favoriteOffer.id]: 1 } },
      })

      expect(buttonProps).toEqual({
        wording: 'Offre réservée',
        disabled: true,
      })
    })

    it.each`
      offerStatus
      ${{ isReleased: false }}
      ${{ isExpired: true }}
      ${{ isSoldOut: true }}
    `('should return undefined offer is $offerStatus', ({ offerStatus }) => {
      const buttonProps = getBookingButtonProperties({
        offer: { ...favoriteOffer, ...offerStatus },
        onInAppBooking: mockOnInAppBooking,
        user,
      })

      expect(buttonProps).toBe(undefined)
    })

    it('should return "Réserver" and button should be enabled when offer is free', () => {
      const buttonProps = getBookingButtonProperties({
        offer: { ...favoriteOffer, price: 0 },
        onInAppBooking: mockOnInAppBooking,
        user,
      })

      expect(buttonProps?.wording).toEqual('Réserver')
      expect(buttonProps?.accessibilityLabel).toEqual('Réserver l’offre Spectacle de test')
      expect(buttonProps?.onPress).toBeInstanceOf(Function)
    })

    it('should return external link when offer has external url', () => {
      const buttonProps = getBookingButtonProperties({
        offer: { ...favoriteOffer, price: 200, externalTicketOfficeUrl: 'http://toto.com' },
        onInAppBooking: mockOnInAppBooking,
        user,
      })

      expect(buttonProps?.wording).toEqual('Réserver')
      expect(buttonProps?.accessibilityLabel).toEqual('Réserver l’offre Spectacle de test')
      expect(buttonProps?.externalNav).toEqual({
        url: 'http://toto.com',
        params: {
          analyticsData: {
            offerId: 10000,
          },
        },
      })
    })
  })

  describe('when user is not beneficiary', () => {
    it.each`
      offerStatus
      ${{ isReleased: false }}
      ${{ isExpired: true }}
      ${{ isSoldOut: true }}
    `('should return undefined offer is $offerStatus', ({ offerStatus }) => {
      const buttonProps = getBookingButtonProperties({
        offer: { ...favoriteOffer, ...offerStatus },
        onInAppBooking: mockOnInAppBooking,
        user: nonBeneficiaryUser,
      })

      expect(buttonProps).toBe(undefined)
    })

    it('should return external link when offer has external url', () => {
      const buttonProps = getBookingButtonProperties({
        offer: { ...favoriteOffer, price: 200, externalTicketOfficeUrl: 'http://toto.com' },
        onInAppBooking: mockOnInAppBooking,
        user: nonBeneficiaryUser,
      })

      expect(buttonProps?.wording).toEqual('Réserver')
      expect(buttonProps?.accessibilityLabel).toEqual('Réserver l’offre Spectacle de test')
      expect(buttonProps?.externalNav).toEqual({
        url: 'http://toto.com',
        params: {
          analyticsData: {
            offerId: 10000,
          },
        },
      })
    })
  })
})
