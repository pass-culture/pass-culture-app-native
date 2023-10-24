import React from 'react'

import { SubcategoryIdEnum, WithdrawalTypeEnum } from 'api/gen'
import { TicketBody } from 'features/bookings/components/TicketBody/TicketBody'
import { render, screen } from 'tests/utils'

const initialProps = {
  withdrawalDelay: 0,
  withdrawalDetails: undefined,
  withdrawalType: undefined,
  subcategoryId: SubcategoryIdEnum.EVENEMENT_PATRIMOINE,
  beginningDatetime: '2021-03-15T20:00:00',
  qrCodeData: 'PASSCULTURE:v3;TOKEN:352UW4',
}

describe('TicketBody', () => {
  describe('<QrCode/> display', () => {
    it('should display the QR code when the the booking have a QR code and the offer subcategory allows to have a qr code', () => {
      render(<TicketBody {...initialProps} />)

      expect(screen.queryByTestId('qr-code')).toBeOnTheScreen()
    })

    it('should not display the QR code when event subcategory is in subcategories list without QR code display', () => {
      render(<TicketBody {...initialProps} subcategoryId={SubcategoryIdEnum.FESTIVAL_MUSIQUE} />)

      expect(screen.queryByTestId('qr-code')).not.toBeOnTheScreen()
    })
  })

  describe('Withdrawal', () => {
    it("should not display withdrawal informations for legacy offer that doesn't withdrawal informations", () => {
      render(<TicketBody {...initialProps} withdrawalType={undefined} />)

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
          />
        )

        expect(screen.queryByTestId('withdrawal-info-no-ticket')).toBeOnTheScreen()
      })
    })

    it('should display by email withdrawal delay when delay is specified and email is normally received', () => {
      const twoDays = 60 * 60 * 24 * 2

      render(
        <TicketBody
          {...initialProps}
          subcategoryId={SubcategoryIdEnum.FESTIVAL_MUSIQUE}
          withdrawalType={WithdrawalTypeEnum.by_email}
          withdrawalDelay={twoDays}
        />
      )

      expect(screen.queryByTestId('withdrawal-info-email')).toBeOnTheScreen()
    })

    describe('<TicketWithdrawal/> display', () => {
      it('should display on site withdrawal delay when delay is specified', () => {
        render(
          <TicketBody
            {...initialProps}
            subcategoryId={SubcategoryIdEnum.FESTIVAL_MUSIQUE}
            withdrawalType={WithdrawalTypeEnum.on_site}
          />
        )

        expect(screen.queryByTestId('withdrawal-info')).toBeOnTheScreen()
      })
    })
  })
})
