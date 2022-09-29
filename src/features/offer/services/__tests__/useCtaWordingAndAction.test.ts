import mockdate from 'mockdate'

import { SearchGroupNameEnum, OfferResponse, UserRole } from 'api/gen'
import { offerResponseSnap as baseOffer } from 'features/offer/api/snaps/offerResponseSnap'
import { analytics } from 'libs/firebase/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Subcategory } from 'libs/subcategories/types'

import { getCtaWordingAndAction } from '../useCtaWordingAndAction'

mockdate.set(new Date('2021-01-04T00:00:00Z'))

const mockedUser = {
  email: 'jean@example.com',
  firstName: 'Jean',
  isBeneficiary: true,
  roles: [UserRole.BENEFICIARY],
}
jest.mock('features/profile/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    data: mockedUser,
  })),
}))

describe('getCtaWordingAndAction', () => {
  describe('Non Beneficiary', () => {
    it.each`
      isEvent  | url                      | bookedOffers                 | expected                      | disabled | showBookingModal
      ${true}  | ${undefined}             | ${{}}                        | ${undefined}                  | ${true}  | ${undefined}
      ${true}  | ${'https://url-externe'} | ${{}}                        | ${'Accéder à la billetterie'} | ${false} | ${false}
      ${false} | ${undefined}             | ${{}}                        | ${undefined}                  | ${true}  | ${undefined}
      ${false} | ${'https://url-externe'} | ${{}}                        | ${'Accéder à l’offre'}        | ${false} | ${false}
      ${false} | ${undefined}             | ${{ [baseOffer.id]: 31652 }} | ${'Voir ma réservation'}      | ${false} | ${false}
    `(
      'CTA(disabled=$disabled) = "$expected" for isEvent=$isEvent and url=$url',
      ({ disabled, expected, isEvent, url, bookedOffers, showBookingModal }) => {
        const offer = buildOffer({ externalTicketOfficeUrl: url })
        const subcategory = buildSubcategory({ isEvent })

        const result = getCtaWordingAndAction({
          isLoggedIn: true,
          isBeneficiary: false,
          offer,
          subcategory,
          hasEnoughCredit: true,
          bookedOffers,
          isUnderageBeneficiary: false,
        })
        const { wording, onPress, navigateTo, externalNav } = result || {}
        expect(wording).toEqual(expected)
        expect(onPress === undefined && navigateTo === undefined && externalNav === undefined).toBe(
          disabled
        )
        expect(result?.externalNav?.url).toEqual(url)
        expect(result?.showBookingModal).toEqual(showBookingModal)
      }
    )
  })

  // same as non beneficiary use cases, beneficiary users should not be able to book educational offers
  describe('educational offer', () => {
    it.each`
      isEvent  | url                      | bookedOffers                 | expected                      | disabled | showBookingModal
      ${true}  | ${undefined}             | ${{}}                        | ${undefined}                  | ${true}  | ${undefined}
      ${true}  | ${'https://url-externe'} | ${{}}                        | ${'Accéder à la billetterie'} | ${false} | ${false}
      ${false} | ${undefined}             | ${{}}                        | ${undefined}                  | ${true}  | ${undefined}
      ${false} | ${'https://url-externe'} | ${{}}                        | ${'Accéder à l’offre'}        | ${false} | ${false}
      ${false} | ${undefined}             | ${{ [baseOffer.id]: 31652 }} | ${'Voir ma réservation'}      | ${false} | ${false}
    `(
      'CTA(disabled=$disabled) = "$expected" for isEvent=$isEvent and url=$url',
      ({ disabled, expected, isEvent, url, bookedOffers, showBookingModal }) => {
        const offer = buildOffer({ externalTicketOfficeUrl: url, isEducational: true })
        const subcategory = buildSubcategory({ isEvent })

        const result = getCtaWordingAndAction({
          isLoggedIn: true,
          isBeneficiary: true,
          offer,
          subcategory,
          hasEnoughCredit: true,
          bookedOffers,
          isUnderageBeneficiary: false,
        })
        const { wording, onPress, navigateTo, externalNav } = result || {}
        expect(wording).toEqual(expected)
        expect(onPress === undefined && navigateTo === undefined && externalNav === undefined).toBe(
          disabled
        )
        expect(result?.externalNav?.url).toEqual(url)
        expect(result?.showBookingModal).toEqual(showBookingModal)
      }
    )
  })

  describe('Beneficiary', () => {
    const getCta = (
      partialOffer: Partial<OfferResponse>,
      parameters?: Partial<Parameters<typeof getCtaWordingAndAction>[0]>,
      partialSubcategory?: Partial<Subcategory>
    ) =>
      getCtaWordingAndAction({
        isLoggedIn: true,
        isBeneficiary: true,
        offer: buildOffer(partialOffer),
        subcategory: buildSubcategory(partialSubcategory || {}),
        hasEnoughCredit: true,
        bookedOffers: {},
        isUnderageBeneficiary: true,
        ...parameters,
      }) || { wording: '' }

    it('CTA="Offre épuisée" if offer is sold out', () => {
      const { wording, onPress, navigateTo, externalNav } = getCta({ isSoldOut: true })
      expect(wording).toEqual('Offre épuisée')
      expect(onPress === undefined).toBeTruthy()
      expect(navigateTo === undefined).toBeTruthy()
      expect(externalNav === undefined).toBeTruthy()
    })

    it('CTA="Offre expirée" if offer is expired and sold out', () => {
      const { wording, onPress, navigateTo, externalNav } = getCta({
        isExpired: true,
        isSoldOut: true,
      })
      expect(wording).toEqual('Offre expirée')
      expect(onPress === undefined).toBeTruthy()
      expect(navigateTo === undefined).toBeTruthy()
      expect(externalNav === undefined).toBeTruthy()
    })

    it('CTA="Offre expirée" if offer is expired', () => {
      const { wording, onPress, navigateTo, externalNav } = getCta({ isExpired: true })
      expect(wording).toEqual('Offre expirée')
      expect(onPress === undefined).toBeTruthy()
      expect(navigateTo === undefined).toBeTruthy()
      expect(externalNav === undefined).toBeTruthy()
    })

    it('CTA="Offre expirée" if offer is expired', () => {
      const { wording, onPress, navigateTo, externalNav } = getCta({ isReleased: false })
      expect(wording).toEqual('Offre expirée')
      expect(onPress === undefined).toBeTruthy()
      expect(navigateTo === undefined).toBeTruthy()
      expect(externalNav === undefined).toBeTruthy()
    })

    it('CTA="Réserver" if offer is an ended booking', () => {
      const { wording, onPress, showBookingModal, navigateTo, externalNav } = getCta(
        {},
        { isEndedUsedBooking: true }
      )
      expect(wording).toEqual('Réserver')
      expect(onPress).toBeTruthy()
      expect(showBookingModal).toBeTruthy()
      expect(navigateTo === undefined).toBeTruthy()
      expect(externalNav === undefined).toBeTruthy()
    })

    // offer price is 5
    it.each`
      isEvent  | hasEnoughCredit | expected                     | disabled | showBookingModal
      ${false} | ${true}         | ${'Réserver'}                | ${false} | ${true}
      ${true}  | ${true}         | ${'Voir les disponibilités'} | ${false} | ${true}
    `(
      'If credit is enough, only iOS user cannot book on Thing type offers | $isEvent => $expected - digital offers',
      ({
        disabled,
        expected,
        hasEnoughCredit,
        isEvent,
        showBookingModal: mustShowBookingModal,
      }) => {
        const { wording, onPress, navigateTo, externalNav, showBookingModal } = getCta(
          { isDigital: true },
          { hasEnoughCredit, isUnderageBeneficiary: false },
          { isEvent }
        )
        expect(wording).toEqual(expected)
        expect(onPress === undefined && navigateTo === undefined && externalNav === undefined).toBe(
          disabled
        )
        expect(showBookingModal).toEqual(mustShowBookingModal)
      }
    )

    // offer price is 5
    it.each`
      hasEnoughCredit | isDigital | expected                          | disabled | isUnderageBeneficiary | showBookingModal
      ${false}        | ${true}   | ${'Crédit numérique insuffisant'} | ${true}  | ${false}              | ${undefined}
      ${true}         | ${true}   | ${'Réserver'}                     | ${false} | ${false}              | ${true}
      ${false}        | ${false}  | ${'Crédit insuffisant'}           | ${true}  | ${false}              | ${undefined}
      ${false}        | ${false}  | ${'Crédit insuffisant'}           | ${true}  | ${true}               | ${undefined}
      ${true}         | ${false}  | ${'Réserver'}                     | ${false} | ${false}              | ${true}
    `(
      'check is credit is enough | non event x $isDigital => $expected',
      ({
        disabled,
        expected,
        hasEnoughCredit,
        isDigital,
        isUnderageBeneficiary,
        showBookingModal: mustShowBookingModal,
      }) => {
        const { wording, onPress, navigateTo, externalNav, showBookingModal } = getCta(
          { isDigital },
          { hasEnoughCredit, isUnderageBeneficiary },
          { isEvent: false }
        )
        expect(wording).toEqual(expected)
        expect(showBookingModal).toEqual(mustShowBookingModal)
        expect(onPress === undefined && navigateTo === undefined && externalNav === undefined).toBe(
          disabled
        )
      }
    )

    // offer price is 5
    it.each`
      isEvent  | hasEnoughCredit | expected                     | disabled | showBookingModal
      ${false} | ${false}        | ${'Crédit insuffisant'}      | ${true}  | ${undefined}
      ${false} | ${true}         | ${'Réserver'}                | ${false} | ${true}
      ${true}  | ${false}        | ${'Crédit insuffisant'}      | ${true}  | ${undefined}
      ${true}  | ${true}         | ${'Voir les disponibilités'} | ${false} | ${true}
    `(
      'check if Credit is enough for the category | $isEvent | creditThing=$creditThing | creditEvent=$creditEvent => $expected',
      ({
        disabled,
        expected,
        hasEnoughCredit,
        isEvent,
        showBookingModal: mustShowBookingModal,
      }) => {
        const { wording, onPress, navigateTo, externalNav, showBookingModal } = getCta(
          {},
          { hasEnoughCredit },
          { isEvent }
        )
        expect(wording).toEqual(expected)
        expect(onPress === undefined && navigateTo === undefined && externalNav === undefined).toBe(
          disabled
        )
        expect(showBookingModal).toEqual(mustShowBookingModal)
      }
    )

    // offer price is 5
    it.each`
      hasEnoughCredit | expected                          | disabled | showBookingModal
      ${false}        | ${'Crédit numérique insuffisant'} | ${true}  | ${undefined}
      ${true}         | ${'Réserver'}                     | ${false} | ${true}
    `(
      'check if Credit is enough for digital offers | creditThing=$creditThing => $expected',
      ({ disabled, expected, hasEnoughCredit, showBookingModal: mustShowBookingModal }) => {
        const { wording, onPress, navigateTo, externalNav, showBookingModal } = getCta(
          { isDigital: true },
          { hasEnoughCredit, isUnderageBeneficiary: false },
          { isEvent: false }
        )
        expect(wording).toEqual(expected)
        expect(onPress === undefined && navigateTo === undefined && externalNav === undefined).toBe(
          disabled
        )
        expect(showBookingModal).toBe(mustShowBookingModal)
      }
    )

    // same as beneficiaries except for video games and non free digital offers except press category
    describe('underage beneficiary', () => {
      it.each`
        isEvent  | expected                     | disabled | isDigital | category                          | price | isForbiddenToUnderage | showBookingModal
        ${false} | ${'Réserver'}                | ${false} | ${true}   | ${SearchGroupNameEnum.PRESSE}     | ${20} | ${false}              | ${true}
        ${true}  | ${'Voir les disponibilités'} | ${false} | ${true}   | ${SearchGroupNameEnum.FILM}       | ${20} | ${false}              | ${true}
        ${true}  | ${'Voir les disponibilités'} | ${false} | ${true}   | ${SearchGroupNameEnum.FILM}       | ${0}  | ${false}              | ${true}
        ${false} | ${'Réserver'}                | ${false} | ${false}  | ${SearchGroupNameEnum.JEU}        | ${0}  | ${false}              | ${true}
        ${true}  | ${'Voir les disponibilités'} | ${false} | ${false}  | ${SearchGroupNameEnum.INSTRUMENT} | ${20} | ${false}              | ${true}
        ${true}  | ${undefined}                 | ${true}  | ${false}  | ${SearchGroupNameEnum.INSTRUMENT} | ${20} | ${true}               | ${undefined}
      `(
        'CTA(disabled=$disabled) = "$expected" for isEvent=$isEvent, isDigital=$isDigital, isForbiddenToUnderage=$isForbiddenToUnderage, category=$category and price=$price',
        ({
          isEvent,
          expected,
          disabled,
          isDigital,
          category,
          price,
          isForbiddenToUnderage,
          showBookingModal: mustShowBookingModal,
        }) => {
          mockedUser.roles = [UserRole.UNDERAGE_BENEFICIARY]
          const { wording, onPress, navigateTo, externalNav, showBookingModal } = getCta(
            {
              isDigital,
              isForbiddenToUnderage,
              stocks: [
                {
                  id: 118929,
                  beginningDatetime: '2021-01-04T13:30:00',
                  isBookable: true,
                  isExpired: false,
                  isSoldOut: false,
                  isForbiddenToUnderage,
                  price,
                },
              ],
            },
            { isUnderageBeneficiary: true },
            { isEvent, searchGroupName: category }
          )
          expect(wording).toEqual(expected)
          expect(showBookingModal).toEqual(mustShowBookingModal)
          expect(
            onPress === undefined && navigateTo === undefined && externalNav === undefined
          ).toBe(disabled)
        }
      )
    })
  })

  describe('CTA - Analytics', () => {
    it('logs event ClickBookOffer when we click CTA "Réserver" (beneficiary user)', () => {
      const offer = buildOffer({ externalTicketOfficeUrl: 'https://www.google.com' })
      const subcategory = buildSubcategory({ isEvent: false })

      const { onPress } =
        getCtaWordingAndAction({
          isLoggedIn: true,
          isBeneficiary: true,
          offer,
          subcategory,
          hasEnoughCredit: true,
          bookedOffers: {},
          isUnderageBeneficiary: false,
        }) || {}

      expect(analytics.logClickBookOffer).toBeCalledTimes(0)
      expect(onPress).not.toBeUndefined()

      if (onPress) onPress()
      expect(analytics.logClickBookOffer).toBeCalledTimes(1)
      expect(analytics.logClickBookOffer).toBeCalledWith(baseOffer.id)
    })

    it('logs event ConsultAvailableDates when we click CTA "Voir les disponibilités" (beneficiary user)', () => {
      const offer = buildOffer({})
      const subcategory = buildSubcategory({ isEvent: true })

      const { onPress } =
        getCtaWordingAndAction({
          isLoggedIn: true,
          isBeneficiary: true,
          offer,
          subcategory,
          hasEnoughCredit: true,
          bookedOffers: {},
          isUnderageBeneficiary: false,
        }) || {}

      expect(analytics.logConsultAvailableDates).toBeCalledTimes(0)
      expect(onPress).not.toBeUndefined()

      if (onPress) onPress()
      expect(analytics.logConsultAvailableDates).toBeCalledTimes(1)
      expect(analytics.logConsultAvailableDates).toBeCalledWith(baseOffer.id)
    })
  })
})

const buildOffer = (partialOffer: Partial<OfferResponse>): OfferResponse => ({
  ...baseOffer,
  ...partialOffer,
})

const baseSubcategory = placeholderData.subcategories[0]
const buildSubcategory = (partialSubcategory: Partial<Subcategory>): Subcategory => ({
  ...baseSubcategory,
  ...partialSubcategory,
})
