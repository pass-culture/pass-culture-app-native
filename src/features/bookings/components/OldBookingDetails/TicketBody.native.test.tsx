import mockdate from 'mockdate'
import React from 'react'

import { SubcategoryIdEnum, WithdrawalTypeEnum } from 'api/gen'
import { TicketBody } from 'features/bookings/components/OldBookingDetails/TicketBody/TicketBody'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockBuilder } from 'tests/mockBuilder'
import { render, screen } from 'tests/utils'

const initialProps = {
  withdrawalDelay: 0,
  withdrawalDetails: undefined,
  withdrawalType: undefined,
  subcategoryId: SubcategoryIdEnum.EVENEMENT_PATRIMOINE,
  beginningDatetime: '2021-03-15T20:00:00',
  qrCodeData: 'PASSCULTURE:v3;TOKEN:352UW4',
}

let mockIsMailAppAvailable = true
jest.mock('features/auth/helpers/useIsMailAppAvailable', () => ({
  useIsMailAppAvailable: jest.fn(() => mockIsMailAppAvailable),
}))

const venue = mockBuilder.bookingVenueResponse()

mockdate.set('2021-03-10T20:00:00')

describe('TicketBody', () => {
  beforeEach(() => {
    mockIsMailAppAvailable = true
  })

  describe('<QrCode/> display', () => {
    it('should display the QR code when the the booking have a QR code and the offer subcategory allows to have a qr code', () => {
      render(
        <TicketBody {...initialProps} subcategoryId={SubcategoryIdEnum.PARTITION} venue={venue} />
      )

      expect(screen.getByTestId('qr-code')).toBeOnTheScreen()
    })

    it('should not display the QR code when event subcategory is in subcategories list without QR code display', () => {
      render(
        <TicketBody
          {...initialProps}
          subcategoryId={SubcategoryIdEnum.FESTIVAL_MUSIQUE}
          venue={venue}
        />
      )

      expect(screen.queryByTestId('qr-code')).not.toBeOnTheScreen()
    })
  })

  describe('QrCode for external bookings', () => {
    describe('concert or festival', () => {
      describe('when FF enableHideTicket is true', () => {
        beforeEach(() => {
          setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_HIDE_TICKET])
        })

        it('should be hidden until 2 days before the event', () => {
          render(
            <TicketBody
              {...initialProps}
              subcategoryId={SubcategoryIdEnum.FESTIVAL_MUSIQUE}
              externalBookings={{ barcode: 'barcode' }}
              venue={venue}
            />
          )

          expect(screen.queryByTestId('qr-code')).not.toBeOnTheScreen()
        })

        it('should be displayed 2 days before the event', () => {
          render(
            <TicketBody
              {...initialProps}
              beginningDatetime="2021-03-11T20:00:00"
              subcategoryId={SubcategoryIdEnum.FESTIVAL_MUSIQUE}
              externalBookings={{ barcode: 'barcode' }}
              venue={venue}
            />
          )

          expect(screen.getByTestId('qr-code')).toBeOnTheScreen()
        })
      })

      it('should display the availability date', () => {
        render(
          <TicketBody
            {...initialProps}
            beginningDatetime="2021-03-13T20:00:00"
            subcategoryId={SubcategoryIdEnum.FESTIVAL_MUSIQUE}
            externalBookings={{ barcode: 'barcode' }}
            venue={venue}
          />
        )

        expect(screen.getByText('11 mars 2021')).toBeOnTheScreen()
      })

      it('should display the availability time', () => {
        render(
          <TicketBody
            {...initialProps}
            beginningDatetime="2021-03-13T20:00:00"
            subcategoryId={SubcategoryIdEnum.FESTIVAL_MUSIQUE}
            externalBookings={{ barcode: 'barcode' }}
            venue={venue}
          />
        )

        expect(screen.getByText('à 21h00')).toBeOnTheScreen()
      })

      describe('when FF enableHideTicket is false', () => {
        beforeEach(() => {
          setFeatureFlags()
        })

        it('should not be hidden even until 2 days before the event', () => {
          render(
            <TicketBody
              {...initialProps}
              subcategoryId={SubcategoryIdEnum.FESTIVAL_MUSIQUE}
              externalBookings={{ barcode: 'barcode' }}
              venue={venue}
            />
          )

          expect(screen.getByTestId('qr-code')).toBeOnTheScreen()
        })
      })
    })

    it('should be displayed when it is not a concert or festival', () => {
      render(
        <TicketBody
          {...initialProps}
          subcategoryId={SubcategoryIdEnum.EVENEMENT_PATRIMOINE}
          externalBookings={{ barcode: 'barcode' }}
          venue={venue}
        />
      )

      expect(screen.getByTestId('qr-code')).toBeOnTheScreen()
    })
  })

  describe('Withdrawal', () => {
    it("should not display withdrawal informations for legacy offer that doesn't withdrawal informations", () => {
      render(<TicketBody {...initialProps} withdrawalType={undefined} venue={venue} />)

      expect(screen.queryByTestId('withdrawal-info')).not.toBeOnTheScreen()
    })

    describe('<NoTicket/> display', () => {
      it('should display no ticket withdrawal wording', () => {
        render(
          <TicketBody
            {...initialProps}
            subcategoryId={SubcategoryIdEnum.FESTIVAL_MUSIQUE}
            withdrawalType={WithdrawalTypeEnum.no_ticket}
            withdrawalDelay={0}
            venue={venue}
          />
        )

        expect(screen.getByTestId('withdrawal-info-no-ticket')).toBeOnTheScreen()
      })
    })

    it('should display by email withdrawal delay when delay is specified and email is normally received', () => {
      const twoDays = 60 * 60 * 24 * 2

      render(
        <TicketBody
          {...initialProps}
          beginningDatetime="2021-03-11T20:00:00"
          subcategoryId={SubcategoryIdEnum.FESTIVAL_MUSIQUE}
          withdrawalType={WithdrawalTypeEnum.by_email}
          withdrawalDelay={twoDays}
          venue={venue}
        />
      )

      expect(screen.getByTestId('withdrawal-info-email')).toBeOnTheScreen()
    })

    describe('<TicketWithdrawal/> display', () => {
      it('should display on site withdrawal delay when delay is specified', () => {
        render(
          <TicketBody
            {...initialProps}
            subcategoryId={SubcategoryIdEnum.FESTIVAL_MUSIQUE}
            withdrawalType={WithdrawalTypeEnum.on_site}
            venue={venue}
          />
        )

        expect(screen.getByTestId('withdrawal-info')).toBeOnTheScreen()
      })
    })

    describe('Consulter mes e-mails display', () => {
      it('should show the button to open mail', async () => {
        render(<TicketBody {...initialProps} withdrawalType={undefined} venue={venue} />)

        const checkEmailsButton = screen.queryByText('Consulter mes e-mails')

        expect(checkEmailsButton).toBeNull()
      })

      it('should not show the button to open mail if no mail app is available', async () => {
        mockIsMailAppAvailable = false

        render(<TicketBody {...initialProps} withdrawalType={undefined} venue={venue} />)

        const checkEmailsButton = screen.queryByText('Consulter mes e-mails')

        expect(checkEmailsButton).toBeNull()
      })
    })
  })
})
