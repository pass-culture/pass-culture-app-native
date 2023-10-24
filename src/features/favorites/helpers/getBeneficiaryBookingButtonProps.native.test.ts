import { favoriteOfferResponseSnap } from 'features/favorites/fixtures/favoriteOfferResponseSnap'
import { getBeneficiaryBookingButtonProps } from 'features/favorites/helpers/getBeneficiaryBookingButtonProps'
import * as useHasEnoughCreditAPI from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { beneficiaryUser } from 'fixtures/user'

const favoriteOffer = favoriteOfferResponseSnap
const user = beneficiaryUser
const mockOnInAppBooking = jest.fn()

const hasEnoughCreditSpy = jest.spyOn(useHasEnoughCreditAPI, 'hasEnoughCredit')

describe('getBeneficiaryBookingButtonProps', () => {
  it('should return "Offre réservée" and button should be disabled when offer is already booked', () => {
    const buttonProperties = getBeneficiaryBookingButtonProps(
      favoriteOffer,
      true,
      true,
      user,
      mockOnInAppBooking
    )

    expect(buttonProperties).toEqual({
      wording: 'Offre réservée',
      disabled: true,
    })
  })

  it('should return "Offre épuisée" and button should be disabled when offer is not released', () => {
    const buttonProperties = getBeneficiaryBookingButtonProps(
      { ...favoriteOffer, isReleased: false },
      true,
      false,
      user,
      mockOnInAppBooking
    )

    expect(buttonProperties).toEqual({
      wording: 'Offre expirée',
      disabled: true,
    })
  })

  it('should return "Offre épuisée" and button should be disabled when offer is expired', () => {
    const buttonProperties = getBeneficiaryBookingButtonProps(
      { ...favoriteOffer, isExpired: true },
      true,
      false,
      user,
      mockOnInAppBooking
    )

    expect(buttonProperties).toEqual({
      wording: 'Offre expirée',
      disabled: true,
    })
  })

  it('should return "Crédit insuffisant" and button should be disabled when user does not have enough credit and offer is not free', () => {
    hasEnoughCreditSpy.mockReturnValueOnce(false)
    const buttonProperties = getBeneficiaryBookingButtonProps(
      favoriteOffer,
      false,
      false,
      user,
      mockOnInAppBooking
    )

    expect(buttonProperties).toEqual({
      wording: 'Crédit insuffisant',
      disabled: true,
    })
  })

  it('should return "Réserver" and button should be enabled when offer is free', () => {
    const buttonProperties = getBeneficiaryBookingButtonProps(
      favoriteOffer,
      true,
      false,
      user,
      mockOnInAppBooking
    )

    expect(buttonProperties.wording).toEqual('Réserver')
    expect(buttonProperties.accessibilityLabel).toEqual('Réserver l’offre Spectacle de test')
    expect(buttonProperties.onPress).toBeInstanceOf(Function)
  })

  it('should return "Réserver" and button should be enabled when user has enough credit', () => {
    hasEnoughCreditSpy.mockReturnValueOnce(true)
    const buttonProperties = getBeneficiaryBookingButtonProps(
      favoriteOffer,
      false,
      false,
      user,
      mockOnInAppBooking
    )

    expect(buttonProperties.wording).toEqual('Réserver')
    expect(buttonProperties.accessibilityLabel).toEqual('Réserver l’offre Spectacle de test')
    expect(buttonProperties.onPress).toBeInstanceOf(Function)
  })
})
